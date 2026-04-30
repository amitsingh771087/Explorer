import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { signOut } = useAuth();

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text>HomeScreen</Text>
        <TouchableOpacity
          className="bg-black w-auto p-4 rounded-lg m-5"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
