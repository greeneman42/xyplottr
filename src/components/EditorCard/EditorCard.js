import React from 'react'

import './EditorCard.scss'

const openStyle = {
  display: 'block'
}

const closedStyle = {
  display: 'none'
}

const EditorCard = ({ title, children, defaultOpen }) => {

  const [open, setOpen] = React.useState(defaultOpen || false)

  return (
    <div className={`editor-card${open ? ' is-open' : ''}`}>
      
      <button className="editor-card__button p-3" onClick={() => setOpen(!open)}>
        {title}
        <img 
          className="editor-card__icon"
          src={open ? require('../../assets/caret-down.svg') : require('../../assets/caret-right.svg')} 
          alt="" 
        />
      </button>
      
      <div className={`editor-card__content${open ? ' p-3' : ''}`} style={open ? openStyle : closedStyle}>
        {children}
      </div>

    </div>
  )
}

export default EditorCard