import { Timestamp } from "firebase/firestore";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Inventory } from "./Inventory";
import { StockOfContacts } from "../../types/StockOfContactsDocument";

const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
const makeStock = (
  left_eye: number,
  right_eye: number
): Array<StockOfContacts> => [
  {
    id: "1",
    exchangeDay: Timestamp.fromDate(dt),
    exchangeDayRight: Timestamp.fromDate(dt),
    exchangeDayLeft: Timestamp.fromDate(dt),
    left_eye,
    right_eye,
    updated_at: Timestamp.fromDate(dt),
    deadLine: Timestamp.fromDate(dt),
  },
];

describe("Inventory", () => {
  test("左の「-」ボタンをクリックすると onClickCount が呼ばれる", () => {
    const onClickMock = jest.fn();
    render(
      <Inventory stockOfContacts={makeStock(2, 4)} onClickCount={onClickMock} />
    );
    expect(screen.getByText(2)).toBeInTheDocument();
    expect(onClickMock).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getAllByText("-")[0]);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("右の「-」ボタンをクリックすると onClickCount が呼ばれる", () => {
    const onClickMock = jest.fn();
    render(
      <Inventory stockOfContacts={makeStock(2, 4)} onClickCount={onClickMock} />
    );
    fireEvent.click(screen.getAllByText("-")[1]);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("左の「+」ボタンをクリックすると onClickCount が呼ばれる", () => {
    const onClickMock = jest.fn();
    render(
      <Inventory stockOfContacts={makeStock(2, 4)} onClickCount={onClickMock} />
    );
    fireEvent.click(screen.getAllByText("+")[0]);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("右の「+」ボタンをクリックすると onClickCount が呼ばれる", () => {
    const onClickMock = jest.fn();
    render(
      <Inventory stockOfContacts={makeStock(2, 4)} onClickCount={onClickMock} />
    );
    fireEvent.click(screen.getAllByText("+")[1]);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("right_eye の在庫数が画面に表示される", () => {
    render(
      <Inventory
        stockOfContacts={makeStock(2, 4)}
        onClickCount={jest.fn()}
      />
    );
    expect(screen.getByText(4)).toBeInTheDocument();
  });

  test("left_eye が 0 のとき、左の「-」ボタンが disabled になる", () => {
    render(
      <Inventory
        stockOfContacts={makeStock(0, 4)}
        onClickCount={jest.fn()}
      />
    );
    const minusButtons = screen.getAllByText("-");
    expect(minusButtons[0]).toBeDisabled();
    expect(minusButtons[1]).not.toBeDisabled();
  });

  test("right_eye が 0 のとき、右の「-」ボタンが disabled になる", () => {
    render(
      <Inventory
        stockOfContacts={makeStock(2, 0)}
        onClickCount={jest.fn()}
      />
    );
    const minusButtons = screen.getAllByText("-");
    expect(minusButtons[0]).not.toBeDisabled();
    expect(minusButtons[1]).toBeDisabled();
  });
});
