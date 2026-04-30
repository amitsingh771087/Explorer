import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="Search">
        <Label>Search</Label>
        <Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="Saved">
        <Label>Saved</Label>
        <Icon sf="heart" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="Profile">
        <Label>Profile</Label>
        <Icon sf="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
