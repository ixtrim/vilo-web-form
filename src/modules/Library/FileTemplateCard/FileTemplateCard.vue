<template>
  <div class="v-template-card">

    <div class="v-template-card__top">
      <div :class="['v-template-card__top__icon', `v-template-card__top__icon--${icon}`]">
        &nbsp;
      </div>
      <div class="v-template-card__top__info">
        <h3 class="v-template-card__top__info__title">{{ title }}</h3>
        <p class="v-template-card__top__info__created">Created {{ createdDate }}</p>
        <p class="v-template-card__top__info__owner">by <strong>{{ creatorName }}</strong></p>
      </div>
      <div class="v-template-card__top__settings">
        <VButton :block="false" size="sm" icon="left" icon-style="settings-dots" styled="simple-icon" @click="toggleDropdown" ></VButton>
        <div class="dropdown-menu px-2 py-2" v-if="showDropdown">
          <ul class="dropdown-inline-list">
            <li v-if="isAdmin">
              <VButton :block="false" size="md" icon="left" icon-style="delete" styled="link-gray" @click="deleteTemplate" text="Delete"></VButton>
            </li>
            <li>
              <VButton :block="false" size="md" icon="left" icon-style="edit--3" styled="link-gray" @click="editTemplate" text="Edit"></VButton>
            </li>
            <li>
              <VButton :block="false" size="md" icon="left" icon-style="duplicate" styled="link-gray" @click="duplicateTemplate" text="Duplicate"></VButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <ul class="v-template-card__actions">
      <li>
        <VButton :block="false" size="md" icon="left" icon-style="preview" styled="outlined" @click="preview" text="Preview"></VButton>
      </li>
      <li>
        <VButton :block="false" size="md" icon="left" icon-style="add-blue" styled="secondary" @click="createNewDocument" text="New Document"></VButton>
      </li>
    </ul>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VButton from '@/components/v-button/VButton.vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
  components: {
    VButton
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    iconRight: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    createdDate: {
      type: String,
      required: true
    },
    creatorName: {
      type: String,
      required: true
    }
  },
  setup() {
    const showDropdown = ref(false);

    const { user } = useUserStore();
    const isAdmin = computed(() => user.value?.role === 0);

    const toggleDropdown = () => {
      console.log('Dropdown toggled');
      showDropdown.value = !showDropdown.value;
      console.log(showDropdown.value)
    };

    return {
      showDropdown,
      toggleDropdown,
      isAdmin,
    };
  },
  methods: {
    deleteTemplate() {
      this.$emit('delete-template');
    },
    editTemplate() {
      this.$emit('edit-template');
    },
    duplicateTemplate() {
      this.$emit('duplicate-template');
    },
    preview() {
      this.$emit('preview');
    },
    createNewDocument() {
      this.$emit('create-new-document');
    }
  }
});
</script>

<style>
  @import url(./FileTemplateCard.scss);
</style>