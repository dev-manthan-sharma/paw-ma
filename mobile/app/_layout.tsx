import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          statusBarHidden: true,
          headerShown: false,
        }}
      />
      <StatusBar hidden={true} barStyle={"default"} />
    </ThemeProvider>
  );
}
