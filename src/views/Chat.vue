<template>
  <div class="container-fluid v-chat">
    <div class="row h-100">
      <div class="col-md-4 col-lg-3 v-chat__sidebar">
        <div class="v-chat__sidebar__toolbar">
          <div class="v-chat__sidebar__toolbar__counter">
            <h3>Messages <span>{{ chats.length }}</span></h3>
          </div>
          <div class="v-chat__sidebar__toolbar__new">
            <VButton :block="true" size="sm" icon="left" icon-style="edit--3" styled="outlined" @click="startNewChat" text=""></VButton>
          </div>
        </div>
        <div class="v-chat__sidebar__search">
          <FilterChat @update-search="filterChats" />
        </div>
        <div class="v-chat__sidebar__messages">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item user-messages"
              v-for="chat in filteredChats"
              :key="chat.id"
              @click="selectChat(chat)"
              :class="{'currently-active': chat.id === activeChat?.id}"
            >
              <div class="user-messages__top">
                <div class="user-messages__top__avatar">
                  <img class="rounded-circle mr-2" :src="chat.userAvatar" alt="Person" style="width: 50px; height: 50px;">
                  <span v-if="chat.viewed_status && chat.viewed_status[currentUserId] === false" class="new-message-indicator"></span>
                </div>
                <div class="user-messages__top__name">
                  <h5 class="mb-1">{{ chat.full_name }}</h5>
                  <span>@{{ formatNick(chat.full_name) }}</span>
                </div>
                <div class="user-messages__top__time">
                  <small>{{ chat.timeAgo }}</small>
                </div>
              </div>
              <div class="user-messages__bottom">
                <p v-html="sanitizeHtml(truncateText(chat.lastMessage))"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column for Active Chat -->
      <div class="col-md-8 col-lg-9 v-chat__messages">
        <div v-if="isNewChat" class="v-chat__messages__chat v-chat__messages__chat--new">
          <div class="v-chat__messages__chat__header">
            <h4 class="v-chat__messages__chat__header__new">New Message</h4>
            <div class="v-chat__messages__chat__header__change" v-if="selectedUser">
              <ul>
                <li>
                  <VButton :block="true" size="sm" icon="no" styled="secondary" @click="changePerson" text="Change person"></VButton>
                </li>
                <li>
                  <VButton :block="true" size="sm" icon="no" styled="outlined" @click="goBack" text="Go back"></VButton>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="selectedUser" class="v-chat__messages__chat__search-user-chosen">
            <img class="rounded-circle mr-2" :src="selectedUser?.avatar" alt="Avatar" style="width: 50px; height: 50px;">
            <h5>{{ selectedUser?.full_name }}<br/><span>@{{ formatNick(selectedUser?.full_name) }}</span></h5>
            <VButton :block="true" size="md" icon="no" styled="primary" @click="debouncedStartChat" text="Start Chat"></VButton>
          </div>
          <div v-else class="v-chat__messages__chat__search-user">
            <input type="text" class="form-control" placeholder="New Message to @" v-model="searchUser" @input="filterUsers">
            <ul class="list-group" v-if="!selectedUser">
              <li v-for="user in filteredUsers" :key="user.id" class="list-group-item" @click="selectUser(user)">
                <img class="rounded-circle mr-2" :src="user.avatar" alt="Avatar" style="width: 40px; height: 40px;">
                <div>
                  <strong>{{ user.full_name }}</strong>
                  <span>@{{ formatNick(user.full_name) }}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="v-chat__messages__chat__empty">
            <div class="v-chat__messages__chat__empty__content">
              <v-iconbox class="v-mail-icon" />
              <h4>No chat history yet</h4>
            </div>
          </div>
        </div>

        <div v-else class="v-chat__messages__chat">
          <div class="v-chat__messages__chat__header" v-if="activeChat">
            <div class="v-chat__messages__chat__header__avatar">
              <img class="rounded-circle mr-2" :src="activeChat?.userAvatar" alt="{{ activeChat?.full_name }}">
            </div>
            <div class="v-chat__messages__chat__header__name">
              <h4>{{ activeChat?.full_name }}</h4>
              <span>@{{ activeChat?.full_name }}</span>
            </div>
          </div>

          <div class="v-chat__messages__chat__header" v-else="activeChat">
            <h4 class="v-chat__messages__chat__header__new">Select chat</h4>
          </div>

          <div class="v-chat__messages__chat__feed" ref="chatContainer" @click="markMessagesAsRead">
            <div class="v-chat__messages__chat__feed__wrapper">
              <div v-for="message in activeMessages" :key="message.id" class="user-message">
                <div v-if="!isCurrentUserMessage(message.from)" class="user-message__other">
                  <div class="user-message__other__avatar">
                    <img :src="activeChat?.userAvatar" alt="Avatar" class="rounded-circle chat-avatar">
                    <div class="user-message__other__avatar__status" style="display: none;"></div>
                  </div>
                  <div class="user-message__other__text">
                    <div class="user-message__other__text__info">
                      <span class="user-message__other__text__info__name">{{ activeChat?.full_name }}</span>
                      <small class="user-message__other__text__info__time">{{ formatTimestamp(message.timestamp) }}</small>
                    </div>
                    <div class="user-message__other__text__bubble">
                      <p v-html="sanitizeHtml(message.text)"></p>
                    </div>
                  </div>
                </div>

                <div v-else class="user-message__current">
                  <div class="user-message__current__info">
                    <span class="user-message__current__info__name">You</span>
                    <small class="user-message__current__info__time">{{ formatTimestamp(message.timestamp) }}</small>
                  </div>
                  <div class="user-message__current__bubble">
                    <p v-html="sanitizeHtml(message.text)"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="v-chat__messages__chat__action" v-if="activeChat || isNewChat">
            <div class="v-chat__messages__chat__action__wrapper">
              <div class="input-group" @click="markMessagesAsRead">
                <div contenteditable="true" class="form-control wysiwyg-editor" ref="messageInput" @input="updateMessage"></div>
              </div>
              <div class="v-chat__messages__chat__action__wrapper__toolbar">
                <ul>
                  <li>
                    <button class="wysiwyg-btn wysiwyg-btn--bold" type="button" @click="applyFormat('bold')"></button>
                  </li>
                  <li>
                    <button class="wysiwyg-btn wysiwyg-btn--italic" type="button" @click="applyFormat('italic')"></button>
                  </li>
                  <li>
                    <button class="wysiwyg-btn wysiwyg-btn--underline" type="button" @click="applyFormat('underline')"></button>
                  </li>
                  <li>
                    <button class="wysiwyg-btn wysiwyg-btn--list" type="button" @click="applyFormat('insertUnorderedList')"></button>
                  </li>
                  <li>
                    <button class="btn btn-primary" type="button" @click="sendMessage()">Send</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { debounce } from 'lodash';
  import { formatDistanceToNow } from 'date-fns';
  import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
  import { orderBy, getFirestore, collection, query, where, getDoc, doc, getDocs, addDoc, updateDoc, serverTimestamp, onSnapshot, Timestamp, limit } from 'firebase/firestore';
  import { format, isToday, isYesterday } from 'date-fns';
  import { db, auth } from '@/firebase.js';
  import FilterChat from '@/modules/Chat/FilterChat.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';
  import DOMPurify from 'dompurify';

  interface User {
    id: string;
    avatar: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    username?: string;
  }

  interface Chat {
    id: string;
    userAvatar: string;
    full_name: string;
    timeAgo: string;
    lastMessage: string;
    lastMessageTimestamp?: Date;
    participants: string[];
    viewed_status?: Record<string, boolean>;
  }

  interface Message {
    id: number;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
  }

  interface MessageType {
    id: string;
    from: string;
    text: string;
    timestamp: Timestamp;
  }

  interface Messages {
    [key: string]: MessageType[];
  }

  export default defineComponent({
    components: {
      FilterChat,
      VButton,
      VIconbox,
    },
    setup() {
      const chats = ref<Chat[]>([]);
      const messages = ref<Record<string, MessageType[]>>({});
      const activeChat = ref<Chat | null>(null);
      const newMessage = ref<string>('');
      const isNewChat = ref<boolean>(false);
      const chatContainer = ref<HTMLElement | null>(null);

      const searchUser = ref('');
      const selectedUser = ref<User | null>(null);
      const users = ref<User[]>([]);
      const filteredUsers = ref<User[]>([]);
      const currentUserId = ref<string>('');
      const debouncedStartChat = debounce(startChatWithSelectedUser, 300);

      const chatSearchTerm = ref('');
      const filterChats = (searchTerm: string) => {
        chatSearchTerm.value = searchTerm;
      };
      const filteredChats = computed(() => {
        if (!chatSearchTerm.value) return chats.value;
        return chats.value.filter(chat => chat.full_name.toLowerCase().includes(chatSearchTerm.value.toLowerCase()));
      });

      let unsubscribeMessagesListener: (() => void) | null = null;

      const db = getFirestore();

      async function fetchChats() {
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("participants", "array-contains", currentUserId.value));

        const querySnapshot = await getDocs(q);
        let fetchedChats = [];

        for (const docSnapshot of querySnapshot.docs) {
          const chatData = docSnapshot.data();
          const otherUserId = chatData.participants.find((id: string) => id !== currentUserId.value);

          if (!otherUserId) continue;

          const otherUserDocRef = doc(db, "users", otherUserId);
          const otherUserDoc = await getDoc(otherUserDocRef);

          if (!otherUserDoc.exists()) continue;
          const otherUserData = otherUserDoc.data();

          const userAvatar = otherUserData.avatar || "default_avatar_path";
          const full_name = otherUserData.full_name || "Unknown User";

          const messagesRef = collection(db, "chats", docSnapshot.id, "messages");
          const lastMessageQuery = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
          const lastMessageSnapshot = await getDocs(lastMessageQuery);

          let lastMessage = "No messages yet";
          let timeAgo = "";
          let lastMessageTimestamp = new Date(0);

          if (!lastMessageSnapshot.empty) {
            const lastMessageData = lastMessageSnapshot.docs[0].data();
            lastMessage = lastMessageData.text;
            const timestampDate = lastMessageData.timestamp.toDate();
            timeAgo = formatDistanceToNow(timestampDate, { addSuffix: true });
            lastMessageTimestamp = timestampDate;
          }

          fetchedChats.push({
            id: docSnapshot.id,
            userAvatar,
            full_name,
            lastMessage,
            timeAgo,
            lastMessageTimestamp,
            participants: chatData.participants,
            viewed_status: chatData.viewed_status || {},
          });
        }

        // Sort chats by lastMessageTimestamp from newest to oldest
        fetchedChats = fetchedChats.sort((a, b) => Number(b.lastMessageTimestamp) - Number(a.lastMessageTimestamp));
        chats.value = fetchedChats;
      }

      // Adjusted fetchUsersByRole function
      async function fetchUsersByRole() {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "in", [0, 1, 2]));
        const querySnapshot = await getDocs(q);
        users.value = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as User))
          .filter(user => user.id !== currentUserId.value);
        filteredUsers.value = users.value;
      }

      // Filter users based on search input
      function filterUsers() {
        const searchLower = searchUser.value.toLowerCase();
        filteredUsers.value = users.value.filter(user =>
          user.full_name.toLowerCase().includes(searchLower) &&
          user.id !== currentUserId.value // Exclude the current user
        );
      }

      function isCurrentUserMessage(messageFromId: string) {
        return currentUserId.value === messageFromId;
      }

      function selectUser(user: User) {
        selectedUser.value = user;
      }

      async function startChatWithSelectedUser() {
        try {
          if (!selectedUser.value) return;

          const participantIds = [currentUserId.value, selectedUser.value.id].sort();
          const participantsKey = participantIds.join('_');

          const chatsRef = collection(db, "chats");
          const q = query(chatsRef, where("participantsKey", "==", participantsKey));

          const querySnapshot = await getDocs(q);
          let chatId = '';
          if (querySnapshot.empty) {
            // No existing chat, create a new one
            const chatData = {
              participants: [currentUserId.value, selectedUser.value.id],
              participantsKey: participantsKey,
              createdAt: serverTimestamp(),
              userAvatar: selectedUser.value.avatar,
              full_name: selectedUser.value.full_name,
              viewed_status: { [currentUserId.value]: true },
              // Other necessary fields...
            };
            const chatRef = await addDoc(chatsRef, chatData);
            chatId = chatRef.id;
            // Update activeChat with selected user's details
            activeChat.value = { id: chatRef.id, ...chatData, timeAgo: '', lastMessage: '', participants: [currentUserId.value, selectedUser.value.id], };
          } else {
            // Existing chat found, set it as active
            chatId = querySnapshot.docs[0].id;
            const existingChatIndex = chats.value.findIndex(c => c.id === chatId);

            if (existingChatIndex !== -1) {
              chats.value[existingChatIndex] = { 
                ...chats.value[existingChatIndex], 
                viewed_status: { 
                  ...chats.value[existingChatIndex].viewed_status, 
                  [currentUserId.value]: true 
                } 
              };
            }

            // Update viewed_status for current user in Firestore
            const chatRef = doc(db, "chats", chatId);
            await updateDoc(chatRef, {
              [`viewed_status.${currentUserId.value}`]: true,
            });

            // Scroll to bottom of chat container
            nextTick(() => {
              setTimeout(() => {
                if (chatContainer.value) {
                  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
                }
              }, 600);
            });
            
          }
          // After setting activeChat, make sure to update UI
          activeChat.value = {
            id: chatId,
            userAvatar: selectedUser.value.avatar,
            full_name: selectedUser.value.full_name,
            lastMessage: '',
            timeAgo: '',
            participants: [currentUserId.value, selectedUser.value.id],
            viewed_status: { [currentUserId.value]: true },
          };

          selectedUser.value = null;
          isNewChat.value = false;
          if (activeChat.value) {
            listenForMessages(activeChat.value.id);
          }
        } catch (error) {
          console.error("Failed to start chat:", error);
        }
      }

      onMounted(() => {
        const user = auth.currentUser;
        if (user) {
          currentUserId.value = user.uid;
          fetchChats();
          fetchUsersByRole();
        }
      });

      function startNewChat() {
        isNewChat.value = true;
        filteredUsers.value = users.value;
      }

      function changePerson() {
        selectedUser.value = null;
        searchUser.value = '';
      }

      function goBack() {
        isNewChat.value = false;
        selectedUser.value = null;
        searchUser.value = '';
      }

      const activeMessages = computed(() => {
        return activeChat.value ? messages.value[activeChat.value.id] || [] : [];
      });

      async function selectChat(chat: any) {
        activeChat.value = chat;

        chat.viewed_status = { ...chat.viewed_status, [currentUserId.value]: true };

        if (!chat.full_name || !chat.userAvatar) {
          const otherUserId = chat.participants.find((id: string) => id !== currentUserId.value);
          if (otherUserId) {
            try {
              const userDocRef = doc(db, 'users', otherUserId);
              const userDocSnap = await getDoc(userDocRef);
              if (userDocSnap.exists()) {
                const otherUser = userDocSnap.data();
                if (activeChat.value) {
                  activeChat.value = {
                    ...activeChat.value,
                    userAvatar: otherUser.avatar,
                    full_name: otherUser.full_name,
                  };
                }
              }
            } catch (error) {
              console.error("Error fetching user information:", error);
            }
          }
        }

        const chatRef = doc(db, "chats", chat.id);
        await updateDoc(chatRef, {
          [`viewed_status.${currentUserId.value}`]: true,
        });

        // Scroll to bottom of chat container
        nextTick(() => {
          setTimeout(() => {
            if (chatContainer.value) {
              chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
          }, 500);
        });

        listenForMessages(chat.id);
      }

      async function sendMessage() {
        if (newMessage.value.trim() !== '' && activeChat.value) {
          const messagesRef = collection(db, "chats", activeChat.value.id, "messages");
          const otherUserId = activeChat.value.participants.find((id: string) => id !== currentUserId.value);

          console.log("otherUserId: ", otherUserId);
          
          await addDoc(messagesRef, {
            from: currentUserId.value,
            text: newMessage.value,
            timestamp: serverTimestamp(),
          });

          const chatRef = doc(db, "chats", activeChat.value?.id);
          await updateDoc(chatRef, {
            [`viewed_status.${currentUserId.value}`]: true,
            [`viewed_status.${otherUserId}`]: false,
          });

          // Update lastMessage and timeAgo for the active chat
          const chatIndex = chats.value.findIndex(chat => chat.id === activeChat.value?.id);
          if (chatIndex !== -1) {
            chats.value[chatIndex].lastMessage = newMessage.value;
            chats.value[chatIndex].timeAgo = "Just now";
            chats.value[chatIndex].lastMessageTimestamp = new Date();
            chats.value.sort((a, b) => (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0));
          }

          newMessage.value = '';

          // Clear the contenteditable div
          if (messageInput.value) {
            messageInput.value.innerHTML = '';
          }

          nextTick(() => {
            setTimeout(() => {
              if (chatContainer.value instanceof HTMLElement) {
                chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
              }
            }, 300);
          });
        }
      }

      function scrollToBottom() {
        nextTick(() => {
          setTimeout(() => {
            if (chatContainer.value) {
              chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
          }, 300);
        });
      }

      function listenForMessages(chatId: string) {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        unsubscribeMessagesListener = onSnapshot(q, (querySnapshot) => {
          const newMessages: MessageType[] = [];
          querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            newMessages.push({
              id: doc.id,
              from: messageData.from,
              text: messageData.text,
              timestamp: messageData.timestamp,
            });
            // Update lastMessage, timeAgo, and lastMessageTimestamp for the chat with new message
            const chatIndex = chats.value.findIndex(chat => chat.id === chatId);
            if (chatIndex !== -1) {
              chats.value[chatIndex].lastMessage = messageData.text;
              chats.value[chatIndex].timeAgo = formatDistanceToNow(messageData.timestamp.toDate(), { addSuffix: true });
              chats.value[chatIndex].lastMessageTimestamp = messageData.timestamp.toDate();
              // Re-sort chats
              chats.value.sort((a, b) => (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0));
            }
          });
          messages.value[chatId] = newMessages;
        });
      }

      // Call this function when you need to stop listening (e.g., when switching chats or on component unmount)
      function stopListeningForMessages() {
        if (unsubscribeMessagesListener) {
          unsubscribeMessagesListener();
          unsubscribeMessagesListener = null;
        }
      }

      const messageInput = ref<HTMLElement | null>(null);

      onMounted(() => {
        if (messageInput.value) {
          messageInput.value.focus();
        }
      });

      onUnmounted(() => {
        stopListeningForMessages();
      });

      function applyFormat(command: string) {
        document.execCommand(command, false);
      }

      function updateMessage() {
        newMessage.value = messageInput.value!.innerHTML;
      }

      async function markMessagesAsRead() {
        if (activeChat.value) {
          const chatRef = doc(db, "chats", activeChat.value.id);
          await updateDoc(chatRef, {
            [`viewed_status.${currentUserId.value}`]: true,
          });

          const chatIndex = chats.value.findIndex(chat => chat.id === activeChat.value?.id);
          if (chatIndex !== -1) {
            if (!chats.value[chatIndex].viewed_status) {
              chats.value[chatIndex].viewed_status = {};
            }
            chats.value[chatIndex].viewed_status![currentUserId.value] = true;
          }
        }
      }

      return {
        chats,
        activeChat,
        activeMessages: computed(() => activeChat.value ? messages.value[activeChat.value.id] || [] : []),
        newMessage,
        isNewChat,
        searchUser,
        filteredUsers,
        messageInput,
        startNewChat,
        filterUsers,
        selectChat,
        applyFormat,
        updateMessage,
        sendMessage,
        selectUser,
        startChatWithSelectedUser,
        selectedUser,
        changePerson,
        goBack,
        isCurrentUserMessage,
        debouncedStartChat,
        filterChats,
        filteredChats,
        chatContainer,
        scrollToBottom,
        currentUserId,
        markMessagesAsRead,
      };
    },
    methods: {
      formatTimestamp(timestamp: any) {
        const date = timestamp.toDate();
        let formattedDate = '';

        if (isToday(date)) {
          formattedDate = `Today, ${format(date, 'HH:mm')}`;
        } else if (isYesterday(date)) {
          formattedDate = `Yesterday, ${format(date, 'HH:mm')}`;
        } else {
          formattedDate = format(date, 'dd.MM.yyyy, HH:mm');
        }

        return formattedDate;
      },
      handleButtonClick() {
        
      },
      formatNick(fullNick: string) {
        return fullNick.toLowerCase().replace(/\s+/g, '.');
      },
      sanitizeHtml(htmlContent: string) {
        const cleanHtml = DOMPurify.sanitize(htmlContent, {
          FORBID_ATTR: ['style'],
        });
        return cleanHtml;
      },
      truncateText(text: string, maxLength = 100) {
        const strippedText = text.replace(/<[^>]*>?/gm, '');
        if (strippedText.length <= maxLength) return strippedText;
        let trimmedText = strippedText.substr(0, maxLength);
        trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
        return `${trimmedText}...`;
      },
      selectUser(user: User) {
        console.log("Selected user:", user);
      },
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
  @import url(./styles/chat.scss);
</style>
