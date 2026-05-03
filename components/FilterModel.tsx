import { useFilterStore } from "@/store/filter";
import { FilterModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BEDS, chip, chipText, PRICE_PRESETS, TYPES } from "./Filters";

const FilterModel = ({ visible, onClose }: FilterModalProps) => {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(
    minPrice !== null ? String(minPrice) : "",
  );
  const [localMax, setLocalMax] = useState(
    maxPrice !== null ? String(maxPrice) : "",
  );

  useEffect(() => {
    if (!visible) return;
    setLocalMin(minPrice !== null ? String(minPrice) : "");
    setLocalMax(maxPrice !== null ? String(maxPrice) : "");
  }, [visible, minPrice, maxPrice]);

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const isMinValid =
    localMin.trim().length > 0 && !Number.isNaN(Number(localMin));
  const isMaxValid =
    localMax.trim().length > 0 && !Number.isNaN(Number(localMax));
  const activeCount = [
    type !== null,
    bedrooms !== null,
    isMinValid,
    isMaxValid,
  ].filter(Boolean).length;

  const handleApply = () => {
    const parsedMin = localMin.trim() ? Number(localMin) : null;
    const parsedMax = localMax.trim() ? Number(localMax) : null;

    setMinPrice(
      parsedMin === null || Number.isNaN(parsedMin) ? null : parsedMin,
    );
    setMaxPrice(
      parsedMax === null || Number.isNaN(parsedMax) ? null : parsedMax,
    );
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={"#374151"} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900"> Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-blue-600 font-semibold text-sm">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className={"flex-1"}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base font-bold text-gr-800 mb-3">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6 ">
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
                style={shadow}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Bedrooms Filter */}
          <Text className="text-base font-bold text-gr-800 mb-3">Bedrooms</Text>
          <View className="flex-row flex-wrap gap-2 mb-6 ">
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${chip(bedrooms === item.value)}`}
                style={shadow}
              >
                <Text
                  className={` text-sm font-bold  ${chipText(bedrooms === item.value)}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Price Range */}
          <Text className="text-base font-bold text-gr-800 mb-3">
            Price Range (₹)
          </Text>

          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray-500 mb-1.5 font-medium">
                  {label}
                </Text>
                <View className=" flex-row items-center bg-white rounded-2xl px-3 border border-gray-200">
                  <Text className="text-gray-400 text-sm mr-1">₹</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray-800"
                    placeholder={placeholder}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6 ">
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;

              return (
                <TouchableOpacity
                  key={p.label}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : "");
                    setLocalMax(p.max ? String(p.max) : "");
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={` px-3 py-1.5 rounded-full border ${active ? "bg-blue-50 border-blue-300 " : "bg-white border-gray-200"}`}
                  style={shadow}
                >
                  <Text
                    className={` text-xs  font-medium ${active ? "text-blue-600 " : "text-blue-500"}  `}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View className="px-5 pb-8 pt-4 bg-white border-gray-100">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-600 round-2xl py-4 items-center"
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filters {activeCount > 0 ? `(${activeCount}) ` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModel;
