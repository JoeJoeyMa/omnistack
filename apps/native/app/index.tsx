import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          MAPLE-GLOBAL Native
        </Text>
        <Text style={{ color: "#475569" }}>
          Expo + React Native template scaffold
        </Text>
      </View>
    </SafeAreaView>
  );
}
