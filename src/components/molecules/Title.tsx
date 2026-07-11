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
  justify-content: center;
  padding: 0 20px;
  height: 60px;
`;

const SGnavBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SGnavLogoImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 9px;
  object-fit: cover;
`;

const SGnavTitleText = styled.h1`
  font-size: 18px;
  font-weight: 900;
  color: #1c2b36;
  margin: 0;
  letter-spacing: -0.01em;
  font-family: 'Inter', sans-serif;
`;

export const Title: React.FC = memo(() => {
  console.log("Titleがレンダリングされた");

  return (
    <SGnav>
      <SGnavIn>
        <SGnavBrand>
          <SGnavLogoImg 
            src={`${process.env.PUBLIC_URL}/assets/contacts-app-icon2.png`} 
            alt="ConCon Logo" 
          />
          <SGnavTitleText>ConCon Buddy</SGnavTitleText>
        </SGnavBrand>
      </SGnavIn>
    </SGnav>
  );
});


