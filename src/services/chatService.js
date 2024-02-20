import { db } from '../firebase';
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  serverTimestamp,
  orderBy,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

// Function to start or get an existing chat between two users
async function startOrGetChat(userId1, userId2) {
  // Check if a chat already exists between these two users
  let chatId = null;
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', '==', [userId1, userId2].sort()));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    chatId = doc.id; // Chat found
  });

  if (!chatId) {
    // If no chat found, create a new chat document
    const docRef = await addDoc(chatsRef, {
      participants: [userId1, userId2].sort(),
      createdAt: serverTimestamp(),
    });
    chatId = docRef.id;
  }

  return chatId;
}

// Function to send a message in a chat
async function sendMessage(chatId, fromUserId, messageText) {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  await addDoc(messagesRef, {
    from: fromUserId,
    text: messageText,
    createdAt: serverTimestamp(),
  });
}

// Function to listen for new messages in a chat
function listenForNewMessages(chatId, callback) {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  return onSnapshot(q, callback);
}

// Function to fetch chats for a user
async function fetchChatsForUser(userId) {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  const chats = [];
  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  return chats;
}

export { startOrGetChat, sendMessage, listenForNewMessages, fetchChatsForUser };
