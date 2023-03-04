import React, { memo } from "react";
import styled from "styled-components";

const SToggleButton = styled.div`
  margin-left: 8px;

  & input {
    display: none;
    &:checked + label {
      background-color: #ff9933;
      &::before {
        left: 2em;
      }
    }
  }

  & label {
    background-color: #003366;
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
};

export const ToggleButton: React.FC<Props> = memo((props) => {
  const { handleChange } = props;
  return (
    <>
      <SToggleButton>
        <input id="btn-mode" type="checkbox" onChange={handleChange} />
        <label htmlFor="btn-mode"></label>
      </SToggleButton>
    </>
  );
});
