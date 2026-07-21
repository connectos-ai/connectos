import { ConnectChannels } from "../../components/connect/ConnectChannels";
import { getGmailSetupReadiness } from "../../lib/gmail-local";

export default function ConnectPage() {
return <ConnectChannels gmailSetupReady={getGmailSetupReadiness().ready} />;
}
