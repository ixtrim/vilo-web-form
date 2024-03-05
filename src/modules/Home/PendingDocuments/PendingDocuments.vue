<template>
  <div class="pending-documents">
    <div class="row">
      <div class="col-lg-8">
        <h3>Pending documents</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/library" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__table">

          <div class="dashboard__table__head">
            <div class="col col--l-document">
              <h4>Document name</h4>
            </div>
            <div class="col col--l-status">
              <h4>Status</h4>
            </div>
            <div class="col col--l-uploaded"> 
              <h4>Date uploaded</h4>
            </div>
            <div class="col col--l-updated">
              <h4>Last updated</h4>
            </div>
            <div class="col col--l-created">
              <h4>Created by</h4>
            </div>
            <div class="col col--l-sign">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">

            <div v-for="file in files" :key="file.id" class="dashboard__table__page__item">
              <div class="col col--l-document">
                <VFile :file-extension="file.extension" :file-name="file.document_name" :file-size="file.size" />
              </div>
              <div class="col col--l-status">
                <VBadge variant="warning">Pending</VBadge>
              </div>
              <div class="col col--l-uploaded">
                <p>{{ file.date_uploaded }}</p>
              </div>
              <div class="col col--l-updated">
                <p>{{ file.last_updated }}</p>
              </div>
              <div class="col col--l-created">
                <VUser :userName="file.createdByDetails.name" :userEmail="truncateEmail(file.createdByDetails.email)" :userAvatar="file.createdByDetails.avatar" />
              </div>
              <div class="col col--l-sign">
                <VButton :block="false" size="md" styled="primary" @click="" text="Sign"></VButton>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { db } from '@/firebase.js';
import { doc, getDoc, query, collection, orderBy, limit, getDocs, where } from 'firebase/firestore';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VUser from '@/components/v-user/v-user.vue';
import VButton from '@/components/v-button/VButton.vue';
import VFile from '@/components/v-file/VFile.vue';

interface File {
  id: string;
  document_name: string;
  extension: string;
  size: string;
  date_uploaded: string;
  last_updated: string;
  createdBy: string;
  createdByDetails: { // Add a new property to hold user details
    name: string;
    email: string;
    avatar: string;
  };
  status: number;
}

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VUser,
    VButton,
    VFile,
  },
  setup() {
    const files = ref<File[]>([]);

    const truncateEmail = (email: string) => {
      return email.length > 25 ? `${email.substring(0, 22)}...` : email;
    };

    const fetchFiles = async () => {
      const filesQuery = query(collection(db, "files"), where("status", "==", 1), limit(8));
      const querySnapshot = await getDocs(filesQuery);
      const filesWithUserDetails = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const fileData = docSnapshot.data();
        const userDocRef = doc(db, "users", fileData.created_by);
        const userDocSnap = await getDoc(userDocRef);
        let createdByDetails = {
          name: "Unknown User",
          email: "No Email",
          avatar: "Default Avatar URL"
        };
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          createdByDetails = {
            name: userData.full_name || "Unknown User",
            email: userData.email || "No Email",
            avatar: userData.avatar || "Default Avatar URL"
          };
        }
        return {
          id: docSnapshot.id,
          document_name: fileData.document_name,
          extension: fileData.extension,
          size: "2MB", // Adjust as needed
          date_uploaded: fileData.date_uploaded.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          last_updated: fileData.last_updated.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          createdBy: fileData.created_by,
          createdByDetails, // Add user details to the file object
          status: fileData.status,
        };
      }));

      files.value = filesWithUserDetails;
    };

    onMounted(fetchFiles);

    return {
      files,
      truncateEmail,
    };
  },
});
</script>


<style>
  @import url(./PendingDocuments.scss);
</style>