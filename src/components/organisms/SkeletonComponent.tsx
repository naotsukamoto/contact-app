import React, { memo } from "react";
import { Skeleton } from "@mui/material";

import {
  SBox,
  SFlexCenter,
  SFlexRight,
  SRow,
  SSplitBox,
} from "../styles/Elements";

type Props = {
  contactManageType: number;
};

export const SkeletonComponent: React.FC<Props> = memo((props) => {
  const { contactManageType } = props;
  return (
    <>
      <Skeleton width={200} height={28} sx={{ margin: "0 auto" }} />
      <SBox>
        <SFlexCenter>
          <Skeleton width={100} height={50} sx={{ margin: "0 auto" }} />
        </SFlexCenter>
        {contactManageType === 1 ? (
          <SSplitBox>
            <SRow>
              <Skeleton width={100} height={50} sx={{ margin: "0 auto" }} />
              <Skeleton width={100} height={50} sx={{ margin: "0 auto" }} />
            </SRow>
            <SRow>
              <Skeleton width={100} height={50} sx={{ margin: "0 auto" }} />
              <Skeleton width={100} height={50} sx={{ margin: "0 auto" }} />
            </SRow>
          </SSplitBox>
        ) : (
          <Skeleton width={150} height={50} sx={{ margin: "0 auto" }} />
        )}
        <SFlexRight>
          <Skeleton width={200} height={30} />
        </SFlexRight>
      </SBox>
      <br />
      <SBox>
        <Skeleton width={200} height={50} sx={{ margin: "0 auto" }} />
        <br />
        <SSplitBox>
          <SRow>
            <Skeleton width={50} height={38} sx={{ margin: "0 auto" }} />
            <Skeleton width={50} height={38} sx={{ margin: "0 auto" }} />
            <br />
            <br />
            <br />
          </SRow>
          <SRow>
            <Skeleton width={50} height={38} sx={{ margin: "0 auto" }} />
            <Skeleton width={50} height={38} sx={{ margin: "0 auto" }} />
            <br />
            <br />
            <br />
          </SRow>
        </SSplitBox>
      </SBox>
    </>
  );
});
