const choiceLetterImages = [
  '/challenges/choices/letra-a.png',
  '/challenges/choices/letra-b.png',
  '/challenges/choices/letra-c.png',
] as const;

interface ChoiceLetterImageProps {
  index: number;
}

/** Renders the illustrated marker for the first three response options. */
export default function ChoiceLetterImage({ index }: ChoiceLetterImageProps) {
  const src = choiceLetterImages[index];

  if (!src) {
    return (
      <span className="choice-index__fallback" aria-hidden="true">
        {String.fromCharCode(65 + index)}
      </span>
    );
  }

  return (
    <img
      className="choice-index__image"
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  );
}
