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

const SH3 = styled.h3`
  font-size: 15px;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const SP = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
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

export const TermsOfService: React.FC = memo(() => {
  const navigate = useNavigate();

  return (
    <SContainer>
      <h1>利用規約</h1>
      <SUpdated>最終更新日：2026年2月20日</SUpdated>

      <SSection>
        <SH2>第1条（適用）</SH2>
        <SP>
          本利用規約（以下「本規約」）は、naotsukamoto（以下「当方」）が提供するコンタクトレンズ管理アプリ「ConCon」（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは、本サービスを利用することで本規約に同意したものとみなします。
        </SP>
      </SSection>

      <SSection>
        <SH2>第2条（利用登録）</SH2>
        <SP>
          本サービスは、GoogleまたはTwitter（X）アカウントを使用したソーシャルログインにより利用できます。利用登録は、各プロバイダーの認証画面での承認をもって完了とします。
        </SP>
      </SSection>

      <SSection>
        <SH2>第3条（禁止事項）</SH2>
        <SP>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</SP>
        <SH3>（1）法令または公序良俗に違反する行為</SH3>
        <SH3>（2）当方または第三者の権利を侵害する行為</SH3>
        <SH3>（3）本サービスの運営を妨害する行為</SH3>
        <SH3>（4）不正アクセスその他の不正な行為</SH3>
        <SH3>（5）その他、当方が不適切と判断する行為</SH3>
      </SSection>

      <SSection>
        <SH2>第4条（サービスの提供・停止）</SH2>
        <SP>
          当方は、以下の場合に事前の通知なく本サービスの提供を停止・中断することがあります。当方はこれによってユーザーに生じた損害について責任を負いません。
        </SP>
        <SH3>（1）システムの保守・点検を行う場合</SH3>
        <SH3>（2）天災・障害など不可抗力により提供が困難になった場合</SH3>
        <SH3>（3）その他、当方が停止・中断を必要と判断した場合</SH3>
      </SSection>

      <SSection>
        <SH2>第5条（免責事項）</SH2>
        <SP>
          当方は、本サービスの内容の正確性・完全性・有用性を保証するものではありません。また、本サービスの利用またはサービスが利用不可能であることにより生じた損害について、当方は一切の責任を負わないものとします。
        </SP>
        <SP>
          本サービスは交換日の目安を管理するためのツールです。コンタクトレンズの使用に関しては、必ず眼科医の指示に従ってください。
        </SP>
      </SSection>

      <SSection>
        <SH2>第6条（利用規約の変更）</SH2>
        <SP>
          当方は、必要と判断した場合に本規約を変更することがあります。変更後の規約は、本サービス上に掲示された時点から効力を生じるものとします。
        </SP>
      </SSection>

      <SSection>
        <SH2>第7条（準拠法・裁判管轄）</SH2>
        <SP>
          本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して生じた紛争については、当方の所在地を管轄する裁判所を専属的合意管轄とします。
        </SP>
      </SSection>

      <SButtonWrap>
        <Button name="戻る" onClick={() => navigate(-1)} />
      </SButtonWrap>
    </SContainer>
  );
});
