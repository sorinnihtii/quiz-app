"use client";

import CardSlider from "../components/cardSlider";
import useCardSliderStates from "../tools/useCardSliderStates";
import CardSliderArrowButton from "../components/cardSliderArrowButton";

const About = () => {
  const displayContent: DisplayContent[] = [
    {
      name: "Introduction",
      subtitle: `This app uses the <a class="font-semibold underline" href="https://opentdb.com/">Open Trivia Database</a> to display a wide variety of quizes. The interface allows you to easily customize the quizes received based on the amount of questions, difficulty and questions type. The questions to your quiz are fetched each time you start a new one based on your Session Token (as long as it is enabled). The next page explains how the tokens work.`,
    },
    {
      name: "Session Tokens",
      subtitle:
        "Session tokens are what allows the app to fetch different questions for each quiz you start. You are automatically assigned a session token which is then saved in the local storage of your browser. Session tokens are deleted after 6 hours of inactivity which may require you to create a new token. Additionally, once you fetched all the available quesitons on a specific token, the app won't be able to fetch any more quizes unless you reset it. You can manage your token in the settings menu. Avoid using a large amount of questions per quiz, as trying to fetch more questions than there are available results in an error.",
    },
  ];

  const slider = useCardSliderStates(displayContent.length - 1);

  return (
    <div className="grid grid-rows-[80%_20%] w-dvw h-full overflow-hidden">
      <CardSlider
        content={displayContent}
        isAnimating={slider.isAnimating}
        setIsAnimating={slider.setIsAnimating}
        currentIndex={slider.currentIndex}
        delayedIndex={slider.delayedIndex}
        setDelayedIndex={slider.setDelayedIndex}
      />
      <div
        className="
          flex items-center justify-center w-[80dvw] mx-[10dvw] gap-7
          [&_button]:duration-100 font-semibold text-color5"
      >
        <CardSliderArrowButton slider={slider} direction="left" />
        <CardSliderArrowButton slider={slider} direction="right" />
      </div>
    </div>
  );
};

export default About;
