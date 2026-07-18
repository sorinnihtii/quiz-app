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
        rounded-2xl text-center bg-color3 *:w-[75%] *:sm:w-[70%] *:md:w-[65%] *:lg:w-[60%] *:xl:w-[55%] *:2xl:w-[50%] border-4 border-color5
        ${styles} ${animation}
        `}
      onTransitionEnd={onTransitionEnd}
    >
      <h1
        className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold ${titleStyles}`}
      >
        {title}
      </h1>
      <h2
        className={`text-xs sm:text-sm lg:text-base xl:text-lg ${subtitleStyles}`}
        dangerouslySetInnerHTML={subtitle ? { __html: subtitle } : undefined}
      />
    </div>
  );
};

export default Card;
