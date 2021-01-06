import { EDITOR_SET_CTX, EDITOR_SET_ALPHA_PATTERN } from '../actionTypes'

const initialState = {
  ctx: null,
  alphaPattern: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case EDITOR_SET_CTX: {
      return {
        ...state,
        ctx: action.ctx
      }
    }
    case EDITOR_SET_ALPHA_PATTERN: {
      return {
        ...state,
        alphaPattern: action.alphaPattern
      }
    }
    default: 
      return state
  }
}