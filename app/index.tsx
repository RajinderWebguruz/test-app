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
import RNOtpVerify from "react-native-otp-verify";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scanning, setScanning] = useState(false);
  const [receivedSms, setReceivedSms] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<string[]>([]);

  useEffect(() => {
    if (scanning && Platform.OS === "android") {
      RNOtpVerify.getHash()
        .then((hashArray) => {
          setHash(hashArray);
        })
        .catch((err) => setError(err.message));

      RNOtpVerify.getOtp()
        .then(() => {
          RNOtpVerify.addListener((message) => {
            setReceivedSms(message);
            const match = message.match(/\b\d{6}\b/);
            if (match) setOtp(match[0]);
            setScanning(false);
            RNOtpVerify.removeListener();
          });
        })
        .catch((e) => {
          setError("Failed to start OTP listener.");
          setScanning(false);
        });

      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, [scanning]);

  const startSmsScan = () => {
    if (Platform.OS === "android") {
      setScanning(true);
      setReceivedSms(null);
      setOtp(null);
      setError(null);
      setHash([]);
    } else {
      Alert.alert(
        "Unsupported Platform",
        "OTP auto-capture is only available on Android."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Auto-Capture Example</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number (for context)"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType="phone-pad"
      />

      <Button
        title="Start OTP Scan"
        onPress={startSmsScan}
        disabled={scanning}
      />

      {scanning && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Initiating OTP scan...</Text>
          <Text style={styles.statusText}>Waiting for SMS...</Text>
        </View>
      )}

      {hash.length > 0 && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Hash Values:</Text>
          {hash.map((hashValue, index) => (
            <Text key={index} style={styles.smsContent}>
              {hashValue}
            </Text>
          ))}
        </View>
      )}

      {otp && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Auto-captured OTP: {otp}</Text>
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
