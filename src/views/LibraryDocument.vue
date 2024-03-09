<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading mb-0">

          <div class="row">
            <div class="col-lg-12 mt-5">
              Here VInput with title of document
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mt-5">
              Here information abou last update of this document (if available)
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mt-5">
              Here VImage Upload to heder field
            </div>
          </div>
          
          <div class="row">
            <div class="col-lg-12 mt-5">
              In editor is code from 'content' field
              <QuillEditor theme="snow" />
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mt-5">
              Here VImage Upload to footer field
            </div>
          </div>


        </div>
      </div>
      <div class="col-lg-3 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Create new document"></VButton>
      </div>
    </div>

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
