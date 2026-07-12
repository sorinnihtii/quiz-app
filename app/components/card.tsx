"use client";

import { decode } from "he";

interface Props {
  title: string;
  subtitle?: string;
  animation: string;
  onTransitionEnd?: () => void;
}

const Card = ({
  title,
  subtitle,
  animation,
  onTransitionEnd,
}: Props) => {
  return (
    <div className={`card ${animation}`} onTransitionEnd={onTransitionEnd}>
      <h1>{title}</h1>
      <h2 className="text-2xl text-black">{subtitle}</h2>
    </div>
  );
};

export default Card;
