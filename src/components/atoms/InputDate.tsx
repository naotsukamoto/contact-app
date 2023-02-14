import { format, isToday } from "date-fns";
import ja from "date-fns/locale/ja";

type Props = {
  dt: Date;
};

export const InputDate: React.FC<Props> = (props) => {
  const { dt } = props;
  const today = new Date();
  return (
    <>
      <input
        type="date"
        min={format(today, "yyyy-MM-dd", { locale: ja })}
        max="2023-03-31"
        value={format(dt, "yyyy-MM-dd", { locale: ja })}
      ></input>
    </>
  );
};
