import { Timestamp } from "firebase/firestore";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ExchangeDay } from "./ExchangeDay";
import { StockOfContacts } from "../../types/StockOfContactsDocument";

// Firebase Firestore のモック（updateDoc / doc は実 API を呼ばない）
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  doc: jest.fn(),
  updateDoc: jest.fn().mockResolvedValue(undefined),
}));

// firebase.ts のモック（db オブジェクトだけ必要）
jest.mock("../../firebase", () => ({ db: {} }));

const dt = new Date(2023, 1, 1, 0, 0, 0);
const deadline = new Date(2023, 1, 15, 0, 0, 0);

const makeStock = (
  left_eye: number,
  right_eye: number
): Array<StockOfContacts> => [
  {
    id: "doc1",
    exchangeDay: Timestamp.fromDate(dt),
    exchangeDayRight: Timestamp.fromDate(dt),
    exchangeDayLeft: Timestamp.fromDate(dt),
    left_eye,
    right_eye,
    updated_at: Timestamp.fromDate(dt),
    deadLine: Timestamp.fromDate(deadline),
  },
];

const defaultProps = {
  collectionId: "user1",
  subCollectionId: "doc1",
  setStockOfContacts: jest.fn(),
};

describe("ExchangeDay", () => {
  test("contactManageType が 0 のとき、date input が 1 つ表示される", () => {
    render(
      <ExchangeDay
        {...defaultProps}
        stockOfContacts={makeStock(2, 3)}
        contactManageType={0}
      />
    );
    const inputs = screen.getAllByDisplayValue(/^\d{4}-\d{2}-\d{2}$/);
    expect(inputs).toHaveLength(1);
  });

  test("contactManageType が 1 のとき、date input が 2 つ（左右別々）表示される", () => {
    render(
      <ExchangeDay
        {...defaultProps}
        stockOfContacts={makeStock(2, 3)}
        contactManageType={1}
      />
    );
    const inputs = screen.getAllByDisplayValue(/^\d{4}-\d{2}-\d{2}$/);
    expect(inputs).toHaveLength(2);
  });

  test("在庫あり（left_eye=2, right_eye=3）のとき、在庫期限が表示される", () => {
    render(
      <ExchangeDay
        {...defaultProps}
        stockOfContacts={makeStock(2, 3)}
        contactManageType={0}
      />
    );
    // "在庫期限:" テキストを含む要素が存在する
    expect(screen.getByText(/在庫期限/)).toBeInTheDocument();
    // "在庫なし" は表示されない
    expect(screen.queryByText("在庫なし")).not.toBeInTheDocument();
  });

  test("left_eye が 0 のとき「在庫なし」が表示される", () => {
    render(
      <ExchangeDay
        {...defaultProps}
        stockOfContacts={makeStock(0, 3)}
        contactManageType={0}
      />
    );
    expect(screen.getByText(/在庫なし/)).toBeInTheDocument();
  });

  test("right_eye が 0 のとき「在庫なし」が表示される", () => {
    render(
      <ExchangeDay
        {...defaultProps}
        stockOfContacts={makeStock(2, 0)}
        contactManageType={0}
      />
    );
    expect(screen.getByText(/在庫なし/)).toBeInTheDocument();
  });
});
