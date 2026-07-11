import styled from "styled-components";

export const SBox = styled.div`
  max-width: 460px;
  width: 90%;
  margin: 24px auto;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e7ecf1;
  box-shadow: 0 8px 30px rgba(28, 43, 54, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left; /* 左寄せにして安定感を与える */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(28, 43, 54, 0.08);
  }

  h3 {
    font-size: 18px;
    font-weight: 800;
    margin: 0 0 16px 0;
    color: #1c2b36;
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin: 16px auto;
    width: 95%; /* スマホ時は少し広げる */
  }
`;

export const SSplitBox = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;

  @media (max-width: 768px) {
    gap: 8px; /* スマホ時はギャップを縮小 */
  }
`;

export const SRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f6f9fc;
  border-radius: 12px;
  border: 1px solid #e7ecf1;
  min-width: 0; /* はみ出し防止 */

  p:first-child {
    font-size: 13px;
    font-weight: 700;
    color: #7186ad;
    margin: 0 0 8px 0;
  }

  @media (max-width: 768px) {
    padding: 8px 4px; /* スマホ時はパディングを縮小 */
  }
`;

export const SFlexRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 14px;
  gap: 6px;
`;

export const SFlexCenter = styled.div`
  display: flex;
  justify-content: flex-start; /* 左端寄せでツールチップを並べる */
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
  }
`;

export const SInventoryDeadline = styled.p<{ $isAlert?: boolean }>`
  color: ${({ $isAlert }) => ($isAlert ? "#ef5f26" : "#7186ad")};
  font-weight: ${({ $isAlert }) => ($isAlert ? "800" : "600")};
  font-size: 12px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

