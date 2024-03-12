import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import LoginScreen from "./app/screens/LoginScreen";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <LoginScreen />
    </GluestackUIProvider>
  );
}

