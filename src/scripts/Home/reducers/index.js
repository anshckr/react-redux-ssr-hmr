const initialState = {
  isLoading: false
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_CONTENTS':
      return {
        ...state,
        isLoading: true
      }
    case 'RECEIVE_CONTENTS':
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}

export default ui
