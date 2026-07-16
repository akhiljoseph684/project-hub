import BoardPage from "./board-page";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page() {

  return <BoardPage />;
}