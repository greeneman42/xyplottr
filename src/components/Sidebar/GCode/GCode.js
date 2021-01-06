import React from 'react'
import { connect } from 'react-redux'
import { saveAs } from 'file-saver'

import { EditorCard } from '../../EditorCard'
import { selectToolPathGenerator, selectBuildSettings } from '../../../redux/selectors'

import './GCode.scss'

const GCode = ({ generator, buildSettings }) => {
  const [settings, setSettings] = React.useState({
    gcodeStart: [
      'G21 ;metric values',
      'G90 ;absolute positioning',
      'M107 ;start with the fan off'
    ].join('\n'),
    gcodeEnd: [
      'M84 ;steppers off'
    ].join('\n')
  })
  const [error, setError] = React.useState(null)
  
  const gcodeChangeHandler = (key, value) => {

    const result = {
      ...settings,
      [key]: value
    }

    setSettings(result)
  }

  const generateGCodeHandler = () => {
    if(!generator) {
      setError('Please generate a path first.')
    } else {
      setError(null)
      saveAs(new Blob([generator.generateGCode(settings, buildSettings)], {type: "text/plain;charset=utf-8"}), 'output.gcode')
    }
  }

  return (
    <EditorCard title="GCode">
      <div className="field">
        <label className="label">Gcode start</label>
        <div className="control">
          <textarea 
            className="textarea"
            type="text" 
            placeholder="Enter a value" 
            style={{ fontFamily: 'monospace' }}
            value={settings.gcodeStart} 
            onChange={(event) => gcodeChangeHandler('gcodeStart', event.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Gcode end</label>
        <div className="control">
          <textarea 
            className="textarea"
            type="text" 
            placeholder="Enter a value" 
            style={{ fontFamily: 'monospace' }}
            value={settings.gcodeEnd} 
            onChange={(event) => gcodeChangeHandler('gcodeEnd', event.target.value)}
          />
        </div>
      </div>
      {error && (
        <div className="has-text-danger my-3">
          {error}
        </div>
      )}
      <button 
        className="button is-primary"
        onClick={generateGCodeHandler}
      >
        Save gcode
      </button>
    </EditorCard>
  )
}

const mapStateToProps = (state) => {
  return {
    generator: selectToolPathGenerator(state),
    buildSettings: selectBuildSettings(state)
  }
}

export default connect(mapStateToProps)(GCode)