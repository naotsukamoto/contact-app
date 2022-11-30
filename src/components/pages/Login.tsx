/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "@firebase/auth";
import styled from "styled-components";

import { Button } from "../atoms/Button";
import { auth, provider } from "../../firebase";

const SContainer = styled.div`
  text-align: center;
`;

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();

  // ログイン状態であれば、/homeにリダイレクトする
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });
  }, []);

  // ログインボタンがクリックされたときの処理
  const onClickLogin = useCallback(() => {
    console.log("onClickLoginがレンダリングされた");

    // firebaseを使ったログイン認証のロジック
    // ポップアップを出す
    signInWithPopup(auth, provider)
      .then((result) => {
        // firestoreに新規登録する

        // 画面遷移させる
        setTimeout(() => navigate("/home"), 1000);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]);

  return (
    <SContainer>
      <p>Sign In</p>
      <Button name="Twitterでログイン" onClick={onClickLogin} />
    </SContainer>
  );
});
