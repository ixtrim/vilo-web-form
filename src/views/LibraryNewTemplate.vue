<template>
  <div class="container-fluid library-document-template">

    <div class="row">
      <div class="col-lg-12">
        <VBreadcrumbs :breadcrumbItems="breadcrumbs" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__line mt-0">
        <hr />
      </div>
    </div>

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
              <div class="form-group">
                <label>Header image:</label>
                <br v-if="header != ''"/>
                <img :src="header" v-if="header != ''" style="margin-bottom:20px" />
                <VImageUploaderNoCropped v-model="header" @image-selected="HeaderHandler"/>
              </div>
            </div>
          </div>
          
          <div class="row mb-2 editors">
            <div class="col-lg-12 relative" v-for="(item, index) in editorCount">
              <QuillEditor v-if="!hiddenEditors[index]" toolbar="essential" theme="snow" :ref="el => { quill[index] = el }" @change="updateContent" contentType="html" />
              <div class="page_delete" v-if="!hiddenEditors[index]">
                <v-button v-if="!hiddenEditors[index]" :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="toggleEditor(index)" text=""></v-button>
              </div>
            </div>
          </div>

          <div class="row mb-5 add-new-page">
            <VButton :block="true" size="sm" icon="left" icon-style="add-blue" styled="secondary" @click="addPage" text="Add another page"></VButton>
          </div>

          <div class="row">
            <div class="col-lg-12 mb-4 mt-2">
              <div class="form-group">
                <label>Document footer image</label>
                <br v-if="footer != ''"/>
                <img :src="footer" v-if="footer != ''" width="100" style="margin-bottom:20px" />
                <VImageUploaderNoCropped v-model="footer" @image-selected="FooterHandler"/>
              </div>
            </div>
          </div>


        </div>
      </div>
      <div class="col-lg-3 align-right meta-column">
        <div class="meta-column__fixed">
          <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Create new document"></VButton>
        </div>
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
  import { useRouter } from 'vue-router';
  import { QuillEditor } from '@vueup/vue-quill';
  import VLink from '@/components/v-link/VLink.vue';
  import VImageUploader from '@/components/v-image-uploader/VImageUploader.vue'
  import VImageUploaderNoCropped from '@/components/v-image-uploader-no-cropped/VImageUploaderNoCropped.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VBreadcrumbs from '@/components/v-breadcrumbs/VBreadcrumbs.vue';

  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  export default {
    components: {
      VInput,
      VImageUploaderNoCropped,
      QuillEditor,
      VButton,
      VNotification,
      VBreadcrumbs,
    },
    setup() {
      const router = useRouter();
      const title = ref('');
      const header = ref('');
      const footer = ref('');
      const content = ref([]);
      const notificationRef = ref(null);
      const notificationType = ref('');
      const notificationHeader = ref('');
      const notificationMessage = ref('');
      const editorCount = ref(1);
      const quill = ref([]);
      const quillContent = ref([]);
      const auth = getAuth();
      const hiddenEditors = ref([]);

      const breadcrumbs = computed(() => [
        { text: 'Library Templates', to: '/library-templates' },
        { text: 'New template' || 'Loading case...' }
      ]);

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

      const FooterHandler = async (dataUrl) =>{
        
        const base64String = dataUrl.split(',')[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        let loc = `files/document_footers/${Math.random().toString(22).slice(2)}.jpg`;
        const imageRef = storageRef(storage, loc);
        await uploadBytes(imageRef, blob);
        footer.value = await getDownloadURL(imageRef);
      }

      const HeaderHandler = async (dataUrl) =>{

        const base64String = dataUrl.split(',')[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        let loc = `files/document_headers/${Math.random().toString(22).slice(2)}.jpg`;
        const imageRef = storageRef(storage, loc);
        await uploadBytes(imageRef, blob);
        header.value = await getDownloadURL(imageRef);
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

        let quillContentArray = [];

        for(let i=0;i<quill.value.length;i++)
        {
          if(quill.value[i])
          {
            quillContentArray.push(quill.value[i].getHTML())
          }
        }

        const createdAt = Timestamp.now(); 
        const user = auth.currentUser;
        if(user)
        {
          var userId = user.uid;
        }
        try {
          await addDoc(collection(db, "templates"), {
            title: title.value,
            content: quillContentArray,
            header: header.value,
            footer: footer.value,
            created_by: userId,
            created: createdAt
          });

          let message = 'Template created successfully!';
          router.push({ path: '/library-templates', query: { message } });

        } catch (error) {
          console.log("Error getting document:", error);
          triggerNotification('error', 'Error!', 'Error while connecting with database.');
        }

      };

      const addPage = () => {
        editorCount.value++;
      }

      const removeElementsWithoutContainer = () => {
        const elements = document.querySelectorAll('.row.editors .col-lg-12');
        elements.forEach(element => {
          if (!element.querySelector('.ql-container') || !element.innerHTML.trim() || element.childElementCount === 0 || element.innerHTML === '' || element.innerHTML === '<!--v-if--><!--v-if-->' || !element.hasChildNodes()) {
            element.remove();
          }
        });
      };

      const toggleEditor = (index) => {
        quill.value = quill.value.splice(index, 1);
        hiddenEditors.value[index] = !hiddenEditors.value[index];
        setTimeout(() => {
          removeElementsWithoutContainer();
        }, 500);
        
      };

      return {
        title,
        header,
        footer,
        content,
        handleImageCropped,
        handleFooterImageCropped,
        FooterHandler,
        HeaderHandler,
        notificationRef,
        addDocument,
        addPage,
        quill,
        editorCount,
        toggleEditor,
        hiddenEditors,
        breadcrumbs,
      };
    },
    methods: {
      updateContent(value){
        console.log(value)
      }
    }
  }
</script>

<style>
  @import url(./styles/dashboard.scss);
  .relative{
    position: relative;
  }
  .quitBtn{
    position: absolute;
    right: -30px;
    top: 0;
  }
  .space-20{
    margin-bottom: 4  0px;
  }
</style>
