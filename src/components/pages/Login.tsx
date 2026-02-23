/* eslint-disable react-hooks/exhaustive-deps */

import React, { memo, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithPopup,
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

const SLegalLinks = styled.p`
  font-size: 11px;
  color: #70757a;
  margin-top: 16px;

  a {
    color: #70757a;
    text-decoration: underline;
  }
`;

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();

  // Loadingのstate定義
  const [isLoading, setIsLoading] = useState(false);

  // ログイン状態であれば、/homeにリダイレクトする
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ログインボタンがクリックされたときの処理
  const onClickLogin = useCallback(
    async (provider: AuthProvider) => {
      setIsLoading(true);
      try {
        await signInWithPopup(auth, provider);
        toastFunc("success", "ログインしました");
        navigate("/home");
      } catch (error) {
        console.error(error);
        toastFunc("error", "ログインできませんでした");
        setIsLoading(false);
      }
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
          <SLegalLinks>
            <Link to="/terms">利用規約</Link>
            {" ・ "}
            <Link to="/privacy">プライバシーポリシー</Link>
          </SLegalLinks>
        </SContainer>
      )}
    </>
  );
});
