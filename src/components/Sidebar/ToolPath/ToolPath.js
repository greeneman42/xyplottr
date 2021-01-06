import React from 'react'
import { connect } from 'react-redux'

import { EditorCard } from '../../EditorCard'
import { 
  selectEditorCtx, 
  selectAlphaPattern, 
  selectSourceImage, 
  selectSourceProps, 
  selectBuildSettings
} from '../../../redux/selectors'
import { setToolPathGenerator } from '../../../redux/actions'

import { canvasRender, ParallelLines } from '../../../utils'

import './ToolPath.scss'

const ToolPath = ({ ctx, alphaPattern, image, imageProps, buildSettings, setToolPathGenerator }) => {
  const [settings, setSettings] = React.useState({
    passDistance: 2,
    threshold: 200,
    searchDistance: 1
  })

  const settingsChangeHandler = (key, value, min, max) => {

    let num = Number(value)
    if(min !== undefined) {
      num = Math.max(num, min)
    }

    if(max !== undefined) {
      num = Math.min(num, max)
    }

    const result = {
      ...settings,
      [key]: num
    }

    setSettings(result)

    // changing any of the settings will break the current path, so we throw it out
    setToolPathGenerator(null)
  }

  return (
    <EditorCard title="Tool path">
      <div className="field">
        <label className="label">Threshold (0-255)</label>
        <div className="control">
          <input 
            className="input" 
            type="number" 
            placeholder="Enter a value" 
            step="1"
            value={settings.threshold} 
            onChange={(event) => settingsChangeHandler('threshold', event.target.value, 0, 255)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Pass distance (mm)</label>
        <div className="control">
          <input 
            className="input" 
            type="number" 
            placeholder="Enter a value" 
            step="0.1"
            value={settings.passDistance} 
            onChange={(event) => settingsChangeHandler('passDistance', event.target.value, 0.1)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Search distance (0-1)</label>
        <div className="control">
          <input 
            className="input"
            type="number" 
            placeholder="Enter a value" 
            step="0.1"
            value={settings.searchDistance} 
            onChange={(event) => settingsChangeHandler('searchDistance', event.target.value, 0, 1)}
          />
        </div>
      </div>

      <button 
        className="button is-primary"
        onClick={() => {
          const generator = new ParallelLines(image, imageProps, settings, buildSettings)
          setToolPathGenerator(generator)
          canvasRender(ctx, alphaPattern, image, imageProps, generator)
        }}
      >
        Generate path
      </button>
    </EditorCard>
  )
}

const mapStateToProps = (state) => { 
  return {
    ctx: selectEditorCtx(state),
    alphaPattern: selectAlphaPattern(state),
    image: selectSourceImage(state),
    imageProps: selectSourceProps(state),
    buildSettings: selectBuildSettings(state)
  }
}

export default connect(mapStateToProps, { setToolPathGenerator })(ToolPath)