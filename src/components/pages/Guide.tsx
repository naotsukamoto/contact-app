import React, { memo } from "react";
import { Sentense } from "../atoms/Sentense";

export const Guide: React.FC = memo(() => {
  return (
    <>
      <Sentense
        title="交換日を左右それぞれ設定するモード"
        sentense="設定より「コンタクト交換日を右左それぞれ設定できるようにする」をONにすることができます。OFFにすると交換日を左右まとめて1つにできます。利用中でも変更は可能です。"
      ></Sentense>
      <Sentense
        title="利用開始の準備"
        sentense="最初にコンタクトの残りの数をセットします。次に交換日をセットします。これで利用開始の準備は完了です。"
      ></Sentense>
      <Sentense
        title="交換日の計算方法について"
        sentense="2weekコンタクトを前提にしていて、コンタクトの数を1つ消化するごとに2週間後の日付が表示されるようになっています。"
      ></Sentense>
      <Sentense
        title="在庫期限の計算方法について"
        sentense="左右のうち残数が少ない方のコンタクトの数が0になる日付を表示しています。"
      ></Sentense>
      <p>今後の機能追加について</p>
      <Sentense
        title="(Comming Soon...)画面の背景色の変更"
        sentense="最初にコンタクトの残りの数をセットします。次に交換日をセットします。これで利用開始の準備は完了です。"
      ></Sentense>
    </>
  );
});
