<template>
  <div class="vilo-user-small">
    <div class="vilo-user-small__avatar" v-if="userAvatar">
      <img :src="userAvatar" :alt="userAltText" />
    </div>

    <div class="vilo-user-small__info" v-if="userName || userEmail">
      <span class="vilo-user-small__info__name" v-if="userName">{{ userName }}</span>
      <span class="vilo-user-small__info__email" v-if="userEmail">{{ userEmail }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'VUserSmall',
    props: {
      userAvatar: {
        type: String,
        default: function() {
          return `https://picsum.photos/40?random=${Date.now()}`;
        }
      },
      userName: {
        type: String,
        default: ''
      },
      userEmail: {
        type: String,
        default: ''
      },
      userAltText: {
        type: String,
        default: 'User avatar'
      }
    },
    computed: {
      randomAvatar() {
        return `https://picsum.photos/40?random=${Date.now()}`;
      }
    }
  });
</script>

<style>
  @import url(./v-user-small.scss);
</style>