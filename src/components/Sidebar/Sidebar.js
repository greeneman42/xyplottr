import React from 'react'

import { SourceImage } from './SourceImage'
import { BuildSettings } from './BuildSettings'
import { ToolPath } from './ToolPath'
import { GCode } from './GCode'

import './Sidebar.scss'

const Sidebar = (props) => {
  return (
    <div className="sidebar">
			<SourceImage />
      <BuildSettings />
      <ToolPath />
      <GCode />
    </div>
  )
}

export default Sidebar