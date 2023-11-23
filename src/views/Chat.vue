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
                  <img class="rounded-circle mr-2" :src="chat.personIcon" alt="Person" style="width: 50px; height: 50px;">
                  <div class="user-messages__top__avatar__status"></div>
                </div>
                <div class="user-messages__top__name">
                  <h5 class="mb-1">{{ chat.fullName }}</h5>
                  <span>@{{ chat.nick }}</span>
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
          </div>

          <div class="v-chat__messages__chat__search-user">
            <input type="text" class="form-control" placeholder="New Message to @" v-model="searchUser" @input="filterUsers">
            <ul class="list-group">
              <li v-for="user in filteredUsers" :key="user.id" class="list-group-item" @click="selectUser(user)">
                <img class="rounded-circle mr-2" :src="user.avatar" alt="Avatar" style="width: 30px; height: 30px;">
                {{ user.fullName }} (@{{ user.nick }})
              </li>
            </ul>
          </div>
          
          <div class="v-chat__messages__chat__empty">
            <div class="v-chat__messages__chat__empty__content">
              <v-iconbox class="v-mail-icon" />
              <h4>No chat history yet</h4>
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

        <div v-else class="v-chat__messages__chat">

          <div class="v-chat__messages__chat__header" v-if="activeChat">
            <div class="v-chat__messages__chat__header__avatar" >
              <img class="rounded-circle mr-2" :src="activeChat?.personIcon" alt="{{ activeChat?.fullName }}">
            </div>
            <div class="v-chat__messages__chat__header__name">
              <h4>{{ activeChat?.fullName }}</h4>
              <span>@{{ activeChat?.nick }}</span>
            </div>
            <div class="v-chat__messages__chat__header__archive">
              <VButton :block="true" size="md" styled="outlined" @click="handleButtonClick" text="Archive"></VButton>
            </div>
          </div>

          <div class="v-chat__messages__chat__header" v-else="activeChat">
            <h4 class="v-chat__messages__chat__header__new">Select chat</h4>
          </div>

          <div class="v-chat__messages__chat__feed" ref="chatContainer">
            <div class="v-chat__messages__chat__feed__wrapper">

              <div v-for="message in activeMessages" :key="message.id" class="user-message">

                <div v-if="!message.isCurrentUser" class="user-message__other">
                  <div class="user-message__other__avatar">
                    <img :src="activeChat?.personIcon" alt="Avatar" class="rounded-circle chat-avatar">
                    <div class="user-message__other__avatar__status"></div>
                  </div>
                  <div class="user-message__other__text">
                    <div class="user-message__other__text__info">
                      <span class="user-message__other__text__info__name">{{ activeChat?.fullName }}</span>
                      <small class="user-message__other__text__info__time">{{ message.timestamp }}</small>
                    </div>
                    <div class="user-message__other__text__bubble">
                      <p v-html="sanitizeHtml(message.content)"></p>
                    </div>
                  </div>
                </div>

                <div v-else="!message.isCurrentUser" class="user-message__current">
                  <div class="user-message__current__info">
                    <span class="user-message__current__info__name">You</span>
                    <small class="user-message__current__info__time">{{ message.timestamp }}</small>
                  </div>
                  <div class="user-message__current__bubble">
                    <p v-html="sanitizeHtml(message.content)"></p>
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
  import axios from 'axios';
  import DOMPurify from 'dompurify';
  import { defineComponent, ref, computed, onMounted, nextTick } from 'vue';
  import Search from '@/modules/Navigation/Search.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';

  interface Chat {
    id: number;
    personIcon: string;
    fullName: string;
    nick: string;
    timeAgo: string;
    lastMessage: string;
  }

  interface User {
    id: number;
    avatar: string;
    fullName: string;
    nick: string;
    first_name: string;
    last_name: string;
    username: string;
  }

  interface Message {
    id: number;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
  }

  interface Messages {
    [key: number]: Message[];
  }

  export default defineComponent({
    components: {
      Search,
      VButton,
      VIconbox,
    },
    setup() {

      const sampleMessages = [
        "Have you reviewed the latest case brief?",
        "Reminder: Client meeting rescheduled to 2 PM.",
        "Could you forward the updated contract draft?",
        "Let's discuss the implications of the new statute tomorrow.",
        "I'll need your input on the Smith negotiation strategy.",
        "Are the deposition summaries ready for review?",
        "Please confirm receipt of the settlement agreement.",
        "The court's ruling on our motion just came in.",
        "We need to update our compliance guidelines by next week.",
        "Can we set a meeting to go over the case law findings?",
        "The merger documents require your signature by EOD.",
        "I've attached the patent filing for your perusal.",
        "Urgent: The opposition has filed an injunction.",
        "Let's debrief on the recent legislative changes.",
        "The client has requested a copy of their case file.",
        "Have we received the witness affidavits yet?",
        "Please review the attached legal brief before submission.",
        "We need to coordinate with the finance team onimport axios from 'axios'; the budget.",
        "The regulatory filing deadline is approaching fast.",
        "Can you handle the client follow-up for the Johnson estate?"
      ];

      function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * sampleMessages.length);
        return sampleMessages[randomIndex];
      }

      const chats = ref<Chat[]>([]);
      const messages = ref<Messages>({});
      const activeChat = ref<Chat | null>(null);
      const newMessage = ref<string>('');
      const isNewChat = ref<boolean>(false);
      const searchUser = ref<string>('');
      const filteredUsers = ref<User[]>([]);
      const users = ref<User[]>([]);
      const chatContainer = ref<HTMLElement | null>(null);

      onMounted(async () => {
        try {
          const response = await axios.get('https://random-data-api.com/api/users/random_user?size=20');
          const usersData: User[] = response.data;
          chats.value = usersData.map((user, index) => {
            const id = index + 1;
            messages.value[id] = Array.from({ length: 5 }, () => ({
              id: Math.random(),
              content: getRandomMessage(),
              timestamp: `10:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
              isCurrentUser: Math.random() > 0.5
            }));
            return {
              id: id,
              personIcon: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
              fullName: `${user.first_name} ${user.last_name}`,
              nick: user.username,
              timeAgo: `${5 * (index + 1)}m ago`,
              lastMessage: messages.value[id][0].content
            };
          });
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      });

      function startNewChat() {
        isNewChat.value = true;
        filteredUsers.value = users.value;
      }

      function filterUsers() {
        if (searchUser.value) {
          filteredUsers.value = users.value.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchUser.value.toLowerCase())
          );
        } else {
          filteredUsers.value = users.value;
        }
      }

      function selectUser(user: User) {
        // Here we will add fx to search thru users for new message
      }

      const activeMessages = computed(() => {
        return activeChat.value ? messages.value[activeChat.value.id] || [] : [];
      });

      function selectChat(chat: Chat) {
        activeChat.value = chat;
        isNewChat.value = false;
      }

      function sendMessage() {
        if (newMessage.value.trim() !== '' && activeChat.value) {
          const chatMessages = messages.value[activeChat.value.id] || [];
          chatMessages.push({
            id: chatMessages.length + 1,
            content: newMessage.value,
            timestamp: new Date().toLocaleTimeString(),
            isCurrentUser: true
          });

          // Update the last message and timeAgo in the chat object
          chats.value = chats.value.map(c => {
            if (c.id === activeChat.value?.id) {
              // Format the current time as needed
              const currentTimeFormatted = "Just now"; // This can be more dynamic based on actual time difference
              return { ...c, lastMessage: newMessage.value, timeAgo: currentTimeFormatted };
            }
            return c;
          });

          // Move the active chat to the top of the list
          const activeChatIndex = chats.value.findIndex(c => c.id === activeChat.value?.id);
          if (activeChatIndex > -1) {
            const activeChatData = chats.value.splice(activeChatIndex, 1)[0];
            chats.value.unshift(activeChatData);
          }

          // Clear the WYSIWYG editor
          if (messageInput.value) {
            messageInput.value.innerHTML = '';
          }

          // Also clear the newMessage reactive variable
          newMessage.value = '';
          scrollToBottom();
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

      const messageInput = ref<HTMLElement | null>(null);

      onMounted(() => {
        if (messageInput.value) {
          messageInput.value.focus();
        }
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
        selectUser,
        selectChat,
        applyFormat,
        updateMessage,
        sendMessage,
        scrollToBottom,
      };
    },
    methods: {
      handleButtonClick() {
        
      },
      sanitizeHtml(htmlContent: string) {
        return DOMPurify.sanitize(htmlContent);
      },
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
  @import url(./styles/chat.scss);
</style>
