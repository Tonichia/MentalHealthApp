import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { supabase } from './supabase';
import { C, F, SHADOW_SM } from './theme';

type GroupChatRouteProp = RouteProp<RootStackParamList, 'GroupChat'>;

interface Message {
  id: string;
  text: string;
  sender: string;
  isMe: boolean;
}

export const GroupChatScreen = () => {
  const route = useRoute<GroupChatRouteProp>();
  const { groupName } = route.params;

  const [message,   setMessage]   = useState('');
  const [chat,      setChat]      = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages').select('*')
        .eq('group_name', groupName)
        .order('created_at', { ascending: true });

      if (data) {
        setChat(data.map((msg: any) => ({
          id: msg.id, text: msg.text,
          sender: msg.sender, isMe: msg.sender === 'You',
        })));
      }
      setIsLoading(false);
    };
    loadMessages();

    const subscription = supabase
      .channel(`public:messages:group_name=eq.${groupName}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_name=eq.${groupName}` },
        (payload) => {
          const newMsg = payload.new;
          setChat(prev => [...prev, {
            id: newMsg.id, text: newMsg.text,
            sender: newMsg.sender, isMe: newMsg.sender === 'You',
          }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [groupName]);

  const handleSend = async () => {
    if (message.trim().length === 0) return;
    const tempMessage = message;
    setMessage('');
    await supabase.from('messages').insert([{ group_name: groupName, text: tempMessage, sender: 'You' }]);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isFirst = index === 0 || chat[index - 1]?.isMe !== item.isMe;
    return (
      <View style={[styles.msgRow, item.isMe ? styles.myRow : styles.theirRow]}>
        {!item.isMe && (
          isFirst
            ? <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{item.sender.charAt(0).toUpperCase()}</Text>
              </View>
            : <View style={styles.avatarSpacer} />
        )}
        <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.theirBubble]}>
          {!item.isMe && isFirst && (
            <Text style={styles.senderName}>{item.sender}</Text>
          )}
          <Text style={[styles.msgText, item.isMe ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={chat}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatContent}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>💬</Text>
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptySub}>Be the first to say something!</Text>
              </View>
            }
          />
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={C.outline}
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  container: { flex: 1 },

  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  loadingText: { fontFamily: F.medium, fontSize: 14, color: C.outline },

  chatContent: { padding: 16, gap: 4, flexGrow: 1, paddingBottom: 8 },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  myRow:    { justifyContent: 'flex-end' },
  theirRow: { justifyContent: 'flex-start', gap: 8 },

  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontFamily: F.extraBold, color: C.background, fontSize: 13 },
  avatarSpacer: { width: 32 },

  bubble: { maxWidth: '76%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  myBubble: {
    backgroundColor: C.primary,
    borderBottomRightRadius: 4, ...SHADOW_SM,
  },
  theirBubble: {
    backgroundColor: C.surface, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: C.outlineVariant, ...SHADOW_SM,
  },
  senderName: { fontFamily: F.bold, fontSize: 11, color: C.outline, marginBottom: 4 },
  msgText: { fontFamily: F.body, fontSize: 15, lineHeight: 22 },
  myText: { color: C.background },
  theirText: { color: C.onSurface },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontFamily: F.headline, fontSize: 18, color: C.onSurfaceVariant },
  emptySub: { fontFamily: F.body, fontSize: 14, color: C.outline },

  inputBar: {
    flexDirection: 'row', padding: 12, gap: 10,
    backgroundColor: C.surface, borderTopWidth: 1,
    borderColor: C.outlineVariant, alignItems: 'flex-end',
  },
  input: {
    flex: 1, backgroundColor: C.background,
    paddingHorizontal: 18, paddingVertical: 11,
    borderRadius: 9999, fontFamily: F.body, fontSize: 15,
    color: C.onSurface, borderWidth: 1, borderColor: C.outlineVariant,
    maxHeight: 100,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    ...SHADOW_SM,
  },
  sendBtnDisabled: { backgroundColor: C.outlineVariant },
  sendIcon: { color: C.background, fontSize: 18, fontFamily: F.extraBold },
});
