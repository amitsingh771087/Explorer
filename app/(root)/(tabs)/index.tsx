import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { Properties } from "@/types";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { signOut, userId } = useAuth();
  const { user } = useUser();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [saveLoadingIds, setSaveLoadingIds] = useState<string[]>([]);

  const [featured, setFeatured] = useState<Properties[]>([]);
  const [recommended, setRecommended] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(false);

  // console.log(featured, recommended);

  const fetchProperties = async () => {
    setLoading(true);

    try {
      const { data: featuredData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeatured(featuredData || []);
      setRecommended(recommendedData || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  const fetchSavedIds = useCallback(async () => {
    if (!userId) {
      const { signOut, userId } = useAuth();
      return;
    }
    const { data, error } = await authSupabase
      .from("saved_properties")
      .select("property_id")
      .eq("user_clerk_id", userId);
    if (!error && Array.isArray(data)) {
      setSavedIds(data.map((row) => row.property_id));
    }
  }, [authSupabase, userId]);

  const toggleSave = useCallback(
    async (propertyId: string) => {
      if (!userId || saveLoadingIds.includes(propertyId)) return;
      setSaveLoadingIds((prev) => [...prev, propertyId]);
      if (savedIds.includes(propertyId)) {
        const { error } = await authSupabase
          .from("saved_properties")
          .delete()
          .eq("user_clerk_id", userId)
          .eq("property_id", propertyId);
        if (!error) {
          setSavedIds((prev) => prev.filter((id) => id !== propertyId));
        }
      } else {
        const { error } = await authSupabase
          .from("saved_properties")
          .insert({ user_clerk_id: userId, property_id: propertyId });
        if (!error) {
          setSavedIds((prev) => [...prev, propertyId]);
        }
      }
      setSaveLoadingIds((prev) => prev.filter((id) => id !== propertyId));
    },
    [authSupabase, savedIds, saveLoadingIds, userId],
  );

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning ☀️";
    } else if (hour < 17) {
      return "Good Afternoon 🌤️";
    } else {
      return "Good Evening 🌆";
    }
  };

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
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* header */}
            <View className="flex-row items-center justify-between pb-5 px-5 pt-4">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />
              <View className="items-end">
                <Text> {getGreeting()} </Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>
            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search Properties , cities...
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Section */}
            <View className="mb-6 ">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4 ">
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>
            {/* Recommended Header  */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5 ">
            <PropertyCard
              property={item}
              isSaved={savedIds.includes(item.id)}
              saveLoading={saveLoadingIds.includes(item.id)}
              onToggleSave={() => toggleSave(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No Properties Found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
