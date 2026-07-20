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

function getPerformance(total: number, score?: number) {
  if (score == null) return "";
  if (score === total) return "Perfect!";
  if (score / total >= 0.6) return "Well done!";
  if (score / total >= 0.4) return "Not bad!";
  return "Better luck next time!";
}

function getContent(index: number, content: DisplayContent[], score?: number) {
  if (score == null)
    return {
      title: content[index]?.name,
      subtitle: content[index]?.subtitle,
    };
  return index === content.length
    ? {
        title: getPerformance(content.length, score),
        subtitle: `Score: ${score}/${content.length}`,
      }
    : {
        title: content[index]?.name,
        subtitle: "",
      };
}

const titleStyles = "text-color5";

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

  const animation = isAnimating.state
    ? isAnimating.direction === "right"
      ? "transition-all duration-500 slide-right"
      : "transition-all duration-500 slide-left"
    : "transition-none";

  const currentContent = getContent(currentIndex, content, score);
  const delayedContent = getContent(delayedIndex, content, score);

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
              inert
              title={currentContent.title}
              subtitle={currentContent.subtitle}
              titleStyles={titleStyles}
              animation={animation}
            />
            <Card
              title={delayedContent.title}
              subtitle={delayedContent.subtitle}
              titleStyles={titleStyles}
              animation={animation}
              onTransitionEnd={handleTransitionEnd}
            />
            <Card
              inert
              title={currentContent.title}
              subtitle={currentContent.subtitle}
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
