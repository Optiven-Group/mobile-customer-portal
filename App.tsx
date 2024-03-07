import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import AccountScreen from "./app/screens/AccountScreen";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <AccountScreen />
    </GluestackUIProvider>
  );
}
