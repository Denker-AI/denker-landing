import { Fragment } from "react";

type BlurTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  stagger?: number;
};

export function BlurText({ text, className, as = "h2" }: BlurTextProps) {
  const Tag = as;
  const lines = text.split("\n");

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          {index < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </Tag>
  );
}
