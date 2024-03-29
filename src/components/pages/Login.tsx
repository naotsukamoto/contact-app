/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  // signInWithRedirect,
  // getRedirectResult,
  onAuthStateChanged,
  AuthProvider,
} from "@firebase/auth";
import styled from "styled-components";
import ReactLoading from "react-loading";

import { Button } from "../atoms/Button";
import { auth, googleAuthProvider, twitterAuthProvider } from "../../firebase";
import { toastFunc } from "../../utils/toastFunc";

const SContainer = styled.div`
  text-align: center;
`;

const SText = styled.p`
  font-size: 12px;
  color: #70757a;
`;

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();

  // Loadingのstate定義
  const [isLoading, setIsLoading] = useState(false);

  // ログイン状態であれば、/homeにリダイレクトする
  let access: boolean = false;
  useEffect(() => {
    if (!access) {
      console.log("Loginがレンダリングされた");
      // loading開始
      setIsLoading(true);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setTimeout(() => navigate("/home"), 500);
          toastFunc("success", "ログインしました");
        }
        setIsLoading(false);
      });
      unsubscribe();
    }

    return () => {
      access = true;
    };
  }, []);

  // ログインボタンがクリックされたときの処理
  const onClickLogin = useCallback(
    async (provider: AuthProvider) => {
      console.log("onClickLoginがレンダリングされた");
      // loading開始
      setIsLoading(true);

      // firebaseを使ったログイン認証のロジック
      // ポップアップを出す
      await signInWithPopup(auth, provider)
        // await signInWithRedirect(auth, provider);
        // getRedirectResult(auth, provider)
        .then((result) => {
          console.log(result);
          // 画面遷移させる
          setTimeout(() => navigate("/home"), 500);
          toastFunc("success", "ログインしました");
        })
        .catch((error) => {
          if (error.code === "auth/popup-closed-by-user") {
            toastFunc(
              "error",
              "ポップアップが閉じられたため、ログインできませんでした"
            );
          } else {
            toastFunc("error", "ログインできませんでした");
          }
        })
        .finally(() => {
          // ローディング終了
          setIsLoading(false);
        });
    },
    [navigate]
  );

  return (
    <>
      {isLoading ? (
        <ReactLoading type="spin" color="#000" height="30px" width="30px" />
      ) : (
        <SContainer>
          <p>Sign In</p>
          <Button
            name="TwitterでSign Inする"
            img={`${process.env.PUBLIC_URL}/assets/Twitter_social_icons_rounded_square_blue.png`}
            onClick={() => onClickLogin(twitterAuthProvider)}
          />
          <Button
            name="GoogleでSign Inする"
            img={`${process.env.PUBLIC_URL}/assets/btn_google_light_pressed_ios@2x.png`}
            onClick={() => onClickLogin(googleAuthProvider)}
          />
          <SText>※SNSサインインは順次追加予定です</SText>
          <SText>
            ※サインインに失敗した場合は、
            <br />
            アプリをリフレッシュしてからアクセスください
          </SText>
        </SContainer>
      )}
    </>
  );
});
