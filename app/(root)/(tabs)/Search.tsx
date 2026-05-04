import FilterChip from "@/components/FilterChip";
import FilterModel from "@/components/FilterModel";
import PropertyCard from "@/components/PropertyCard";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useFilterStore } from "@/store/filter";
import { Properties } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const [result, setResult] = useState<Properties[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const latestFetchId = useRef(0);
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [saveLoadingIds, setSaveLoadingIds] = useState<string[]>([]);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilter(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const fetchSavedIds = useCallback(async () => {
    if (!userId) {
      setSavedIds([]);
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

  useEffect(() => {
    fetchSavedIds();
  }, [fetchSavedIds]);

  const filters = [
    type !== null && {
      label: type,
      onRemove: () => setType(null),
      icon: "home-outline",
    },

    bedrooms !== null && {
      label:
        bedrooms === 4
          ? "4+ beds"
          : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`,
      onRemove: () => setBedrooms(null),
      icon: "bed-outline",
    },

    (minPrice !== null || maxPrice !== null) && {
      label:
        minPrice && maxPrice
          ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
          : minPrice
            ? `From ₹${minPrice}`
            : `Up to ₹${maxPrice}`,
      onRemove: () => {
        setMinPrice(null);
        setMaxPrice(null);
      },
      icon: "cash-outline",
    },
  ].filter(Boolean) as {
    label: string;
    onRemove: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
  }[];

  useEffect(() => {
    fetchResult();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResult = async () => {
    const currentFetch = ++latestFetchId.current;
    setQueryError(null);
    setLoading(true);
    let query = supabase.from("properties").select("*");

    if (search) {
      const safeSearch = search
        .replace(/[\[\]\(\),%_"'\\]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (safeSearch) {
        query = query.or(
          `title.ilike.%${safeSearch}%,city.ilike.%${safeSearch}%`,
        );
      }
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms !== null) {
      query =
        bedrooms === 4
          ? query.gte("bedrooms", 4)
          : query.eq("bedrooms", bedrooms);
    }
    if (minPrice !== null) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== null) {
      query = query.lte("price", maxPrice);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (currentFetch !== latestFetchId.current) return;
    if (error) {
      console.error("Search query error:", error);
      setResult([]);
      setQueryError(error.message ?? "Unable to load properties.");
      setLoading(false);
      return;
    }

    setQueryError(null);

    setResult(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 mb-4 ">
          Find Property
        </Text>
        <View className="flex-row items-center gap-3">
          <View
            className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3 "
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 12,
            }}
          >
            <Ionicons name="search-outline" size={18} color={"#9CA3AF"} />

            <TextInput
              className="flex-1 py-3 text-gray-800"
              placeholder="Search by title or city.."
              placeholderTextColor={"#9CA3AF"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={"#9CA3AF"} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFilter(true)}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              activeFilterCount > 0 ? "bg-blue-600" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 12,
            }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : "#374151"}
            />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1  -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center ">
                <Text className="text-white text-[9px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Filter chips */}
        {activeFilterCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {filters.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mt-3">
                {filters.map((item, index) => (
                  <FilterChip
                    key={index}
                    label={item.label}
                    onRemove={item.onRemove}
                    icon={item.icon}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
      {/* Results */}

      <FlatList
        data={result}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4">
            {loading ? "Searching..." : `${result.length} Properties Found`}
          </Text>
        }
        ListFooterComponent={
          queryError ? (
            <View className="px-5 py-4">
              <Text className="text-sm text-red-500">{queryError}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            isSaved={savedIds.includes(item.id)}
            saveLoading={saveLoadingIds.includes(item.id)}
            onToggleSave={() => toggleSave(item.id)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No Properties Found</Text>
              <Text className="text-gray-300 text-sm mt-1 ">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#2563EB" className="py-20" />
          )
        }
      />

      {/* Filter Model */}
      <FilterModel visible={showFilter} onClose={() => setShowFilter(false)} />
    </SafeAreaView>
  );
};

export default Search;
