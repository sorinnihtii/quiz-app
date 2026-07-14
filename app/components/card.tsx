"use client";

interface Props {
  title: string;
  subtitle?: string;
  animation?: string;
  styles?: string;
  titleStyles?: string;
  subtitleStyles?: string;
  onTransitionEnd?: () => void;
}

const Card = ({
  title,
  subtitle,
  animation,
  styles,
  titleStyles,
  subtitleStyles,
  onTransitionEnd,
}: Props) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center h-full w-[80vw] gap-2 rounded-2xl text-center bg-color3 *:w-[50%] border-4 border-color5
        ${styles} ${animation}
        `}
      onTransitionEnd={onTransitionEnd}
    >
      <h1 className={`${titleStyles}`}>{title}</h1>
      <h2 className={`${subtitleStyles}`}>{subtitle}</h2>
    </div>
  );
};

export default Card;
