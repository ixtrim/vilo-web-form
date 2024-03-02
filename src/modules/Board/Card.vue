<template>
  <div :class="'card priority--' + card.priority">
    <div class="card__task-name">
      <h5>{{ card.title }}</h5>
      <p>{{ card.description }}</p>
    </div>
    <div class="card__meta">
      <ul>
        <li class="card__meta__due">
          <span>Due {{ card.due_date }}</span>
        </li>
        <li class="card__meta__user">
          <img :src="userAvatar" alt="User avatar" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.js'; // Adjust this import path to where your Firebase configuration and initialization are located

export default defineComponent({
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const userAvatar = ref(''); // Initialize with an empty string or a default avatar URL

    // Asynchronously fetch the user's avatar when the component mounts
    onMounted(async () => {
      if (props.card.user_assigned) {
        try {
          const userRef = doc(db, "users", props.card.user_assigned);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            userAvatar.value = userData.avatar; // Assuming 'avatar' is the field name in your user documents
          } else {
            console.error("User document does not exist!");
            // Set userAvatar.value to a default avatar URL if needed
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          // Optionally set userAvatar.value to a default avatar URL in case of error
        }
      }
    });

    return { userAvatar };
  }
});
</script>
