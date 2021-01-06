import { CANVAS_WH } from '../constants'

export function loadImage(path) {
  const reader = new FileReader()

  return new Promise((res, rej) => {
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => res(img)
      img.src = event.target.result
    }
    
    reader.readAsDataURL(path)      
  })
}

export function canvasRender(ctx, fill, image, { xOffset, yOffset, scale, showPreview }, generator) {
  ctx.clearRect(0, 0, CANVAS_WH, CANVAS_WH)

  if(fill) {
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, CANVAS_WH, CANVAS_WH)
  }

  if(image && showPreview) {
    const width = image.width * (scale || 1)
    const height = image.height * (scale || 1)

    const x = CANVAS_WH * 0.5 - width * 0.5 - (typeof xOffset !== 'number' ? 0 : xOffset)
    const y = CANVAS_WH * 0.5 - height * 0.5 - (typeof yOffset !== 'number' ? 0 : yOffset)

    ctx.drawImage(image, x, y, width, height)
  }

  if(generator) {
    ctx.strokeStyle = 'red'

    generator.path.forEach(({ start, end }) => {
      ctx.stroke(new Path2D(`M${start.x * CANVAS_WH},${start.y * CANVAS_WH} L${end.x * CANVAS_WH},${end.y * CANVAS_WH}`))
    })
  }
}

export function createAlphaPattern(ctx) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => {
      // create a pattern out of the alpha image
      res(ctx.createPattern(img, 'repeat'))
    }
    img.src = require('../assets/alpha-texture.png')
  })
}

export function getFitImageScale(image) {
  if(image.width === image.height || image.width > image.height) {
    // scale up to fit width within canvas
    return Number((CANVAS_WH / image.width).toFixed(2))
  } else {
    // scale up to fit height within canvas
    return Number((CANVAS_WH / image.height).toFixed(2))
  }
}

export function ParallelLines(image, imageProps, pathSettings, buildSettings) {
  this.path = []

  const { passDistance, threshold, searchDistance } = pathSettings
  const { _buildPixelRatio } = buildSettings

  const workerCanvas = document.createElement('canvas')
  workerCanvas.width = CANVAS_WH
  workerCanvas.height = CANVAS_WH

  const workerCtx = workerCanvas.getContext('2d')

  // draw on our worker canvas
  canvasRender(workerCtx, '#fff', image, { ...imageProps, showPreview: true })

  const imageData = workerCtx.getImageData(0, 0, CANVAS_WH, CANVAS_WH)
  const imagePixels = imageData.data

  // convert the pass distance from mm to pixels
  const passDistancePixels = Math.floor(_buildPixelRatio * passDistance)

  // the total number of passes
  const totalPasses = Math.floor(CANVAS_WH / passDistancePixels)

  // how far on either side of our pass to search for black pixels
  const searchPixels = Math.floor(searchDistance * passDistancePixels)

  // first convert the image to black and white (transparent) according to the threshold
  for(let x = 0; x < imageData.width; x++) {
    for(let y = 0; y < imageData.height; y++) {
      const i = (y * 4) * imageData.height + x * 4
      
      const avg = (imagePixels[i] + imagePixels[i + 1] + imagePixels[i + 2]) / 3
      
      if(avg > threshold) {
        imagePixels[i] = 255
        imagePixels[i + 1] = 255
        imagePixels[i + 2] = 255
        // make fully transparent
        imagePixels[i + 3] = 0
      } else {
        // make fully black
        imagePixels[i] = 0
        imagePixels[i + 1] = 0
        imagePixels[i + 2] = 0
        // make fully opaque
        imagePixels[i + 3] = 255
      }
    }
  }

  // determine paths
  let currentPath = null
  for(let x = 0; x < totalPasses; x++) {
    const xx = x * passDistancePixels

    for(let y = 0; y < imageData.height; y++) {
      const i = (y * 4) * imageData.height + xx * 4

      let found = false

      if(searchPixels !== 0) {
        // search all the way to the left and right for a black pixel
        for(let j = -searchPixels; j < searchPixels; j++) {
          const index = (y * 4) * imageData.height + (xx + j) * 4
          if(imagePixels[index] === 0) {
            found = true
            break
          }
        }
      } else {
        found = (imagePixels[i] === 0)
      }

      // if a black pixel was found within the area
      if(found) {
        // if there is no current path, we start one
        if(currentPath === null) {
          currentPath = {
            start: { 
              x: map(xx, 0, CANVAS_WH, 0, 1),
              y: map(y, 0, CANVAS_WH, 0, 1)
            }
          }
        }
        // otherwise, if there is a current path, do nothing until we don't find a black pixel
      } else {
        // if there is a current path but no black pixel was found, end the current path
        if(currentPath !== null) {
          currentPath.end = {
            x: map(xx, 0, CANVAS_WH, 0, 1),
            y: map(y, 0, CANVAS_WH, 0, 1)
          }

          // add the current path to the paths variable
          this.path.push(currentPath)

          currentPath = null
        }
      }
    }

    // if the current column/pass has ended without ending the path, we need to end it here
    if(currentPath) {

      currentPath.end = {
        x: map(xx, 0, CANVAS_WH, 0, 1),
        y: map(imageData.height - 1, 0, CANVAS_WH, 0, 1)
      }

      // add the current path to the paths variable
      this.path.push(currentPath)

      currentPath = null
    }
  }

  this.generateGCode = (gcodeSettings, buildSettings) => {
    const { gcodeStart, gcodeEnd } = gcodeSettings
    const { buildXY, zOffset, zHop, moveRate } = buildSettings

    return gcodeStart.concat(
      '\n',
      `G00 Z${zOffset + zHop} F${moveRate}\n`,
      'G00 X0 Y0\n',
      this.path.map(({ start, end }) => {
        return [
          `G0 X${(start.x * buildXY).toFixed(5)} Y${(start.y * buildXY).toFixed(5)} Z${zOffset + zHop}`,
          `G0 Z${zOffset}`,
          `G0 X${(end.x * buildXY).toFixed(5)} Y${(end.y * buildXY).toFixed(5)}`,
          `G0 Z${zOffset + zHop}`
        ].join('\n')
      }).join('\n'),
      '\n',
      gcodeEnd
    )
  }
}

export function map(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2
}
