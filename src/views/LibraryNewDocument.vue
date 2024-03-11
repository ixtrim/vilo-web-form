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
              <br v-if="header != ''"/>
              <img :src="header" v-if="header != ''" width="70" style="margin-bottom:20px"/>
              <VImageUploaderNoCropped v-model="header" @image-selected="HeaderHandler"/>
            </div>
          </div>
          
          <div class="row mb-5">
            <div class="col-lg-12 relative" v-for="(item, index) in editorCount">
              <QuillEditor v-if="!hiddenEditors[index]" toolbar="essential" theme="snow" :ref="el => { quill[index] = el }" @change="updateContent" contentType="html" />
              <button class="quitBtn" v-if="!hiddenEditors[index] && index != 0" @click="toggleEditor(index)">X</button>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mb-4 mt-2">
              <label style="font-weight: 500;margin-bottom: 6px;">Footer</label>
              <br v-if="footer != ''"/>
              <img :src="footer" v-if="footer != ''" width="70" style="margin-bottom:20px"/>
              <VImageUploaderNoCropped v-model="footer" @image-selected="FooterHandler"/>
            </div>
          </div>


        </div>
      </div>
      <div class="col-lg-3 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Create new document"></VButton>
        <br/>
        <VButton :block="true" size="sm" icon="left" icon-style="add-blue" styled="secondary" @click="addPage" text="Add another page"></VButton>
      </div>
    </div>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script>
  import { db, storage } from '@/firebase.js';
  import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
  import { collection, doc, getDoc, addDoc, Timestamp } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { onMounted, ref, defineComponent, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { QuillEditor } from '@vueup/vue-quill';
  import VLink from '@/components/v-link/VLink.vue';
  import VImageUploader from '@/components/v-image-uploader/VImageUploader.vue'
  import VImageUploaderNoCropped from '@/components/v-image-uploader-no-cropped/VImageUploaderNoCropped.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  export default {
    components: {
      VInput,
      VImageUploader,
      VImageUploaderNoCropped,
      QuillEditor,
      VButton,
      VNotification,
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
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

      const fetchTemplate = async() => {
        const id = route.params.id;
        try {
          // Get the template with the specified ID
          const docRef = doc(db, "templates", id);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
              // Document exists, you can access its data using docSnapshot.data()
              const templateData = docSnapshot.data();
              console.log(templateData);
              
              title.value = templateData.title;
              header.value = templateData.header;
              footer.value = templateData.footer;
              let contents = templateData.content;
              let contentsLength = contents.length;
              editorCount.value = contentsLength;

              contents.forEach((_, index) => {
                quill.value.push(null); // Push null for each content item
              });

              setTimeout(() => {
                for(let i=0; i < contents.length; i++)
                {
                  quill.value[i].setHTML(contents[i]);
                }
              }, 1000)
              
              
              let timestamp = templateData.created.toDate().toLocaleString();
              let createdDate = new Date(timestamp);
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              let month = months[createdDate.getMonth()];
              let day = createdDate.getDate();
              let year = createdDate.getFullYear();
              created.value = `${month} ${day}, ${year}`;

          } else {
              console.log("Document not found!");
          }
        } catch (error) {
            console.error("Error fetching document:", error);
        } 
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
          await addDoc(collection(db, "files"), {
            document_name: title.value,
            content: quillContentArray,
            header: header.value,
            footer: footer.value,
            created_by: userId,
            created: createdAt,
            last_updated: createdAt,
            date_uploaded: createdAt,
            status: 1
          });

          let message = 'Document created successfully!';
          router.push({ path: '/library', query: { message } });

        } catch (error) {
          console.log("Error getting document:", error);
          triggerNotification('error', 'Error!', 'Error while connecting with database.');
        }

      };

      const addPage = () => {
        editorCount.value++;
      }

      const toggleEditor = (index) => {
        quill.value = quill.value.splice(index, 1);
        hiddenEditors.value[index] = !hiddenEditors.value[index];
      };

      onMounted(fetchTemplate)

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
