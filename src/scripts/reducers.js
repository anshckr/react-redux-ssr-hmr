import { combineReducers } from 'redux'

import home from './Home/reducers'

const uiReducers = combineReducers({
  home
})

export default combineReducers({
  ui: uiReducers
})
