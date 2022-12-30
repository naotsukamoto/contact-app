/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "@firebase/auth";
import styled from "styled-components";
import ReactLoading from "react-loading";

import { Button } from "../atoms/Button";
import { auth, provider } from "../../firebase";
import { toastFunc } from "../../utils/toastFunc";

const SContainer = styled.div`
  text-align: center;
`;

const SLoading = styled.div`
  po
`;

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();

  // Loadingのstate定義
  const [isLoading, setIsLoading] = useState(false);

  // ログイン状態であれば、/homeにリダイレクトする
  let access: boolean = false;
  useEffect(() => {
    if (!access) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/home");
          toastFunc("success", "ログインしましたlogin");
        }
      });
    }
    return () => {
      access = true;
    };
  }, []);

  // ログインボタンがクリックされたときの処理
  const onClickLogin = useCallback(() => {
    console.log("onClickLoginがレンダリングされた");
    // loading開始
    setIsLoading(true);

    // firebaseを使ったログイン認証のロジック
    // ポップアップを出す
    signInWithPopup(auth, provider)
      .then((result) => {
        // firestoreに新規登録する

        // 画面遷移させる
        setTimeout(() => navigate("/home"), 1000);
        // ローディング終了
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toastFunc("error", "ログインできませんでしたsignInWith");
      });
  }, [navigate]);

  return (
    <>
      {isLoading ? (
        <SLoading>
          <ReactLoading type="spin" color="#000" height="30px" width="30px" />
        </SLoading>
      ) : (
        <SContainer>
          <p>Sign In</p>
          <Button name="Twitterでログイン" onClick={onClickLogin} />
        </SContainer>
      )}
    </>
  );
});
