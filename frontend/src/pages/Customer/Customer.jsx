import React from 'react';
import Topbar from '../../components/Topbar/Topbar';
import Hamburger from '../../components/Hamburger/Hamburger';
import './Customer.css';

const Customer = () => {
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Hamburger />

                <div className="customer">
                    <h2 className="customerTitle">機能一覧</h2>
                    <ul className="customerList">
                        <li className="CstomerItem">新規アカウント作成</li>
                        <li className="CstomerItem">ログイン・ログアウト</li>
                    </ul>
                    <hr />
                    <h3 className="customerListTitle">トップバー</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">メニュー表示（スマホ閲覧時のみ）</li>
                        <li className="CstomerItem">ユーザー名検索</li>
                        <li className="CstomerItem">メッセージ閲覧</li>
                        <li className="CstomerItem">アイコンクリックでプロフィール画面へ遷移</li>
                    </ul>
                    <hr />

                    <h3 className="customerListTitle">ホーム画面</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">リアルタイム通信</li>
                        <li className="CstomerItem">テキスト投稿</li>
                        <li className="CstomerItem">画像投稿</li>
                        <li className="CstomerItem">自分の投稿内容の閲覧</li>
                        <li className="CstomerItem">フォローした人の投稿内容の閲覧</li>
                        <li className="CstomerItem">いいね</li>
                        <li className="CstomerItem">投稿にコメント</li>
                        <li className="CstomerItem">投稿をブックマーク</li>
                        <li className="CstomerItem">自分の投稿を編集</li>
                        <li className="CstomerItem">自分の投稿を削除</li>
                        <li className="CstomerItem">ページネーション（「インクリメント」というユーザーをフォローすると確認できます。）</li>
                    </ul>
                    <hr />

                    <h3 className="customerListTitle">メニューバー</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">各メニューへ遷移</li>
                        <li className="CstomerItem">おすすめのユーザーの表示（ランダム）</li>
                    </ul>
                    <hr />

                    <h3 className="customerListTitle">プロフィール</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">カバー画像の編集</li>
                        <li className="CstomerItem">プロフィール画像の編集</li>
                        <li className="CstomerItem">プロフィール内容の編集</li>
                        <li className="CstomerItem">自分の投稿のみの閲覧</li>
                        <li className="CstomerItem">フォロー</li>
                        <li className="CstomerItem">フォロー解除</li>
                        <li className="CstomerItem">メッセージ</li>
                    </ul>
                    <hr />

                    <h3 className="customerListTitle">メッセージ</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">リアルタイム通信</li>
                        <li className="CstomerItem">受信一覧</li>
                        <li className="CstomerItem">メッセージ一覧</li>
                        <li className="CstomerItem">メッセージ送信</li>
                        <li className="CstomerItem">未読数表示</li>
                        <li className="CstomerItem">既読</li>
                    </ul>
                    <hr />

                    <h3 className="customerListTitle">ブックマーク</h3>
                    <ul className="customerList">
                        <li className="CstomerItem">投稿をブックマーク</li>
                        <li className="CstomerItem">ブックマークを解除</li>
                        <li className="CstomerItem">ブックマークした投稿を全て閲覧</li>
                    </ul>
                </div>
            </div>
        </>

    );
};

export default Customer;