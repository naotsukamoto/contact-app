import { Timestamp } from "firebase/firestore";

export const calcInventoryDeadline = (
  right_eye: number,
  left_eye: number,
  exchangeDay: Timestamp
): Timestamp => {
  console.log("calcされた");

  // 交換日 + 在庫数 x 14日(2week)
  const dt: Date = exchangeDay.toDate();
  left_eye < right_eye
    ? dt.setDate(dt.getDate() + (left_eye - 1) * 14)
    : dt.setDate(dt.getDate() + (right_eye - 1) * 14);

  const calcDeadLine: Timestamp = Timestamp.fromDate(dt);

  // Timestamp型に変換してあげる
  return calcDeadLine;
};
