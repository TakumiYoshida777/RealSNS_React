import axios from "axios";

//Dispatchの処理を記述


/**
 * サーバーからログイン情報を取得する
 * 
 * @param {*} user 
 * @param {*} dispatch 
 */
export const loginCall = async (user, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const response = await axios.post("auth/login", user);
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data });

    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", payload: err });
    }
};
