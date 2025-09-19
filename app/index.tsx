import React from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";

// Force RTL globally
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testing Layout</Text>

      <Text style={styles.paragraph}>
        This is a sample paragraph to check how the text flows inside the app.
        You can use it to verify whether the layout appears correctly on devices
        with different languages and directions.
      </Text>

      <Text style={styles.paragraph}>
        Another block of text for testing. The goal is to see alignment,
        spacing, and readability. If your device language is Hebrew or Arabic,
        this should still follow the forced layout direction you define.
      </Text>

      <Text style={styles.paragraph}>
        Final testing line. Make sure it looks consistent across both Android
        and iOS without flipping unexpectedly when the system language changes.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "flex-start", // Stick content to the right
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    // textAlign: "left", // make text direction RTL
  },
});

export default App;
