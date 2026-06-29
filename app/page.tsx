import { PortfolioPage } from "../components/portfolio-page";
import { getDashboardContent } from "../lib/content-store";

export default async function Page() {
  const content = await getDashboardContent();
  return <PortfolioPage {...content} />;
}
