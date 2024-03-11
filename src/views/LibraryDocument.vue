<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading mb-0">

          <div class="row">
            <div class="col-lg-12 ">
              <VInput label="Title" placeholder="Title here" v-model="title" />
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mb-4">
              <label style="font-weight: 500;margin-bottom: 6px;">Header</label>
              <VImageUploader @image-cropped="handleImageCropped" />
            </div>
          </div>
          
          <div class="row">
            <div class="col-lg-12 mb-5">
              <QuillEditor theme="snow" v-model:content="content" contentType="html" />
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mb-4 mt-2">
              <label style="font-weight: 500;margin-bottom: 6px;">Footer</label>
              <VImageUploader v-model="footer"/>
            </div>
          </div>


        </div>
      </div>
      <div class="col-lg-3 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Create new document"></VButton>
      </div>
    </div>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script>
import { db, storage } from '@/firebase.js';
import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { onMounted, ref, defineComponent, computed } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import VLink from '@/components/v-link/VLink.vue';
import VImageUploader from '@/components/v-image-uploader/VImageUploader.vue';
import VInput from '@/components/v-input/VInput.vue';
import VButton from '@/components/v-button/VButton.vue';
import VNotification from '@/components/v-notification/VNotification.vue';

import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    VInput,
    VImageUploader,
    QuillEditor,
    VButton,
    VNotification
  },
  setup() {
    const title = ref('');
    const header = ref('');
    const footer = ref('');
    const content = ref('');
    const notificationRef = ref(null);
    const notificationType = ref('');
    const notificationHeader = ref('');
    const notificationMessage = ref('');
    const auth = getAuth();

    async function handleImageCropped(blob) {
      const imageRef = storageRef(storage, `document_headers/${Math.random().toString(22).slice(2)}.jpg`);
      await uploadBytes(imageRef, blob);
      header.value = await getDownloadURL(imageRef);
    }

    async function handleFooterImageCropped(blob) {
      const imageRef = storageRef(storage, `document_footers/${Math.random().toString(22).slice(2)}.jpg`);
      await uploadBytes(imageRef, blob);
      footer.value = await getDownloadURL(imageRef);
    }

    const triggerNotification = (type, header, message) => {
    
        notificationType.value = type;
        notificationHeader.value = header;
        notificationMessage.value = message;

        if (notificationRef.value !== null) {
          notificationRef.value.showNotification();
        } else {
          console.error('Notification reference is null.');
        }
    }

    const addDocument = async() => {
      const createdAt = Timestamp.now(); 
      const user = auth.currentUser;
      if(user)
      {
        var userId = user.uid;
      }
      try {
        await addDoc(collection(db, "templates"), {
          title: title.value,
          content: content.value,
          header: header.value,
          footer: footer.value,
          created_by: userId,
          created: createdAt
        });

        title.value = '';
        title.content = '';
        title.header = '';
        title.footer = '';
        triggerNotification('success', 'Success!', 'Template created successfully!');
      } catch (error) {
        console.log("Error getting document:", error);
        triggerNotification('error', 'Error!', 'Error while connecting with database.');
      }

    };

    return {
      title,
      header,
      footer,
      content,
      handleImageCropped,
      handleFooterImageCropped,
      notificationRef,
      addDocument,
    };
  }

}
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
