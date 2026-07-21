import { ConnectCoreCatalog } from "../../components/connect-core/ConnectCoreCatalog";
import { getConnectCoreDashboard } from "../../lib/connect-core-service";

export const dynamic = "force-dynamic";

export default async function ConnectCorePage() {
  const items = await getConnectCoreDashboard();
  return <ConnectCoreCatalog initialItems={items} />;
}
