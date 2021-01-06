import { TOOL_PATH_SET_GENERATOR } from '../actionTypes'

const initialState = {
  generator: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case TOOL_PATH_SET_GENERATOR: {
      return {
        ...state,
        generator: action.generator
      }
    }
    default:
      return state
  }
}