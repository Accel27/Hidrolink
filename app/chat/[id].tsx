import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, typography, radius } from '@/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); 
  const { messages, sendMessage, markMessagesAsRead } = useApp();
  const { role } = useAuth(); 
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const currentRole = role === 'client' ? 'client' : 'driver';
  const requestMessages = messages.filter(m => m.requestId === id);

  useEffect(() => {
    markMessagesAsRead(id as string, currentRole);
  }, []);

  const handleSend = (msgText: string) => {
    sendMessage(id as string, currentRole, msgText);
    setText('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  return (
    // El SafeAreaView SOLO protege arriba y a los lados, NO abajo
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }} edges={['top', 'left', 'right']}>
      
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} onPress={() => router.back()} />
        <Text style={typography.h3}>{role === 'client' ? 'Chat con Conductor' : 'Chat con Cliente'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior="padding" 
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={requestMessages}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, flexGrow: 1 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isMe = item.senderId === currentRole;
            return (
              <View style={[styles.msgBubble, isMe ? styles.msgMe : styles.msgOther]}>
                <Text style={{ color: isMe ? colors.white : colors.textPrimary }}>{item.text}</Text>
              </View>
            );
          }}
        />

        {role === 'driver' && (
          <View style={styles.quickReplies}>
            {['Voy en camino', 'Ya llegué', '¿Dónde es exactamente?'].map((reply, i) => (
              <Pressable key={i} style={styles.replyBtn} onPress={() => handleSend(reply)}>
                <Text style={{ fontSize: 12, color: colors.primary }}>{reply}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={text}
            onChangeText={setText}
            placeholderTextColor={colors.textMuted}
          />
          <Pressable style={styles.sendBtn} onPress={() => handleSend(text)}>
            <Ionicons name="send" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.border },
  msgBubble: { maxWidth: '80%', padding: spacing.md, borderRadius: radius.md },
  msgMe: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 0 },
  msgOther: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 0 },
  quickReplies: { flexDirection: 'row', padding: spacing.sm, gap: spacing.sm, backgroundColor: colors.surface },
  replyBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: colors.primaryLight, backgroundColor: colors.primaryLight },
  inputContainer: { flexDirection: 'row', padding: spacing.md, backgroundColor: colors.surface, alignItems: 'center', gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 10 },
  sendBtn: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.full },
});