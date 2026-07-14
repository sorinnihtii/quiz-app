import { SearchParams } from "next/dist/server/request/search-params";
import QuizClient from "./quizClient";

type Props = Promise<{
  searchParams: {
    amount?: string;
    category?: string;
    difficulty?: string;
    type?: string;
    token?: string;
  };
}>

export default async function Page({ searchParams }: {searchParams: SearchParams}) {
  const params = await searchParams;
  return <QuizClient searchParams={params} />;
}
