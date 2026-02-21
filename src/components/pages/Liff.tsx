import React, { memo, useEffect, useState } from "react";
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

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("invalid_token");
        return;
      }

      try {
        const liffId = process.env.REACT_APP_LIFF_ID!;
        await liff.init({ liffId });

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
        console.error(err);
        setStatus("error");
        setErrorMessage("予期しないエラーが発生しました");
      }
    };

    run();
  }, []);

  if (status === "loading") {
    return (
      <SContainer>
        <p>連携中...</p>
      </SContainer>
    );
  }

  if (status === "success") {
    const oaId = process.env.REACT_APP_LINE_OA_ID ?? "";
    const addFriendUrl = `https://line.me/R/ti/p/${oaId}`;
    return (
      <SContainer>
        <p>✓ LINE通知の連携が完了しました！</p>
        <p>続けて、下のボタンからConcon通知botを友達追加してください。</p>
        <Button
          name="Concon通知botを友達追加する"
          onClick={() =>
            liff.openWindow({ url: addFriendUrl, external: false })
          }
        />
        <p>友達追加後、挨拶メッセージが届きます。</p>
      </SContainer>
    );
  }

  if (status === "invalid_token") {
    return (
      <SContainer>
        <p>リンクが無効です。</p>
        <p>アプリの設定画面から「LINEと連携する」を押し直してください。</p>
      </SContainer>
    );
  }

  return (
    <SContainer>
      <p>連携に失敗しました。</p>
      <p>{errorMessage}</p>
      <p>アプリの設定画面から「LINEと連携する」を押し直してください。</p>
    </SContainer>
  );
});
