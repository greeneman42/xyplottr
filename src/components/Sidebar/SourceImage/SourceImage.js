import React from 'react'
import { connect } from 'react-redux'

import { Dropzone } from '../../Dropzone'
import { EditorCard } from '../../EditorCard'
import { setSourceImage, setSourceProps, setToolPathGenerator } from '../../../redux/actions'
import { selectEditorCtx, selectSourceImage, selectSourceProps, selectAlphaPattern, selectToolPathGenerator } from '../../../redux/selectors'

import { canvasRender, loadImage, getFitImageScale } from '../../../utils'

import './SourceImage.scss'

const SourceImage = ({ ctx, image, alphaPattern, imageProps, generator, setSourceImage, setSourceProps, setToolPathGenerator }) => {

  const uploadHandler = React.useCallback((files) => {
    if(files[0]) {
      loadImage(files[0])
      .then((result) => {
        setSourceImage(result)
        
        canvasRender(ctx, alphaPattern, result, imageProps)
      })      
    }
  }, [ctx, image, alphaPattern])

  const propChangeHandler = (key, value, min, max) => {

    let num = Number(value)
    if(min !== undefined) {
      num = Math.max(num, min)
    }

    if(max !== undefined) {
      num = Math.min(num, max)
    }

    const result = {
      ...imageProps,
      [key]: num
    }

    setSourceProps(result)
    if(image) {
      canvasRender(ctx, alphaPattern, image, result, generator)
    }
  }

  const scaleFitHandler = () => {
    if(image) {
      propChangeHandler('scale', getFitImageScale(image))
      setToolPathGenerator(null)
    }
  }
  
  return (
    <EditorCard title="Source image" defaultOpen>
      <Dropzone onFileAccept={uploadHandler}>
        {!image ? (
          <div>Drop image here</div>
        ) : (
          <>
            <img className="image my-3" src={image.src} alt="" />
            <div>Dimensions: {image.width} x {image.height}</div>
          </>
        )}
      </Dropzone>

      <br />
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">X offset</label>
            <div className="control">
              <input 
                className="input" 
                type="number" 
                placeholder="Enter a value" 
                step="10"
                value={imageProps.xOffset} 
                onChange={(event) => {
                  propChangeHandler('xOffset', event.target.value)
                  setToolPathGenerator(null)
                }}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Y offset</label>
            <div className="control">
              <input 
                className="input" 
                type="number" 
                placeholder="Enter a value" 
                step="10"
                value={imageProps.yOffset} 
                onChange={(event) => {
                  propChangeHandler('yOffset', event.target.value)
                  setToolPathGenerator(null)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Scale</label>
        <div className="control">
          <input 
            className="input" 
            type="number" 
            placeholder="Enter a value" 
            step="0.1"
            value={imageProps.scale} 
            onChange={(event) => {
              propChangeHandler('scale', event.target.value, 0)
              setToolPathGenerator(null)
            }}
          />
        </div>
      </div>

      <div className="field">
        <label className="checkbox">
          <input 
            type="checkbox" 
            checked={imageProps.showPreview} 
            onChange={(event) => propChangeHandler('showPreview', event.target.checked)} 
          /> Show preview
        </label>        
      </div>

      <a onClick={scaleFitHandler}>Scale to fit</a>

    </EditorCard>
  )
}

const mapStateToProps = (state) => { 
  return { 
    ctx: selectEditorCtx(state),
    alphaPattern: selectAlphaPattern(state),
    image: selectSourceImage(state),
    imageProps: selectSourceProps(state),
    generator: selectToolPathGenerator(state)
  }
}

export default connect(mapStateToProps, { setSourceImage, setSourceProps, setToolPathGenerator })(SourceImage)