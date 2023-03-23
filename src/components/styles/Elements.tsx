import styled from "styled-components";

export const SBox = styled.div`
  width: 30%;
  margin: 0 auto;
  margin-top: 16px;
  padding: 16px 16px 8px 16px;
  border-radius: 8px;
  background: #fff;

  @media (max-width: 768px) {
    width: 85%;
    padding: 4px 4px 0px 4px;
  }
`;

export const SSplitBox = styled.div`
  display: flex;
  justify-content: center;
`;

export const SRow = styled.div`
  margin: 8px;
  width: 100%;

  @media (max-width: 768px) {
    margin: 4px;
  }
`;

export const SFlexRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;

export const SFlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SInventoryDeadline = styled.p`
  color: gray;
  font-size: 14px;
  margin-right: 4px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
