import React, { memo } from "react";
import styled from "styled-components";

const SGnav = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid #e7ecf1;
`;

const SGnavIn = styled.div`
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 56px;
`;

const SGnavBrand = styled.div`
  display: flex;
  align-items: center;
  color: #1c2b36;
  font-weight: 900;
  font-size: 16px;
  letter-spacing: -0.02em;
`;

const SGnavMarkImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  margin-right: 9px;
  object-fit: cover;
`;

export const Title: React.FC = memo(() => {
  console.log("Titleがレンダリングされた");

  return (
    <SGnav>
      <SGnavIn>
        <SGnavBrand>
          <SGnavMarkImg 
            src={`${process.env.PUBLIC_URL}/assets/contacts-app-icon2.png`} 
            alt="logo" 
          />
          コンタクトレンズ交換日通知
        </SGnavBrand>
      </SGnavIn>
    </SGnav>
  );
});


