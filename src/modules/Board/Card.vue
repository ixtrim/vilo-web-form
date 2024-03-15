<template>
  <div :data-task-id="card.id" :class="'card priority--' + card.priority">

    <div class="card__actions">
      <ul>
        <li>
          <VButton :block="false" size="sm" icon="left" icon-style="drag" styled="simple-icon move-task" text=""></VButton>
        </li>
        <li>
          <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" text="" @click="emitEditTaskEvent"></VButton>
        </li>
        <li>
          <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" text="" @click="emitPreviewTaskEvent"></VButton>
        </li>
      </ul>
    </div>

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
import { db } from '@/firebase.js';
import VButton from '@/components/v-button/VButton.vue';

export default defineComponent({
  components: {
    VButton,
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const userAvatar = ref('');

    // Asynchronously fetch the user's avatar when the component mounts
    onMounted(async () => {
      if (props.card.user_assigned) {
        try {
          const userRef = doc(db, "users", props.card.user_assigned);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            userAvatar.value = userData.avatar;
          } else {
            console.error("User document does not exist!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      }
    });

    return { userAvatar };
  },
  methods: {
    emitEditTaskEvent() {
      this.$emit('editTask', this.card.id);
    },
    emitPreviewTaskEvent() {
      this.$emit('previewTask', this.card.id);
    }
  }
});
</script>
