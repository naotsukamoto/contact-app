import React from "react";
import styled from "styled-components";
import { SettingWithToggle } from "../molecules/SettingWithToogle";

const SContainer = styled.div`
  text-align: center;
`;

export const Settings: React.FC = () => {
  // toggleのONのOFFによって実行される関数
  const handleChange = () => {};

  return (
    <SContainer>
      <p>Settings</p>
      <SettingWithToggle
        settingContent="コンタクトの交換日を右左それぞれ設定できるようにする"
        handleChange={handleChange}
      />
    </SContainer>
  );
};
