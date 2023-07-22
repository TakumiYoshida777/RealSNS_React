
/**
 * ログイン状態の管理
 * @param {ログイン状態} state 
 * @param {dispatchで送られてきたtype} action 
 * @returns 
 */
const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_ERROR":
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        case "UPDATE_USER":
            return {
                ...state,
                user: {
                    ...state.user,
                    profilePicture: action.payload.profilePicture,
                    desc: action.payload.desc,
                },
            };


        default:
            return state;
    }
};

export default AuthReducer;