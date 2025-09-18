import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import SmsRetriever from "react-native-sms-retriever";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scanning, setScanning] = useState(false);
  const [receivedSms, setReceivedSms] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scanning) {
      const addListener = async () => {
        try {
          if (Platform.OS === "android") {
            // Start the SMS retriever
            await SmsRetriever.startSmsRetriever();
            console.log("SMS Retriever started");

            // Add the listener
            SmsRetriever.addSmsListener((event) => {
              console.log(event.message);
              setScanning(false);
              setReceivedSms(event.message ?? null);
              // OTP extraction logic would go here
              SmsRetriever.removeSmsListener();
            });
          }
        } catch (e) {
          console.error(e);
          setScanning(false);
          setError("Failed to start SMS listener.");
        }
      };
      addListener();

      // Clean up the listener on component unmount
      return () => {
        if (Platform.OS === "android") {
          SmsRetriever.removeSmsListener();
        }
      };
    }
  }, [scanning]);

  const startSmsScan = async () => {
    if (Platform.OS === "android") {
      setScanning(true);
      setReceivedSms(null);
      setError(null);
    } else {
      Alert.alert(
        "Unsupported Platform",
        "SMS Retriever is only available on Android."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Retriever Example</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number (for context)"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />

      <Button
        title="Start SMS Scan"
        onPress={startSmsScan}
        disabled={scanning}
      />

      {scanning && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Initiating SMS scan...</Text>
          <Text style={styles.statusText}>Waiting for SMS...</Text>
        </View>
      )}

      {receivedSms && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>SMS Received!</Text>
          <Text style={styles.smsContent}>{receivedSms}</Text>
        </View>
      )}

      {error && (
        <View style={styles.statusContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statusContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "blue",
  },
  smsContent: {
    fontSize: 14,
    color: "green",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default App;
