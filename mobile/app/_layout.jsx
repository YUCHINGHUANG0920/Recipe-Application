import { Slot } from "expo-router"; // Slock: the current page you are in == the entire app
import { ClerkProvider } from "@clerk/clerk-expo"; // for Auth
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    // use Clerk (ClerkProvider) to the entire APP (Slot)
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
