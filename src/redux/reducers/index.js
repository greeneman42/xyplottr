import { combineReducers } from 'redux'
import editor from './editor'
import source from './source'
import buildSettings from './buildSettings'
import toolPath from './toolPath'

export default combineReducers({ editor, source, buildSettings, toolPath })