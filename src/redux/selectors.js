export function selectEditorCtx(state) {
  return state.editor.ctx
}

export function selectAlphaPattern(state) {
  return state.editor.alphaPattern
}

export function selectSourceImage(state) {
  return state.source.image
}

export function selectSourceProps(state) {
  return state.source.imageProps
}

export function selectBuildSettings(state) {
  return state.buildSettings
}

export function selectToolPathGenerator(state) {
  return state.toolPath.generator
}