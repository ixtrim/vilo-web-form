<template>
  <div class="unread-messages">
    <div class="row">
      <div class="col-lg-8">
        <h3>Unread Messages</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/chat" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 align-center">
        <ul v-if="unreadChats.length > 0" class="unread-messages__list">
          <li v-for="chat in unreadChats" :key="chat.id" class="unread-messages__list__item">
            <div class="unread-messages__list__item__avatar">
              <img class="rounded-circle mr-2" :src="chat.userAvatar" alt="Person"/>
              <span class="unread-messages__list__item__avatar__status" style="display: none;"></span>
            </div>
            <div class="unread-messages__list__item__content">
              <div class="unread-messages__list__item__content__top">
                <h5 class="mb-1">{{ chat.full_name }}</h5>
                <small>{{ chat.timeAgo }}</small>
              </div>
              <div class="unread-messages__list__item__content__bottom">
                <p v-html="sanitizeHtml(truncateText(chat.lastMessage))"></p>
              </div>
            </div>
          </li>
        </ul>
        <p v-else>You have no unread messages.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import VLink from '@/components/v-link/VLink.vue';
import DOMPurify from 'dompurify';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '@/firebase';

interface Chat {
  id: string;
  userAvatar: string;
  full_name: string;
  lastMessage: string;
  timeAgo: string;
  lastMessageTimestamp: Date;
  participants: string[];
  viewed_status: Record<string, boolean>;
}

export default defineComponent({
  components: {
    VLink,
  },
  setup() {
    const currentUserId = ref('');
    const unreadChats = ref<Chat[]>([]);

    onMounted(async () => {
      if (auth.currentUser) {
        currentUserId.value = auth.currentUser.uid;
        await fetchUnreadChats();
      }
    });

    async function fetchUnreadChats() {
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

        // Check if the chat has been viewed by the current user
        const isUnread = chatData.viewed_status && chatData.viewed_status[currentUserId.value] === false;

        if (isUnread) {
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
      }

      // Sort chats by lastMessageTimestamp from newest to oldest
      fetchedChats = fetchedChats.sort((a, b) => Number(b.lastMessageTimestamp) - Number(a.lastMessageTimestamp));
      unreadChats.value = fetchedChats;
    }

    function sanitizeHtml(htmlContent: string) {
      return DOMPurify.sanitize(htmlContent);
    }

    function truncateText(text: string, maxLength = 100) {
      const strippedText = text.replace(/<[^>]*>?/gm, '');
      if (strippedText.length <= maxLength) return strippedText;
      let trimmedText = strippedText.substr(0, maxLength);
      trimmedText = trimmedText.substr(0, Math.min(trimmedText.length, trimmedText.lastIndexOf(" ")));
      return `${trimmedText}...`;
    }

    return {
      unreadChats,
      sanitizeHtml,
      truncateText,
    };
  },
});
</script>

<style>
@import url(./UnreadMessages.scss);
</style>
