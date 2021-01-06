import React from 'react'
import { useDropzone } from 'react-dropzone'

import './Dropzone.scss'

const Dropzone = ({ onFileAccept, children }) => {

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onFileAccept,
    maxFiles: 1,
    accept: 'image/jpeg, image/png, .svg',
    noClick: true,
    noKeyboard: true
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="dropzone p-3">
        {children}
        <a onClick={open}>Browse</a>
      </div>
    </div>
  )
}

export default Dropzone