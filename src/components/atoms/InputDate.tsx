type Props = {
  dt: Date;
};

export const InputDate: React.FC<Props> = (props) => {
  const { dt } = props;
  return (
    <>
      <input type="date" min="2023-01-01" max="2023-03-31"></input>
    </>
  );
};
