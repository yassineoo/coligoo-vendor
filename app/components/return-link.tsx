import { Link } from "react-router";
import leftArrow from "assets/icons/left-arrow.svg";

type ReturnLinkProps = {
  text: string;
  url: string;
};

export default function ReturnLink({ text, url }: ReturnLinkProps) {
  return (
    <Link className=" flex items-center space-x-4" to={url}>
      <img src={leftArrow} alt="left arrow" />
      <span className=" font-semibold">{text}</span>
    </Link>
  );
}
