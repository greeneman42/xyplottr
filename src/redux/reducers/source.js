import { SOURCE_SET_IMAGE, SOURCE_SET_PROPS } from '../actionTypes'

const initialState = {
  image: null,
  imageProps: {
    xOffset: 0,
    yOffset: 0,
    scale: 1,
    showPreview: true
  }
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SOURCE_SET_IMAGE: {
      return {
        ...state,
        image: action.image
      }
    }
    case SOURCE_SET_PROPS: {
      return {
        ...state,
        imageProps: action.imageProps
      }
    }
    default:
      return state
  }
}