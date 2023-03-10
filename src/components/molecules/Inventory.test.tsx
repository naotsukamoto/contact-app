import { Timestamp } from "firebase/firestore";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Inventory } from "./Inventory";
import { StockOfContacts } from "../../types/StockOfContactsDocument";

describe("Inventory", () => {
  test("Click left minus button", async () => {
    // Propsの宣言
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    // stockOfContactのモックデータ作成
    const stockOfContact: Array<StockOfContacts> = [
      {
        id: "1",
        exchangeDay: Timestamp.fromDate(dt),
        exchangeDayRight: Timestamp.fromDate(dt),
        exchangeDayLeft: Timestamp.fromDate(dt),
        left_eye: 2,
        right_eye: 4,
        updated_at: Timestamp.fromDate(dt),
        deadLine: Timestamp.fromDate(dt),
      },
    ];
    // Jestのユーティリティを使って、コンポーネントに渡されるonChange関数をモックします。
    const onClickMock = jest.fn();

    render(
      <Inventory stockOfContacts={stockOfContact} onClickCount={onClickMock} />
    );
    // 左のコンタクトレンズの数が表示されている要素が現状正しい数であることをexpectする
    expect(screen.getByText(2)).toBeInTheDocument();
    // 関数が正しく呼ばれたか確認する
    expect(onClickMock).toHaveBeenCalledTimes(0);
    // 左の「-」ボタンの要素を取得してクリックする
    fireEvent.click(screen.getAllByText("-")[0]);
    // 関数が正しく呼ばれたか確認する
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
