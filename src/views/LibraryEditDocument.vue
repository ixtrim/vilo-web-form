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
              <VInput label="Document title" placeholder="Title here" v-model="title" />
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
              <div class="page_delete" v-if="!hiddenEditors[index] && index != 0">
                <v-button v-if="!hiddenEditors[index] && index != 0" :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="toggleEditor(index)" text=""></v-button>
              </div>
            </div>
          </div>

          <div class="row mb-5 add-new-page">
            <VButton :block="true" size="sm" icon="left" icon-style="add-blue" styled="secondary" @click="addPage" text="Add another page"></VButton>
          </div>

          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group">
                  <label>Signature</label>
                  <br v-if="client_signature != ''"/>
                  <img :src="client_signature" v-if="client_signature != ''" width="100" style="margin-bottom:20px" />
                  <VImageUploaderNoCropped v-model="client_signature" @image-selected="ClientSignatureHandler"/>
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <VInput label="Full name:" placeholder="ex. William Jackson" v-model="client_name" />
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <VInput label="Title" placeholder="ex. CTO" v-model="client_title" />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group">
                  <label>Signature</label>
                  <br v-if="consultant_signature != ''"/>
                  <img :src="consultant_signature" v-if="consultant_signature != ''" width="100" style="margin-bottom:20px" />
                  <VImageUploaderNoCropped v-model="consultant_signature" @image-selected="ConsultantSignatureHandler"/>
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <VInput label="Full name:" placeholder="ex. William Jackson" v-model="consultant_name" />
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <VInput label="Title" placeholder="ex. CTO" v-model="consultant_title" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12 mb-4 mt-5">
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
          <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="secondary" @click="saveFileChanges" text="Save Changes"></VButton>

          <p class="meta-column__fixed__created"><strong>Created:</strong> <em>{{  created }}</em>, by <span>{{ created_by }}</span></p>

          <VButton v-if="client_name != '' && client_title != '' && client_signature != '' && consultant_name != '' && consultant_title != '' && consultant_signature != ''" :block="true" size="md" styled="primary" @click="signDocument" text="Sign document"></VButton>
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
  import { collection, addDoc, Timestamp, doc, getDoc,updateDoc } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  import { onMounted, ref, defineComponent, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { QuillEditor } from '@vueup/vue-quill';
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
      const route = useRoute();
      const title = ref('');
      const header = ref('');
      const footer = ref('');
      const content = ref([]);
      const created = ref(null);
      const created_by = ref(null);
      const client_name = ref('');
      const client_title = ref('');
      const client_signature = ref('');
      const consultant_name = ref('');
      const consultant_title = ref('');
      const consultant_signature = ref('');
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
        { text: 'Library', to: '/library' },
        { text: 'Edit document' || 'Loading case...' }
      ]);

      const ConsultantSignatureHandler = async (dataUrl) =>{
        
        const base64String = dataUrl.split(',')[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        let loc = `files/consultants_signatures/${Math.random().toString(22).slice(2)}.jpg`;
        const imageRef = storageRef(storage, loc);
        await uploadBytes(imageRef, blob);
        consultant_signature.value = await getDownloadURL(imageRef);
      }

      const ClientSignatureHandler = async (dataUrl) =>{
        
        const base64String = dataUrl.split(',')[1];
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        let loc = `files/clients_signatures/${Math.random().toString(22).slice(2)}.jpg`;
        const imageRef = storageRef(storage, loc);
        await uploadBytes(imageRef, blob);
        client_signature.value = await getDownloadURL(imageRef);
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

      const saveFileChanges = async() => {

        let quillContentArray = [];
        const id = route.params.id;

        for(let i=0;i<quill.value.length;i++)
        {
          if(quill.value[i])
          {
            quillContentArray.push(quill.value[i].getHTML())
          }
        }

        const createdAt = Timestamp.now(); 

        try {
          const docRef = doc(db, "files", id);

          await updateDoc(docRef, {
            document_name: title.value,
            content: quillContentArray,
            header: header.value,
            footer: footer.value,
            client_name: client_name.value,
            client_title: client_title.value,
            client_signature: client_signature.value,
            consultant_name: consultant_name.value,
            consultant_title: consultant_title.value,
            consultant_signature: consultant_signature.value,
            last_updated: createdAt,
          });

          let message = 'Document updated successfully!';
          router.push({ path: '/library', query: { message } });

        } catch (error) {
          console.log("Error getting document:", error);
          triggerNotification('error', 'Error!', 'Error while connecting with database.');
        }

      };

      const signDocument = async() => {

        let quillContentArray = [];
        const id = route.params.id;

        for(let i=0;i<quill.value.length;i++)
        {
          if(quill.value[i])
          {
            quillContentArray.push(quill.value[i].getHTML())
          }
        }

        const createdAt = Timestamp.now(); 

        try {
          const docRef = doc(db, "files", id);

          await updateDoc(docRef, {
            document_name: title.value,
            status: 2,
            content: quillContentArray,
            header: header.value,
            footer: footer.value,
            client_name: client_name.value,
            client_title: client_title.value,
            client_signature: client_signature.value,
            consultant_name: consultant_name.value,
            consultant_title: consultant_title.value,
            consultant_signature: consultant_signature.value,
            last_updated: createdAt,
          });

          let message = 'Document signed successfully!';
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

      const fetchTemplate = async() => {
        const id = route.params.id;

        try {
          // Get the template with the specified ID
          const docRef = doc(db, "files", id);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
              // Document exists, you can access its data using docSnapshot.data()
              const templateData = docSnapshot.data();
              
              title.value = templateData.document_name;
              client_name.value = templateData.client_name;
              client_title.value = templateData.client_title;
              client_signature.value = templateData.client_signature;
              consultant_name.value = templateData.consultant_name;
              consultant_signature.value = templateData.consultant_signature;
              consultant_title.value = templateData.consultant_title;
              header.value = templateData.header;
              footer.value = templateData.footer;

              if(templateData.created_by)
              {
                const userDocRef = doc(db, "users", templateData.created_by);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                  const userData = userDocSnap.data();
                  created_by.value = userData.full_name;
                  console.log(created_by.value)
                  
                }
              }

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

      onMounted(fetchTemplate)

      return {
        title,
        header,
        footer,
        content,
        client_name,
        client_title,
        client_signature,
        consultant_name,
        consultant_title,
        consultant_signature,
        created,
        created_by,
        FooterHandler,
        HeaderHandler,
        ClientSignatureHandler,
        ConsultantSignatureHandler,
        notificationRef,
        saveFileChanges,
        signDocument,
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
    position: relative;
    right: -30px;
    top: 0;
  }
  .space-20{
    margin-bottom: 4  0px;
  }
</style>
