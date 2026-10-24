import React, { memo } from "react";
import styled from "styled-components";

const SToggleButton = styled.div`
  margin-left: 8px;

  & input {
    display: none;
    &:checked + label {
      background-color: lime;
      &::before {
        left: 2em;
      }
    }
  }

  & label {
    background-color: #dbdbdb;
    border-radius: 2em;
    border: 2px solid var(--text-color);
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 2em;
    position: relative;
    transition: 0.5s;
    width: 3.75em;

    &::before {
      background-color: #fff;
      border-radius: 100%;
      content: "";
      display: inline-block;
      height: 1.5em;
      position: absolute;
      left: 0.25em;
      transition: 0.2s ease-out;
      width: 1.5em;
      z-index: 2;
    }

    &::after {
      background-color: red;
      border-radius: 100%;
      content: "";
      display: inline-block;
      height: 1.5em;
      position: absolute;
      right: 0.25em;
      visibility: hidden;
      width: 1.5em;
      z-index: 2;
    }
  }
`;

type Props = {
  handleChange: () => void;
  disabled?: boolean;
  checked: boolean;
};

export const ToggleButton: React.FC<Props> = memo((props) => {
  const { handleChange, disabled, checked } = props;

  return (
    <>
      <SToggleButton>
        <input
          id="btn-mode"
          type="checkbox"
          aria-label="コンタクト交換日を左右それぞれ設定する"
          onChange={handleChange}
          checked={checked}
          disabled={disabled}
        />
        <label htmlFor="btn-mode"></label>
      </SToggleButton>
    </>
  );
});
