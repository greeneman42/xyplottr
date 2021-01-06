import { 
  EDITOR_SET_CTX, 
  EDITOR_SET_ALPHA_PATTERN, 
  SOURCE_SET_IMAGE, 
  SOURCE_SET_PROPS, 
  BUILD_SETTINGS_SET, 
  TOOL_PATH_SET_GENERATOR 
} from './actionTypes'

export function setEditorCtx(ctx) {
  return {
    type: EDITOR_SET_CTX,
    ctx
  }
}

export function setAlphaPattern(alphaPattern) {
  return {
    type: EDITOR_SET_ALPHA_PATTERN,
    alphaPattern
  }
}

export function setSourceImage(image) {
  return {
    type: SOURCE_SET_IMAGE,
    image
  }
}

export function setSourceProps(imageProps) {
  return {
    type: SOURCE_SET_PROPS,
    imageProps
  }
}

export function setBuildSettings(settings) {
  return {
    type: BUILD_SETTINGS_SET,
    settings
  }
}

export function setToolPathGenerator(generator) {
  return {
    type: TOOL_PATH_SET_GENERATOR,
    generator
  }
}