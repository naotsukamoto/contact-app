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
import { SBox } from "../styles/Elements";

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
  box-sizing: border-box;
`;

const SInnerCard = styled(SBox)`
  text-align: center;
  margin: 0;
`;

const STitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #1c2b36;
  margin: 0 0 24px 0;
  letter-spacing: -0.01em;
`;

const SText = styled.p`
  font-size: 11px;
  color: #7186ad;
  line-height: 1.8;
  margin: 16px 0;
  font-weight: 500;
`;

const SLegalLinks = styled.p`
  font-size: 11px;
  color: #7186ad;
  margin-top: 24px;
  border-top: 1px solid #e7ecf1;
  padding-top: 16px;

  a {
    color: #003a73;
    text-decoration: none;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
      color: #ef5f26;
    }
  }
`;

const SLoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
`;

export const Login: React.FC = memo(() => {
  const navigate = useNavigate();

  // Loadingのstate定義
  const [isLoading, setIsLoading] = useState(true);

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
    return unsubscribe;
  }, [navigate]);

  // ログインボタンがクリックされたときの処理
  const onClickLogin = useCallback(
    (provider: AuthProvider) => {
      setIsLoading(true);
      signInWithPopup(auth, provider)
        .then(() => {
          toastFunc("success", "ログインしました");
          navigate("/home");
        })
        .catch((error) => {
          console.error(error);
          toastFunc("error", "ログインできませんでした");
          setIsLoading(false);
        });
    },
    [navigate]
  );

  return (
    <SContainer>
      <SInnerCard>
        {isLoading ? (
          <SLoadingWrapper>
            <ReactLoading type="spin" color="#ef5f26" height="36px" width="36px" />
          </SLoadingWrapper>
        ) : (
          <>
            <STitle>Sign In</STitle>
            <Button
              name="Twitterでログインする"
              img={`${process.env.PUBLIC_URL}/assets/Twitter_social_icons_rounded_square_blue.png`}
              variant="ghost"
              onClick={() => onClickLogin(twitterAuthProvider)}
            />
            <Button
              name="Googleでログインする"
              img={`${process.env.PUBLIC_URL}/assets/btn_google_light_pressed_ios@2x.png`}
              variant="ghost"
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
          </>
        )}
      </SInnerCard>
    </SContainer>
  );
});

