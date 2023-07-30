import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from 'axios';
import { AuthContext } from '../../State/AuthContext';
import { loginCall } from '../../actionCallsDispatch';

const Register = () => {
    const email = useRef();
    const password = useRef();
    let username = useRef();
    const passwordConfirmaition = useRef();

    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    /**
     * DBにユーザー情報を新規登録
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        //パスワードと確認用のパスワードが合っているかどうかを確認
        if (password.current.value !== passwordConfirmaition.current.value) {
            //TODO:一度下記処理がはいると、２回目以降passを正しく入力しても下記処理が呼ばれてしまうため、リロードが必要な状況になっている
            passwordConfirmaition.current.setCustomValidity("パスワードが違います。");
            username = "";
            passwordConfirmaition = "";
        } else {
            try {
                const user = {
                    username: username.current.value,
                    email: email.current.value,
                    password: password.current.value
                };
                //registerApiを叩く（登録処理）
                await axios.post("/auth/register", user);
                loginCall({
                    email: email.current.value,
                    password: password.current.value,
                },
                    dispatch
                );
                navigate("/login");//ログイン画面にredirect
            } catch (err) {
                return console.log(err);
            }
        }
    };
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Real SNS</h3>
                    <span className="loginDec">本格的なSNSを、自分の手で。</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                        <p className="loginMsg">
                            新規登録はこちら
                        </p>
                        <input type="text"
                            className="loginInput"
                            placeholder="ユーザー名"
                            required
                            ref={username} />

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

                        <input type="password"
                            className="loginInput"
                            placeholder="確認用パスワード"
                            required
                            minLength="5"
                            ref={passwordConfirmaition} />

                        <button className="loginButton" type="submit">サインアップ</button>
                        <Link to="/login" className="loginBtn">
                            <button className="loginRegisterBtn">ログイン</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;