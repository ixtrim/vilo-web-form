<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Library</h1>
          <p> Create and manage your team documents and templates.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Add new document"></VButton>
      </div>
    </div>

    <QuillEditor theme="snow" />
  </div>
</template>

<script>
import { onMounted, ref, defineComponent, computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search   from '@/modules/Navigation/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
import TabsLibrary from '@/modules/TabsLibrary.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import FileTemplateCard from '@/modules/Library/FileTemplateCard/FileTemplateCard.vue';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
