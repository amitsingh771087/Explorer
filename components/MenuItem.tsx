import { MenuItemProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const MenuItem = ({ icon, label, onPress }: MenuItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 text-gray-700 font-medium text-base">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

export default MenuItem;
