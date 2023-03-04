import React, { useCallback } from "react";
import styled from "styled-components";
import { SettingWithToggle } from "../molecules/SettingWithToogle";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = () => {
  // toggleのONのOFFによって実行される関数
  const handleChange = useCallback(() => {}, []);

  return (
    <SContainer>
      <p>Settings</p>
      <SettingWithToggle
        settingContent="コンタクト交換日を右左それぞれ設定できるようにする"
        handleChange={handleChange}
      />
    </SContainer>
  );
};
