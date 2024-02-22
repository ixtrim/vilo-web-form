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
          <Search />
        </div>

        <div class="v-chat__sidebar__messages">
          
          <ul class="list-group list-group-flush">
            <li class="list-group-item user-messages" v-for="chat in chats" :key="chat.id" @click="selectChat(chat)">

              <div class="user-messages__top">
                <div class="user-messages__top__avatar">
                  <img class="rounded-circle mr-2" :src="chat.userAvatar" alt="Person" style="width: 50px; height: 50px;">
                  <div class="user-messages__top__avatar__status"></div>
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
                <p v-html="sanitizeHtml(chat.lastMessage)"></p>
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
              <VButton :block="true" size="sm" icon="no" styled="outlined" @click="changePerson" text="Change person"></VButton>
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
            <div class="v-chat__messages__chat__header__avatar" >
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

          <div class="v-chat__messages__chat__feed" ref="chatContainer">
            <div class="v-chat__messages__chat__feed__wrapper">

              <div v-for="message in activeMessages" :key="message.id" class="user-message">

                <div v-if="!isCurrentUserMessage(message.from)" class="user-message__current">
                  <div class="user-message__current__info">
                    <span class="user-message__current__info__name">You</span>
                    <small class="user-message__current__info__time">{{ formatTimestamp(message.timestamp) }}</small>
                  </div>
                  <div class="user-message__current__bubble">
                    <p v-html="sanitizeHtml(message.text)"></p>
                  </div>
                </div>

                <div v-else class="user-message__other">
                  <div class="user-message__other__avatar">
                    <img :src="activeChat?.userAvatar" alt="Avatar" class="rounded-circle chat-avatar">
                    <div class="user-message__other__avatar__status"></div>
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

                
                
              </div>

            </div>
          </div>

          <div class="v-chat__messages__chat__action" v-if="activeChat || isNewChat">
            <div class="v-chat__messages__chat__action__wrapper">

              <div class="input-group">
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
  import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
  import { orderBy, getFirestore, collection, query, where, getDoc, doc, getDocs, addDoc, serverTimestamp, onSnapshot, Timestamp } from 'firebase/firestore';
  import { format, isToday, isYesterday } from 'date-fns';
  import { db, auth } from '@/firebase.js';
  import Search from '@/modules/Navigation/Search.vue';
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
      Search,
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

      let unsubscribeMessagesListener: (() => void) | null = null;

      const db = getFirestore();

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

          if (querySnapshot.empty) {
            // No existing chat, create a new one
            const chatData = {
              participants: [currentUserId.value, selectedUser.value.id],
              participantsKey: participantsKey,
              createdAt: serverTimestamp(),
              userAvatar: selectedUser.value.avatar,
              full_name: selectedUser.value.full_name,
              // Other necessary fields...
            };
            const chatRef = await addDoc(chatsRef, chatData);
            // Update activeChat with selected user's details
            activeChat.value = { id: chatRef.id, ...chatData, timeAgo: '', lastMessage: '' };
          } else {
            // Existing chat found, set it as active
            querySnapshot.forEach((doc) => {
              activeChat.value = { id: doc.id, ...doc.data(), userAvatar: '', full_name: '', timeAgo: '', lastMessage: '' };
            });
          }
          // After setting activeChat, make sure to update UI
          activeChat.value = { ...activeChat.value, id: activeChat.value?.id || '', userAvatar: activeChat.value?.userAvatar || '', full_name: activeChat.value?.full_name ?? '', timeAgo: activeChat.value?.timeAgo ?? '', lastMessage: activeChat.value?.lastMessage ?? '' };

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
        }
        fetchUsersByRole();
      });

      function startNewChat() {
        isNewChat.value = true;
        filteredUsers.value = users.value;
      }

      function changePerson() {
        selectedUser.value = null;
        searchUser.value = '';
      }

      const activeMessages = computed(() => {
        return activeChat.value ? messages.value[activeChat.value.id] || [] : [];
      });

      async function selectChat(chat: any) {
        activeChat.value = chat;
        isNewChat.value = false;

        // Find the ID of the other participant
        const otherUserId = chat.participants.find((id: string) => id !== currentUserId.value);
        console.error("currentUserId:" + currentUserId);
        console.error("otherUserId:" + otherUserId);
        if (otherUserId) {
          try {
            const userDocRef = doc(db, 'users', otherUserId);
            const userDocSnap = await getDoc(userDocRef);
            console.log("User document:", userDocSnap.data());
            if (userDocSnap.exists()) {
              const otherUser = userDocSnap.data();
              // Update activeChat with other user's details
              if (activeChat.value) {
                activeChat.value = {
                  ...activeChat.value,
                  userAvatar: otherUser.avatar,
                  full_name: otherUser.full_name,
                };
              }
            } else {
              console.error("User document not found");
            }
          } catch (error) {
            console.error("Error fetching user information:", error);
          }
        }

        // Listen for messages in the selected chat
        listenForMessages(chat.id);
      }

      async function sendMessage() {
        if (newMessage.value.trim() !== '' && activeChat.value) {
          const messagesRef = collection(db, "chats", activeChat.value.id, "messages");
          await addDoc(messagesRef, {
            from: currentUserId.value,
            text: newMessage.value,
            timestamp: serverTimestamp(),
          });

          newMessage.value = ''; // Clear the input after sending
          // No need to manually update the messages list if you're listening for updates
        }
      }

      function scrollToBottom() {
        nextTick(() => {
          setTimeout(() => {
            const chatContainerElement = chatContainer.value;
            if (chatContainerElement) {
              chatContainerElement.scrollTop = chatContainerElement.scrollHeight;
            }
          }, 100);
        });
      }

      function listenForMessages(chatId: string) {
        const messagesRef = collection(db, "chats", chatId, "messages");

        const q = query(messagesRef, orderBy("timestamp", "asc"));

        unsubscribeMessagesListener = onSnapshot(q, (querySnapshot) => {
          const newMessages: MessageType[] = [];
          querySnapshot.forEach((doc: any) => {
            newMessages.push({ id: doc.id, ...doc.data() });
          });
          messages.value[chatId] = newMessages; // Assuming you have a reactive property for messages
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
        scrollToBottom,
        selectUser,
        startChatWithSelectedUser,
        selectedUser,
        changePerson,
        isCurrentUserMessage,
        debouncedStartChat,
      };
    },
    methods: {
      formatTimestamp(timestamp: any) {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
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
        return DOMPurify.sanitize(htmlContent);
      },
      selectUser(user: User) { // Now 'user' is explicitly typed
        console.log("Selected user:", user);
        // Implement chat creation or selection logic here
      },
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
  @import url(./styles/chat.scss);
</style>
