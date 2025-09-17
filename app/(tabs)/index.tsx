import Constants from 'expo-constants';
import React from 'react';
import { Button, Clipboard, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  // Put your computed hash into app.json or EAS secrets and access via Constants.manifest.extra.hash
  const appHash = (Constants.manifest && Constants.manifest.extra && Constants.manifest.extra.SMS_HASH) || 'NOT_PROVIDED';

  const packageName = Constants.manifest?.android?.package || 'com.example.myapp';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SMS Retriever App Hash</Text>
      <Text style={styles.label}>Package:</Text>
      <Text selectable style={styles.value}>{packageName}</Text>
      <Text style={styles.label}>11-char Hash:</Text>
      <Text selectable style={styles.hash}>{appHash}</Text>
      <View style={{height:20}} />
      <Button title="Copy hash" onPress={() => Clipboard.setString(appHash)} />
      <View style={{marginTop: 20}}>
        <Text style={styles.note}>Compute the hash with your keystore and include it in the SMS message sent by your server.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, color: '#333', marginTop: 8 },
  value: { fontSize: 13, color: '#111' },
  hash: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  note: { fontSize: 12, color: '#666' },
});
