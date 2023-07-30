import { createContext, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';

//最初のユーザー状態を定義
const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};

//状態をグローバルに管理する
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    useEffect(() => {
        //Userが変わるたびにローカルストレージにログイン状態をセット
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    const updateUser = (profilePicture, desc) => {
        dispatch({
            type: "UPDATE_USER",
            payload: { profilePicture, desc },
        });
    };
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}

