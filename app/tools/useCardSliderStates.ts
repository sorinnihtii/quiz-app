"use client";

import { useState } from "react";

export default function useCardSliderStates(lastIndex: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });

  function updateCurrentIndex(direction: Direction) {
    if (direction === "right")
      setCurrentIndex((prev) => {
        if (prev === lastIndex) return 0;
        else return prev + 1;
      });
    else
      setCurrentIndex((prev) => {
        if (prev === 0) return lastIndex;
        else return prev - 1;
      });
  }

  return {
    currentIndex,
    setCurrentIndex,
    delayedIndex,
    setDelayedIndex,
    isAnimating,
    setIsAnimating,
    updateCurrentIndex,
  };
}
