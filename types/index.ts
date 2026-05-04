import { Ionicons } from "@expo/vector-icons";
export interface Properties {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  images: [string, ...string[]];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}

export interface PropertieCard {
  property: Properties;
  onUnsaved?: () => void;
  showSaved?: boolean;
  isSaved?: boolean;
  saveLoading?: boolean;
  onToggleSave?: () => void;
}
export type PropertyType = "apartment" | "house" | "villa" | "studio" | null;

export interface FilterState {
  search: string;
  type: PropertyType;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType) => void;
  setBedrooms: (value: number | null) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  resetFilters: () => void;
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface FilterChipProps {
  label: string;
  onRemove: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface useSavedPropertiesProps {
  propertyId: string;
  onUnsave?: () => void;
}

export interface SpecItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export interface SavedProperty {
  id: string;
  property_id: string;
  properties: Properties | null;
}

export interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}
