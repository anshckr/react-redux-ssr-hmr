export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'SET_USER_NAME':
            return state;
        case 'SET_USER_AGE':
            return state;
        default:
            return state;
    }
}
