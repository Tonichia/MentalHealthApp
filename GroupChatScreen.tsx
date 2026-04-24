import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { supabase } from './supabase';

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

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('group_name', groupName)
        .order('created_at', { ascending: true });

      if (data) {
        setChat(data.map((msg: any) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          isMe: msg.sender === 'You',
        })));
      }
      setIsLoading(false);
    };
    loadMessages();

    const subscription = supabase
      .channel(`public:messages:group_name=eq.${groupName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_name=eq.${groupName}` },
        (payload) => {
          const newMsg = payload.new;
          setChat((prev) => [...prev, {
            id: newMsg.id,
            text: newMsg.text,
            sender: newMsg.sender,
            isMe: newMsg.sender === 'You',
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
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
      <View style={[styles.bubbleWrapper, item.isMe ? styles.myBubbleWrapper : styles.theirBubbleWrapper]}>
        {!item.isMe && isFirst && (
          <View style={styles.senderAvatar}>
            <Text style={styles.senderInitial}>{item.sender.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        {!item.isMe && !isFirst && <View style={styles.avatarSpacer} />}
        <View style={[styles.bubble, item.isMe ? styles.myBubble : styles.theirBubble]}>
          {!item.isMe && isFirst && <Text style={styles.senderName}>{item.sender}</Text>}
          <Text style={[styles.messageText, item.isMe ? styles.myText : styles.theirText]}>
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#261A1A" />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={chat}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatContainer}
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatIcon}>💬</Text>
                <Text style={styles.emptyChatText}>No messages yet.</Text>
                <Text style={styles.emptyChatSub}>Be the first to say something!</Text>
              </View>
            }
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#94A3B8"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCF9F3' },
  container: { flex: 1 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#807474', fontWeight: '500' },

  chatContainer: { padding: 16, gap: 6, flexGrow: 1 },

  bubbleWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  myBubbleWrapper: { justifyContent: 'flex-end' },
  theirBubbleWrapper: { justifyContent: 'flex-start', gap: 8 },

  senderAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#261A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderInitial: { color: '#FCF9F3', fontSize: 12, fontWeight: '800' },
  avatarSpacer: { width: 30 },

  bubble: { maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  myBubble: { backgroundColor: '#261A1A', borderBottomRightRadius: 4 },
  theirBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#261A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D2C3C3',
  },
  senderName: { fontSize: 11, fontWeight: '700', color: '#807474', marginBottom: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#FCF9F3' },
  theirText: { color: '#1C1C18' },

  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 8 },
  emptyChatIcon: { fontSize: 44 },
  emptyChatText: { fontSize: 16, fontWeight: '700', color: '#4E4444' },
  emptyChatSub: { fontSize: 14, color: '#807474' },

  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#D2C3C3',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    fontSize: 15,
    color: '#1C1C18',
    borderWidth: 1,
    borderColor: '#D2C3C3',
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#261A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#EBE8E2' },
  sendIcon: { color: '#FCF9F3', fontSize: 18, fontWeight: '800' },
});
