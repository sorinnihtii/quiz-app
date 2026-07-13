interface Props {
  title: string;
  message: string;
}

const ErrorDisplay = ({ title, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-20 pt-10">
      <div className="flex flex-col items-center justify-center gap-2 bg-white h-[80vh] w-[80vw] rounded-2xl *:w-[50%] *:text-center">
        <h1 className="font-semibold text-4xl text-red-500">{title}</h1>
        <h2 className="text-black text-lg">{message}</h2>
      </div>
    </div>
  );
};

export default ErrorDisplay;
