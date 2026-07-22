interface Props {
  slider: Slider;
  direction: Direction;
}

const CardSliderArrowButton = ({ slider, direction }: Props) => {
  return (
    <button
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={`
        group triangle relative h-7.5 md:h-8.25 lg:h-9 aspect-square bg-transparent md:hover:scale-125 focus-visible:bg-color4
        ${direction === "right" ? "rotate-90" : "-rotate-90"}
        `}
      onClick={() => {
        if (slider.isAnimating.state) return;
        slider.setIsAnimating({
          state: true,
          direction: direction,
        });
        slider.updateCurrentIndex(direction);
      }}
    >
      <span
        className="
          triangle absolute h-6.25 md:h-7 lg:h-8 aspect-square rotate-0
          top-12/23 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color5"
      >
        <span
          className="
            triangle absolute h-4.5 md:h-5.25 lg:h-6.25 aspect-square rotate-0
            top-13/24 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color2"
        ></span>
      </span>
    </button>
  );
};

export default CardSliderArrowButton;
