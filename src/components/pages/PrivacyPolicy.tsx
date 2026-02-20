import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Button } from "../atoms/Button";

const SContainer = styled.div`
  width: 50%;
  margin: 0 auto;
  padding: 24px 0 40px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SSection = styled.section`
  margin-top: 24px;
`;

const SH2 = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
`;

const SP = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
`;

const SList = styled.ul`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  padding-left: 20px;
`;

const SUpdated = styled.p`
  font-size: 12px;
  color: #888;
  margin-top: 8px;
`;

const SButtonWrap = styled.div`
  margin-top: 32px;
  text-align: center;
`;

export const PrivacyPolicy: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <SContainer>
      <h1>プライバシーポリシー</h1>
      <SUpdated>最終更新日：2026年2月20日</SUpdated>

      <SSection>
        <SH2>1. 基本方針</SH2>
        <SP>
          naotsukamoto（以下「当方」）は、コンタクトレンズ管理アプリ「ConCon」（以下「本サービス」）において、ユーザーの個人情報を適切に取り扱うことを重要な責務と考え、以下のプライバシーポリシーに従って取り扱います。
        </SP>
      </SSection>

      <SSection>
        <SH2>2. 収集する情報</SH2>
        <SP>本サービスでは、以下の情報を収集します。</SP>
        <SList>
          <li>
            <strong>アカウント情報：</strong>Google・Twitter（X）を通じたサインイン時に取得するユーザーID、メールアドレス、表示名
          </li>
          <li>
            <strong>コンタクトレンズ情報：</strong>ユーザーが入力したコンタクトレンズの在庫数・交換日などのデータ
          </li>
          <li>
            <strong>設定情報：</strong>アプリ内の設定（左右個別管理モードなど）
          </li>
        </SList>
      </SSection>

      <SSection>
        <SH2>3. 情報の利用目的</SH2>
        <SP>収集した情報は、以下の目的のみに使用します。</SP>
        <SList>
          <li>本サービスの提供・運営</li>
          <li>ユーザー認証およびデータの紐付け</li>
          <li>サービスの品質向上・不具合対応</li>
        </SList>
      </SSection>

      <SSection>
        <SH2>4. 第三者への提供</SH2>
        <SP>
          当方は、法令に基づく場合を除き、ユーザーの個人情報を事前の同意なく第三者に提供することはありません。
        </SP>
      </SSection>

      <SSection>
        <SH2>5. 利用するサービス・技術</SH2>
        <SP>本サービスは以下の外部サービスを利用しており、それぞれのプライバシーポリシーが適用されます。</SP>
        <SList>
          <li>
            <strong>Firebase（Google LLC）：</strong>認証・データベース・ホスティング
          </li>
          <li>
            <strong>Google Sign-In（Google LLC）：</strong>ソーシャルログイン
          </li>
          <li>
            <strong>Twitter（X）Sign-In（X Corp.）：</strong>ソーシャルログイン
          </li>
        </SList>
      </SSection>

      <SSection>
        <SH2>6. データの保管・管理</SH2>
        <SP>
          ユーザーデータはFirebase Firestoreに保存されます。当方は適切なセキュリティ対策を講じてデータを管理しますが、完全な安全性を保証するものではありません。
        </SP>
      </SSection>

      <SSection>
        <SH2>7. データの削除</SH2>
        <SP>
          アカウントおよびデータの削除を希望する場合は、下記のお問い合わせ先までご連絡ください。速やかに対応いたします。
        </SP>
      </SSection>

      <SSection>
        <SH2>8. プライバシーポリシーの変更</SH2>
        <SP>
          当方は、必要に応じて本ポリシーを変更することがあります。変更後のポリシーは、本サービス上に掲示した時点から効力を生じます。
        </SP>
      </SSection>

      <SSection>
        <SH2>9. お問い合わせ</SH2>
        <SP>
          本ポリシーに関するお問い合わせは、GitHubリポジトリのIssueよりご連絡ください。
        </SP>
      </SSection>

      <SButtonWrap>
        <Button name="戻る" onClick={() => navigate(-1)} />
      </SButtonWrap>
    </SContainer>
  );
});
