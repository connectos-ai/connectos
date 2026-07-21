import { ConnectChannels } from "../components/connect/ConnectChannels";
import { getGmailSetupReadiness } from "../lib/gmail-local";

export default function Home() {
return <ConnectChannels gmailSetupReady={getGmailSetupReadiness().ready} />;
}
