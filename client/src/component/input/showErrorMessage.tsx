import { type IShowErrorMessage } from "../../component/input/input.contract";

const ShowErrorMessage = ({ children }: Readonly<IShowErrorMessage>) => {
  if (!children) return null;
  return <p className="text-red-500 text-xs mt-1">{children}</p>;
};

export default ShowErrorMessage;
