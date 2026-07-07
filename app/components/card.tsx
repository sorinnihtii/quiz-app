type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}
