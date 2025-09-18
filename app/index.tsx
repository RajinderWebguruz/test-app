import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Clipboard,
  Alert,
  TextInput,
} from "react-native";

import SmsRetriever from "react-native-sms-retriever";
import Auth0 from "react-native-auth0";

export default function Index() {
  // Use your static production hash here
  const appHash = "gQObt5NXT0F";
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);

  const auth0 = new Auth0({
    domain: "dev-6qnrfng57jbtstly.us.auth0.com",
    clientId: "6mTIELaVgQZA6rCfgYFisYtrjC1RrAiq",
  });

  useEffect(() => {
    let smsListener: any;
    const startSmsListener = async () => {
      try {
        smsListener = SmsRetriever.addSmsListener((event) => {
          const message = event.message as string;
          // Extract 6-digit OTP from the message
          const otpMatch = message.match(/\d{6}/);
          if (otpMatch) {
            setOtp(otpMatch[0]);
            Alert.alert("OTP Captured", otpMatch[0]);
            SmsRetriever.removeSmsListener();
          }
        });
        await SmsRetriever.startSmsRetriever();
      } catch (error) {
        console.warn("SMS Retriever error:", error);
      }
    };

    startSmsListener();

    return () => {
      if (smsListener) SmsRetriever.removeSmsListener();
    };
  }, []);

  const sendOTP = async () => {
    try {
      await auth0.auth.passwordlessWithSMS({ phoneNumber: phone });
      setIsOTPSent(true);
      Alert.alert("OTP sent!");
    } catch (e: any) {
      Alert.alert("Error sending OTP", e.message);
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await auth0.auth.loginWithSMS({
        phoneNumber: phone,
        code: otp,
      });
      Alert.alert("Success!", "Logged in: " + JSON.stringify(response));
    } catch (e: any) {
      Alert.alert("Error verifying OTP", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SMS Retriever App Hash</Text>
      <Text style={styles.label}>11-char Hash:</Text>
      <Text selectable style={styles.hash}>
        {appHash}
      </Text>
      <View style={{ height: 20 }} />
      <Text style={styles.note}>
        This hash must match the one used in your production SMS message.
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text>Auto-captured OTP: {otp}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Phone Number:</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="+1234567890"
          keyboardType="phone-pad"
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Button title="Send OTP" onPress={sendOTP} disabled={isOTPSent} />
        {isOTPSent && (
          <>
            <Text>Enter OTP:</Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <Button title="Verify OTP" onPress={verifyOTP} />
          </>
        )}
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
