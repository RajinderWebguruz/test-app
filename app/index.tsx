import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Clipboard,
} from "react-native";
import Constants from "expo-constants";
import SmsRetriever from "react-native-sms-retriever";
import { NativeModules } from "react-native";

export default function Index() {
  const [appHash, setAppHash] = useState("NOT_PROVIDED");
  const packageName =
    Constants.manifest?.android?.package || "com.rajinder160725.y";

  useEffect(() => {
    async function fetchHash() {
      try {
        // First try react-native-sms-retriever
        // react-native-sms-retriever does not have getAppHash, but getAppHashSync may exist
        let hash: string | undefined;
        if (typeof (SmsRetriever as any).getAppHashSync === "function") {
          hash = (SmsRetriever as any).getAppHashSync();
        }
        if (hash) {
          console.log("Hash from react-native-sms-retriever:", hash);
          setAppHash(hash);
          return;
        }
      } catch (err) {
        console.warn("react-native-sms-retriever failed:", err);
      }

      try {
        // Fallback: check NativeModules (in case another lib is linked)
        const { RNSmsRetrieverModule } = NativeModules;
        if (RNSmsRetrieverModule?.getAppHash) {
          const hash = await RNSmsRetrieverModule.getAppHash();
          console.log("Hash from NativeModules:", hash);
          setAppHash(hash);
          return;
        }
      } catch (err) {
        console.warn("NativeModules fallback failed:", err);
      }

      // Fallback to manifest extra (manual config if needed)
      const fallback = Constants.manifest?.extra?.SMS_HASH || "NOT_PROVIDED";
      setAppHash(fallback);
    }

    fetchHash();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SMS Retriever App Hash</Text>
      <Text style={styles.label}>Package:</Text>
      <Text selectable style={styles.value}>
        {packageName}
      </Text>
      <Text style={styles.label}>11-char Hash:</Text>
      <Text selectable style={styles.hash}>
        {appHash}
      </Text>
      <View style={{ height: 20 }} />
      <Button title="Copy hash" onPress={() => Clipboard.setString(appHash)} />
      <View style={{ marginTop: 20 }}>
        <Text style={styles.note}>
          Compute or fetch this hash with your keystore and include it in the
          SMS message sent by your server.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 14, color: "#333", marginTop: 8 },
  value: { fontSize: 13, color: "#111" },
  hash: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  note: { fontSize: 12, color: "#666" },
});
