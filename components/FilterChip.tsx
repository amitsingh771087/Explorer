import { FilterChipProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const FilterChip = ({ label, onRemove, icon }: FilterChipProps) => {
  return (
    <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
      {/* Left Icon */}
      {icon && <Ionicons name={icon} size={12} color="#1D4ED8" />}

      {/* Label */}
      <Text className="text-blue-700 text-xs font-semibold capitalize">
        {label}
      </Text>

      {/* Remove Button */}
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close" size={12} color="#1D4ED8" />
      </TouchableOpacity>
    </View>
  );
};

export default FilterChip;
