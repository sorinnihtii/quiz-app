import { Dispatch, SetStateAction } from "react";
import Card from "./card";
import { decode } from "he";

interface Props {
  content: DisplayContent[];
  isAnimating: Animating;
  setIsAnimating: Dispatch<SetStateAction<Animating>>;
  currentIndex: number;
  delayedIndex: number;
  setDelayedIndex: Dispatch<SetStateAction<number>>;
  score?: number;
}

const CardSlider = ({
  content,
  isAnimating,
  setIsAnimating,
  currentIndex,
  delayedIndex,
  setDelayedIndex,
  score,
}: Props) => {
  function handleTransitionEnd() {
    setIsAnimating((prev) => ({
      ...prev,
      state: false,
    }));
    setDelayedIndex(currentIndex);
  }

  function getPerformance() {
    if (!score) return "";
    if (score === content.length) return "Perfect!";
    if (score / content.length >= 0.6) return "Well done!";
    if (score / content.length >= 0.4) return "Not bad!";
    return "Better luck next time!";
  }

  function getTitle(index: number) {
    if (index < content.length) return content[index]?.name;
    else return score ? getPerformance() : "";
  }

  function getSubtitle(index: number) {
    if (!score) return;
    return index === content.length ? `Score: ${score}/${content.length}` : "";
  }

  const animation = isAnimating.state
    ? isAnimating.direction === "right"
      ? "transition-all duration-400 slide-right"
      : "transition-all duration-400 slide-left"
    : "transiton-none";

  const titleStyles = "text-5xl text-color5 font-semibold";

  return (
    <section
      className="
        flex items-center h-full w-max px-[10vw] gap-[20vw] overflow-hidden translate-x-[-100vw]"
    >
      {content.length > 0 && (
        <>
          <Card
            title={decode(getTitle(currentIndex))}
            subtitle={getSubtitle(currentIndex)}
            titleStyles={titleStyles}
            animation={animation}
          />
          <Card
            title={decode(getTitle(delayedIndex))}
            subtitle={getSubtitle(delayedIndex)}
            titleStyles={titleStyles}
            animation={animation}
            onTransitionEnd={handleTransitionEnd}
          />
          <Card
            title={decode(getTitle(currentIndex))}
            subtitle={getSubtitle(currentIndex)}
            titleStyles={titleStyles}
            animation={animation}
          />
        </>
      )}
    </section>
  );
};

export default CardSlider;
