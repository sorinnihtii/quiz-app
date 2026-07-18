"use client";

import { useState } from "react";

export default function () {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });

  return {
    currentIndex,
    setCurrentIndex,
    delayedIndex,
    setDelayedIndex,
    isAnimating,
    setIsAnimating,
  };
}
