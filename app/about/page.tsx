"use client";

import { useState } from "react";
import CardSlider from "../components/cardSlider";

const About = () => {
  const displayContent: DisplayContent[] = [
    {
      name: "Introduction",
      subtitle: `This app uses the <a class="underline" href="https://opentdb.com/">OPEN TRIVIA DATABASE</a> to display a wide variety of quizes. The interface allows you to easily customize the quizes received based on the amount of questions, difficulty and questions type. The questions to your quiz are fetched each time you start a new one based on your Session Token (as long as it is enabled). The next page explains how the tokens work.`,
    },
    {
      name: "Session Tokens",
      subtitle:
        "Session tokens are what allows the app to fetch different questions for each quiz you start. You are automatically assigned a session token which is then saved in the local storage of your browser. Session tokens are deleted after 6 hours of inactivity which may require you to create a new token. Additionally, once you fetched all the available quesitons on a specific token, the app won't be able to fetch any more quizes unless you reset it. You can manage your token in the settings menu. Avoid using a large amount of questions per quiz, as trying to fetch more questions than there are available results in an error.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0); // for animation purposes
  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });

  function updateCurrentIndex(direction: string) {
    if (direction === "right")
      setCurrentIndex((prev) => {
        if (prev === displayContent.length - 1) return 0;
        else return prev + 1;
      });
    else
      setCurrentIndex((prev) => {
        if (prev === 0) return displayContent.length - 1;
        else return prev - 1;
      });
  }

  return (
    <div className="grid grid-rows-[80%_20%] w-dvw h-full overflow-hidden">
      <CardSlider
        content={displayContent}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        currentIndex={currentIndex}
        delayedIndex={delayedIndex}
        setDelayedIndex={setDelayedIndex}
      />
      <div
        className="
          flex items-center justify-center w-[80dvw] mx-[10dvw] gap-7
          [&_button]:duration-100 font-semibold text-color5"
      >
        <button
          className="group relative triangle h-9 aspect-square -rotate-90 bg-transparent hover:scale-125 focus:bg-white"
          onClick={() => {
            if (isAnimating.state) return;
            const direction = "left";
            setIsAnimating({
              state: true,
              direction: direction,
            });
            updateCurrentIndex(direction);
          }}
        >
          <span
            className="
                    triangle absolute h-7 aspect-square rotate-0
                    top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color5"
          >
            <span
              className="
                      triangle absolute h-5 aspect-square rotate-0
                      top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color2"
            ></span>
          </span>
        </button>
        <button
          className="group relative triangle h-9 aspect-square rotate-90 bg-transparent hover:scale-125 focus:bg-white"
          onClick={() => {
            if (isAnimating.state) return;
            const direction = "right";
            setIsAnimating({
              state: true,
              direction: direction,
            });
            updateCurrentIndex(direction);
          }}
        >
          <span
            className="
                    triangle absolute h-7 aspect-square rotate-0
                    top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color5"
          >
            <span
              className="
                      triangle absolute h-5 aspect-square rotate-0
                      top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color2"
            ></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default About;
