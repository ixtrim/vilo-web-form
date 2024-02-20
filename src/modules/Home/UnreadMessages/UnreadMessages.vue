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
        
        <ul class="unread-messages__list" style="display: none;">
          <li class="unread-messages__list__item">

            <div class="unread-messages__list__item__avatar">
              <img class="rounded-circle mr-2" src="https://randomuser.me/api/portraits/men/79.jpg" alt="Person"/>
              <div class="unread-messages__list__item__avatar__status"></div>
            </div>

            <div class="unread-messages__list__item__content">
              <div class="unread-messages__list__item__content__top">
                <h5 class="mb-1">Phoenix Baker</h5>
                <small>2hr ago</small>
              </div>
              <div class="unread-messages__list__item__content__bottom">
                <p>Hey Olivia, can you please review the latest document when you can?</p>
              </div>
            </div>

          </li>
          <li class="unread-messages__list__item">

            <div class="unread-messages__list__item__avatar">
              <img class="rounded-circle mr-2" src="https://randomuser.me/api/portraits/women/79.jpg" alt="Person"/>
              <div class="unread-messages__list__item__avatar__status"></div>
            </div>

            <div class="unread-messages__list__item__content">
              <div class="unread-messages__list__item__content__top">
                <h5 class="mb-1">Rosalee Melvin</h5>
                <small>2hr ago</small>
              </div>
              <div class="unread-messages__list__item__content__bottom">
                <p>Hey Olivia, I've finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over.</p>
              </div>
            </div>

          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';


export default defineComponent({
  components: {
    VLink,
  },
});
</script>

<style>
  @import url(./UnreadMessages.scss);
</style>