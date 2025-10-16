import Link from "next/link";
type ButtonLinkProps = {
  url: string;
  text: string;
  danger?: boolean;
};
const ButtonLink: React.FC<ButtonLinkProps> = ({ url, text, danger }) => {
  return (
    <Link
      href={url}
      className={`w-fit h-8 py-1 px-6 rounded flex items-center text-white text-sm font-medium ${
        danger
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
    >
      {text}
    </Link>
  );
};

export default ButtonLink;
