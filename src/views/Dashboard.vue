<template>
  <div class="container-fluid ">

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading mb-0">
          <h1>Dashboard</h1>
          <p>Your current working summary and activity.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row" v-if="!isGeneral">
      <div class="col-lg-7">
        <TotalIncome />
      </div>
      <div class="col-lg-5">
        <RecentInvoices />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <PendingDocuments />
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <MyTasks />
      </div>
      <div class="col-lg-6">

        <div class="row">
          <div class="col-lg-12">
            <UpcomingMeetings />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 dashboard__separator">
            &nbsp;
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <UnreadMessages />
          </div>
        </div>

      </div>
    </div>

    

  </div>
</template>

<style>
@import url(./styles/dashboard.scss);
</style>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import TotalIncome from '@/modules/Home/TotalIncome/TotalIncome.vue';
import RecentInvoices from '@/modules/Home/RecentInvoices/RecentInvoices.vue';
import PendingDocuments from '@/modules/Home/PendingDocuments/PendingDocuments.vue';
import MyTasks from '@/modules/Home/MyTasks/MyTasks.vue';
import UpcomingMeetings from '@/modules/Home/UpcomingMeetings/UpcomingMeetings.vue';
import UnreadMessages from '@/modules/Home/UnreadMessages/UnreadMessages.vue';

export default defineComponent({
  components: {
    TotalIncome,
    RecentInvoices,
    PendingDocuments,
    MyTasks,
    UpcomingMeetings,
    UnreadMessages,
  },
  setup() {
    const { user } = useUserStore();

    const isGeneral = computed(() => user.value?.role === 1);

    return {
      isGeneral,
    };
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>