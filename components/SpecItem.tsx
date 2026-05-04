import { SpecItemProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const SpecItem = ({ icon, label, value }: SpecItemProps) => {
  return (
    <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color={"#2563EB"} />
      <Text className="text-gray-900 font-bold text-sm">{value}</Text>
      <Text className="text-gray-400 text-xs ">{label}</Text>
    </View>
  );
};

export default SpecItem;
