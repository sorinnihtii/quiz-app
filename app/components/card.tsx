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
        flex flex-col items-center justify-center h-full w-[80dvw] gap-2
        rounded-2xl text-center bg-color3 *:w-[50%] border-4 border-color5
        ${styles} ${animation}
        `}
      onTransitionEnd={onTransitionEnd}
    >
      <h1
        className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold ${titleStyles}`}
      >
        {title}
      </h1>
      <h2 className={`text-xs sm:text-sm md:text-md lg:text-lg ${subtitleStyles}`}>{subtitle}</h2>
    </div>
  );
};

export default Card;
