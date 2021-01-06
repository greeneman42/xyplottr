import { CANVAS_WH, INITIAL_BUILD_XY, INITIAL_Z_OFFSET, INITIAL_Z_HOP, INITIAL_MOVE_RATE } from '../../constants'
import { BUILD_SETTINGS_SET } from '../actionTypes'

const initialState = {
  buildXY: INITIAL_BUILD_XY,
  zOffset: INITIAL_Z_OFFSET,
  zHop: INITIAL_Z_HOP,
  moveRate: INITIAL_MOVE_RATE,
  _buildPixelRatio: (CANVAS_WH / INITIAL_BUILD_XY)
}

export default function(state = initialState, action) {
  switch(action.type) {
    case BUILD_SETTINGS_SET: {

      const settings = action.settings
      
      // calculate ratio
      settings._buildPixelRatio = (CANVAS_WH / settings.buildXY)

      return settings
    }
    default:
      return state
  }
}