import React, { memo, useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import styled from "styled-components";
import { Button } from "../atoms/Button";

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 24px;
`;

type Status = "loading" | "success" | "error" | "invalid_token";

export const Liff: React.FC = memo(() => {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const redirectOriginRef = useRef<string>(window.location.origin);

  useEffect(() => {
    const run = async () => {
      try {
        const liffId = process.env.REACT_APP_LIFF_ID!;
        await liff.init({ liffId });

        // liff.init() が liff.state を処理してURLを復元するため、init() の後に読み取る
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const redirectOrigin = params.get("redirect") || window.location.origin;
        redirectOriginRef.current = redirectOrigin;

        if (!token) {
          setStatus("invalid_token");
          return;
        }

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        const lineUserId = profile.userId;

        const functionsUrl =
          "https://asia-northeast1-contacts-app-bb4dd.cloudfunctions.net/linkLineAccount";

        const response = await fetch(functionsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, lineUserId }),
        });

        if (response.ok) {
          setStatus("success");
        } else {
          const data = await response.json();
          setErrorMessage(data.error ?? "エラーが発生しました");
          setStatus("error");
        }
      } catch (err) {
        console.error("[LIFF] エラー:", err);
        setStatus("error");
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(`予期しないエラーが発生しました: ${msg}`);
      }
    };

    run();
  }, []);

  // 連携成功後に自動でSettingsへリダイレクト
  useEffect(() => {
    if (status !== "success") return;
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.location.href = `${redirectOriginRef.current}/settings`;
    }
  }, [status]);

  const handleGoHome = () => {
    window.location.href = `${window.location.origin}/home`;
  };

  if (status === "loading") {
    return (
      <SContainer>
        <p>連携中...</p>
      </SContainer>
    );
  }

  if (status === "success") {
    return (
      <SContainer>
        <p>✓ LINE通知の連携が完了しました！</p>
        <p>設定画面に移動します...</p>
      </SContainer>
    );
  }

  if (status === "invalid_token") {
    return (
      <SContainer>
        <p>リンクが無効になっています。</p>
        <p>アプリの設定画面から「LINEと連携する」を押し直してください。</p>
        <Button name="HOMEに戻る" onClick={handleGoHome} />
      </SContainer>
    );
  }

  return (
    <SContainer>
      <p>連携に失敗しました。</p>
      <p>{errorMessage}</p>
      <p>アプリの設定画面から「LINEと連携する」を押し直してください。</p>
      <Button name="HOMEに戻る" onClick={handleGoHome} />
    </SContainer>
  );
});
