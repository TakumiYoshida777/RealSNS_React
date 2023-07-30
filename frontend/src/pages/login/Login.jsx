import React, { useContext, useRef } from 'react';
import "./Login.css";
import { loginCall } from '../../actionCallsDispatch';
import { AuthContext } from '../../State/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
    const email = useRef();
    const password = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    /**
     * ログイン画面の入力情報を取得
     * @param {*} e 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        loginCall({
            email: email.current.value,
            password: password.current.value,
        },
            dispatch
        );
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Real SNS</h3>
                    <span className="loginDec"></span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        <p className="loginMsg">
                            ログインはこちら
                        </p>
                        <input type="email"
                            className="loginInput"
                            placeholder="Eメール"
                            required
                            ref={email} />
                        <input type="password"
                            className="loginInput"
                            placeholder="パスワード"
                            required
                            minLength="5"
                            ref={password} />
                        <button className="loginButton">ログイン</button>
                        <span className="loginForgot">パスワードを忘れた方へ</span>
                        <Link to="/register">
                            <button className="loginRegisterBtn">アカウント作成</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;