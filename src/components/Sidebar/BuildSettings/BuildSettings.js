import React from 'react'
import { connect } from 'react-redux'

import { selectBuildSettings } from '../../../redux/selectors'
import { setBuildSettings } from '../../../redux/actions'
import { EditorCard } from '../../EditorCard'

import './BuildSettings.scss'

const BuildSettings = ({ buildSettings, setBuildSettings }) => {

  const settingsChangeHandler = (key, value, min, max) => {

    let num = Number(value)
    if(min !== undefined) {
      num = Math.max(num, min)
    }

    if(max !== undefined) {
      num = Math.min(num, max)
    }

    const result = {
      ...buildSettings,
      [key]: num
    }

    setBuildSettings(result)
  }

  return (
    <EditorCard title="Build settings">
      <div className="field">
        <label className="label">Build xy (mm)</label>
        <div className="control">
          <input 
            className="input" 
            type="number" 
            placeholder="Enter a value" 
            step="1"
            value={buildSettings.buildXY} 
            onChange={(event) => settingsChangeHandler('buildXY', event.target.value, 0)}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Z offset (mm)</label>
            <div className="control">
              <input 
                className="input" 
                type="number" 
                placeholder="Enter a value" 
                step="0.1"
                value={buildSettings.zOffset} 
                onChange={(event) => settingsChangeHandler('zOffset', event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Z hop (mm)</label>
            <div className="control">
              <input 
                className="input" 
                type="number" 
                placeholder="Enter a value" 
                step="0.1"
                value={buildSettings.zHop} 
                onChange={(event) => settingsChangeHandler('zHop', event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Move rate</label>
        <div className="control">
          <input 
            className="input" 
            type="number" 
            placeholder="Enter a value" 
            step="50"
            value={buildSettings.moveRate} 
            onChange={(event) => settingsChangeHandler('moveRate', event.target.value, 1)}
          />
        </div>
      </div>
    </EditorCard>
  )
}

const mapStateToProps = (state) => {
  return {
    buildSettings: selectBuildSettings(state)
  }
}

export default connect(mapStateToProps, { setBuildSettings })(BuildSettings)