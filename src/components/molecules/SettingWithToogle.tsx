import React, { memo } from "react";
import styled from "styled-components";

import { ToggleButton } from "../atoms/ToggleButton";
import { SBox } from "./ExchangeDay";

const SEachSetting = styled.div`
  display: flex;
  text-align: left;
  justify-content: center;
  align-items: center;
`;

type Props = {
  settingContent: string;
  handleChange: () => void;
};

export const SettingWithToggle: React.FC<Props> = memo((props) => {
  const { settingContent, handleChange } = props;
  return (
    <SBox>
      <SEachSetting>
        <p>{settingContent}</p>
        <ToggleButton handleChange={handleChange} />
      </SEachSetting>
    </SBox>
  );
});
