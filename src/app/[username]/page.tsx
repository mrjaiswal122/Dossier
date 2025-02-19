
import { IPortfolio } from "@/models/portfolio";
import {
  PortfolioStatus,
 
} from "@/features/portfolio/portfolioSlice";
import { makeStore } from "@/store/store";
import ClientWrapper from "@/components/portfolio/ClientWrapper";

async function getPortfolioData(pathname: string) {
  try {
    const portfolioResponse = await fetch(
      `${process.env.HOME_URL}/api/fetch-portfolio?pathname=${pathname}`
    ).then((res) => res.json());
    
    return {
      isOwner: false,
      portfolio: portfolioResponse,
      status: "Ideal",
    };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return { isOwner: false, portfolio: null, status: "Failed" };
  }
}

export default async function Portfolio({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
 
  const pathname = (await params).username;

  // Fetch portfolio data on the server
  const { isOwner, portfolio, status } = await getPortfolioData(pathname);

  if (status === "Failed") {
    return <div>Loading.....</div>;
  }
  // const store = makeStore();
  // store.dispatch(
  //   updatePortfolio({
  //     ...(portfolio as IPortfolio),
  //     isOwner,
  //     status: PortfolioStatus.Ideal,
  //   })
  // );
  return (
    <div className="csw pt-32">

      <ClientWrapper initialData={{
          ...(portfolio as IPortfolio),
          isOwner,
          status: PortfolioStatus.Ideal,
        }} />
    </div>
  );
}
