interface Props {
  slider: Slider;
  direction: Direction;
}

const CardSliderArrowButton = ({ slider, direction }: Props) => {
  return (
    <button
      aria-label={`arrow-${direction}`}
      className={`
        group relative triangle h-9 aspect-square bg-transparent md:hover:scale-125 focus:bg-color4
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
  );
};

export default CardSliderArrowButton;
