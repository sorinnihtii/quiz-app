import { Dispatch, SetStateAction } from "react";
import Card from "./card";
import { decode } from "he";
import { motion } from "motion/react";

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
    if (!score) return content[index].subtitle;
    return index === content.length ? `Score: ${score}/${content.length}` : "";
  }

  const animation = isAnimating.state
    ? isAnimating.direction === "right"
      ? "transition-all duration-500 slide-right"
      : "transition-all duration-500 slide-left"
    : "transiton-none";

  const titleStyles = "text-color5";

  return (
    <motion.div
      initial={{ translateX: "100dvw" }}
      animate={{ translateX: "0" }}
      transition={{
        type: "tween",
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <section className="h-full w-dvw overflow-hidden px-[10dvw]">
        {content.length > 0 && (
          <div className="w-max flex h-full gap-[20dvw] translate-x-[-100dvw]">
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
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default CardSlider;
