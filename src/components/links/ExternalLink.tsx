import Link from "@suid/material/Link";
import { ParentComponent } from "solid-js";

type Props = {
  href: string;
};

export const ExternalLink: ParentComponent<Props> = (props) => {
  return (
    <Link href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
    </Link>
  );
};
