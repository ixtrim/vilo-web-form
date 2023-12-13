<template>
  <div class="vilo-user">
    <div class="vilo-user__avatar" v-if="userAvatar">
      <img :src="userAvatar" :alt="userAltText" />
    </div>

    <div class="vilo-user__info" v-if="userName || userEmail">
      <span class="vilo-user__info__name" v-if="userName">{{ userName }}</span>
      <span class="vilo-user__info__email" v-if="userEmail">{{ userEmail }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'VUser',
    props: {
      userAvatar: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/users%2Favatar.png?alt=media&token=47406968-8bed-4e90-807e-af163bb9e8be'
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
  @import url(./v-user.scss);
</style>