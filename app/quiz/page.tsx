import { SearchParams } from "next/dist/server/request/search-params";
import QuizClient from "./quizClient";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return <QuizClient searchParams={params} />;
}
