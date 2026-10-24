import React, { memo } from "react";
import styled from "styled-components";

import { ToggleButton } from "../atoms/ToggleButton";
import { SBox } from "../styles/Elements";

const SEachSetting = styled.div`
  display: flex;
  text-align: left;
  justify-content: center;
  align-items: center;
`;

type Props = {
  settingContent: string;
  handleChange: () => void;
  disabled?: boolean;
  checked: boolean;
};

export const SettingWithToggle: React.FC<Props> = memo((props) => {
  const { settingContent, handleChange, disabled, checked } = props;
  return (
    <SBox>
      <SEachSetting>
        <p>{settingContent}</p>
        <ToggleButton handleChange={handleChange} disabled={disabled} checked={checked} />
      </SEachSetting>
    </SBox>
  );
});
