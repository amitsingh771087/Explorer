import { useUserSync } from "@/hooks/useUserSync";
import { useAuth } from "@clerk/expo";
import { Slot } from "expo-router";

export default function RootLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useUserSync();

  if (!isLoaded) {
    return null;
  }

  return <Slot />;
}
