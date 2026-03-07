import { Timestamp } from "firebase/firestore";

import { calcInventoryDeadline } from "./calcInventoryDeadline";

describe("在庫期限日の算出のテスト", () => {
  test("右のコンタクトの残数が少なく、2以上の場合に、正しい日付を返す", () => {
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    const dtTobe: Date = new Date(2023, 1, 15, 0, 0, 0);

    expect(calcInventoryDeadline(2, 3, Timestamp.fromDate(dt))).toEqual(
      Timestamp.fromDate(dtTobe)
    );
  });

  test("左のコンタクトの残数が少なく、2以上の場合に、正しい日付を返す", () => {
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    const dtTobe: Date = new Date(2023, 1, 15, 0, 0, 0);

    expect(calcInventoryDeadline(4, 2, Timestamp.fromDate(dt))).toEqual(
      Timestamp.fromDate(dtTobe)
    );
  });

  // 残数が1になったときは、次のコンタクト交換日=在庫期限日になる
  test("左のコンタクトの残数が少なく、1の場合に、正しい日付を返す", () => {
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    const dtTobe: Date = new Date(2023, 1, 1, 0, 0, 0);

    expect(calcInventoryDeadline(1, 3, Timestamp.fromDate(dt))).toEqual(
      Timestamp.fromDate(dtTobe)
    );
  });

  test("両目の残数が同じ場合に、正しい日付を返す", () => {
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    const dtTobe: Date = new Date(2023, 1, 29, 0, 0, 0); // (3-1)*14 = 28日後

    expect(calcInventoryDeadline(3, 3, Timestamp.fromDate(dt))).toEqual(
      Timestamp.fromDate(dtTobe)
    );
  });

  test("在庫数が多い場合に、正しい日付を返す", () => {
    const dt: Date = new Date(2023, 1, 1, 0, 0, 0);
    const dtTobe: Date = new Date(2023, 2, 29, 0, 0, 0); // (5-1)*14 = 56日後（左が5で少ない方）

    expect(calcInventoryDeadline(10, 5, Timestamp.fromDate(dt))).toEqual(
      Timestamp.fromDate(dtTobe)
    );
  });
});
