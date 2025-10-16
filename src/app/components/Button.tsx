import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  text: string;
  danger?: boolean;
};
const Button: React.FC<ButtonProps> = ({ text, danger, ...props }) => {
  return (
    <button
      data-danger={danger}
      className={`h-8 text-sm font-medium py-1 px-6 rounded flex items-center ${
        danger ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      } text-white font-bold`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
