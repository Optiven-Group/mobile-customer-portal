import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import HomeScreen from "./app/screens/HomeScreen";

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <HomeScreen />
    </GluestackUIProvider>
  );
}

