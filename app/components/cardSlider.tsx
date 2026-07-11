import { Dispatch, SetStateAction, useState } from "react";
import { decode } from "he";

interface Props {
  content: DisplayContent[];
  isAnimating: Animating;
  setIsAnimating: Dispatch<SetStateAction<Animating>>;
  currentIndex: number;
  previousIndex: number;
  setPreviousIndex: Dispatch<SetStateAction<number>>;
}

const CardSlider = ({
  content,
  isAnimating,
  setIsAnimating,
  currentIndex,
  previousIndex,
  setPreviousIndex,
}: Props) => {
  function handleTransitionEnd() {
    {
      setIsAnimating((prev) => ({
        ...prev,
        state: false,
      }));
      setPreviousIndex(currentIndex);
      console.log("transition ended");
    }
  }

  console.log("index", currentIndex, isAnimating);

  return (
    <section
      className="
          flex items-center px-[10vw] gap-[20vw] overflow-x-hidden w-max overflow-hidden translate-x-[-100vw]
          *:flex *:flex-col *:items-center *:justify-center *:h-full *:w-[80vw] *:rounded-2xl *:bg-[#FFFFFF]
          [&>div>h1]:w-[50%] [&>div>*]:w-180 [&>div>*]:text-center [&>div>h1]:text-5xl [&>div>h1]:uppercase "
    >
      {content.length && (
        <>
          <div
            className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
          >
            <h1>{decode(content[currentIndex].name)}</h1>
          </div>

          <div
            className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
            onTransitionEnd={handleTransitionEnd}
          >
            <h1>{decode(content[previousIndex].name)}</h1>
          </div>

          <div
            className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
          >
            <h1>{decode(content[currentIndex].name)}</h1>
          </div>
        </>
      )}
    </section>
  );
};

export default CardSlider;
