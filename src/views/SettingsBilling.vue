<template>
  <div class="container-fluid">
    
    <div class="row">
      <div class="col-lg-12">
        <TabsSettings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading">
          <h1>Billing</h1>
          <p>Update your billing details and address.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Account Details</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="Account number" 
                placeholder="12-1234-123456-12" 
                v-model="accountNumber"
              />
              <VInput 
                label="Bank Name" 
                placeholder="ABC Bank limited" 
                v-model="bankName"
              />
              <VInput 
                label="SWIFT/IBAN" 
                placeholder="NZ0201230012" 
                v-model="swiftIban"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Email address</h4>
              <p>Invoices will be sent to this email address.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VEmailInputGroup :inputs="emails" @update:emails="updateEmailAddresses" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Street address</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="100 Smith Street" 
                v-model="streetAddress"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>City</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="Collingwood" 
                v-model="city"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>State / Province</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--cols">
              <VInput 
                label="" 
                placeholder="VIC" 
                v-model="state"
              />
              <VInput 
                label="" 
                placeholder="3066" 
                v-model="province"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Country</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VCountryDropdown :selectedCountryCode="selectedCountryCode" @country-selected="handleCountrySelected" />
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template> 

<script lang="ts">
  import { db } from '@/firebase.js';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { debounce } from 'lodash';
  import { defineComponent, ref, onMounted } from 'vue';
  import VCountryDropdown from '@/components/v-country-dropdown/VCountryDropdown.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VEmailInputGroup from '@/components/v-email-input-group/VEmailInputGroup.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface NotificationRef {
    showNotification: () => void;
  }

  export default defineComponent({
    components: {
      VButton,
      VInput,
      VCountryDropdown,
      TabsSettings,
      VEmailInputGroup,
      VNotification,
    },
    data() {
      return {
        initialDataLoaded: false,
        notificationType: 'success',
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
        accountNumber: '',
        bankName: '',
        swiftIban: '',
        emails: [],
        streetAddress: '',
        city: '',
        state: '',
        province: '',
        selectedCountryCode: '',
        debouncedUpdateAccountNumber: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateBankName: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateSwiftIban: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateStreetAddress: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateCity: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateState: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateProvince: null as ((...args: any[]) => Promise<void> | undefined) | null,
      };
    },
    methods: {
      triggerNotification(type: string, header: string, message: string) {
        if (this.initialDataLoaded) {
          this.notificationType = type;
          this.notificationHeader = header;
          this.notificationMessage = message;
          (this.$refs.notificationRef as NotificationRef).showNotification();
        }
      },
      async fetchViewData() {
        try {
          const docRef = doc(db, "settings", "billing");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            this.accountNumber = docSnap.data().account_number;
            this.bankName      = docSnap.data().bank_name;
            this.swiftIban     = docSnap.data().swift_iban;
            this.emails        = docSnap.data().email_addresses || [];
            this.streetAddress = docSnap.data().street_address;
            this.city          = docSnap.data().city;
            this.state               = docSnap.data().state;
            this.province            = docSnap.data().province;
            this.selectedCountryCode = docSnap.data().country;
            
          } else {
            console.log("No such document!");
            this.triggerNotification('error', 'Error!', 'Error while connecting with database.');
          }
        } catch (error) {
          console.log("Error getting document:", error);
          this.triggerNotification('error', 'Error!', 'Error while connecting with database.');
        } finally {
          setTimeout(() => {
            this.initialDataLoaded = true;
          }, 750);
        }
      },
      async userInitiatedUpdateAccountNumber() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            account_number: this.accountNumber
          });
          this.triggerNotification('success', 'Changes saved', 'Account number was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateBankName() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            bank_name: this.bankName
          });
          this.triggerNotification('success', 'Changes saved', 'Bank name was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateSwiftIban() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            swift_iban: this.swiftIban
          });
          this.triggerNotification('success', 'Changes saved', 'Bank account SWIFT/IBAN was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async updateEmailAddresses(emails: string[]) {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            email_addresses: emails.filter(email => email.trim() !== '')
          });
          this.triggerNotification('success', 'Changes saved', 'Email addresses updated successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong updating email addresses.');
        }
      },
      async userInitiatedUpdateStreetAddress() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            street_address: this.streetAddress
          });
          this.triggerNotification('success', 'Changes saved', 'Stress address was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateCity() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            city: this.city
          });
          this.triggerNotification('success', 'Changes saved', 'City was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateState() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            state: this.state
          });
          this.triggerNotification('success', 'Changes saved', 'State was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateProvince() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            province: this.province
          });
          this.triggerNotification('success', 'Changes saved', 'Province was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      handleCountrySelected(country: { code: string }) {
        this.updateCountry(country.code);
      },
      async updateCountry(countryCode: string) {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            country: countryCode
          });
          this.selectedCountryCode = countryCode;
          this.triggerNotification('success', 'Changes saved', 'Country was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      }
    },
    mounted() {
      this.fetchViewData();
      this.debouncedUpdateAccountNumber = debounce(this.userInitiatedUpdateAccountNumber, 1000);
      this.debouncedUpdateBankName      = debounce(this.userInitiatedUpdateBankName, 1000);
      this.debouncedUpdateSwiftIban     = debounce(this.userInitiatedUpdateSwiftIban, 1000);
      this.debouncedUpdateStreetAddress = debounce(this.userInitiatedUpdateStreetAddress, 1000);
      this.debouncedUpdateCity          = debounce(this.userInitiatedUpdateCity, 1000);
      this.debouncedUpdateState         = debounce(this.userInitiatedUpdateState, 1000);
      this.debouncedUpdateProvince      = debounce(this.userInitiatedUpdateProvince, 1000);
    },
    watch: {
      accountNumber(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateAccountNumber) {
          this.debouncedUpdateAccountNumber()?.catch(e => console.error(e));
        }
      },
      bankName(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateBankName) {
          this.debouncedUpdateBankName()?.catch(e => console.error(e));
        }
      },
      swiftIban(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateSwiftIban) {
          this.debouncedUpdateSwiftIban()?.catch(e => console.error(e));
        }
      },
      streetAddress(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateStreetAddress) {
          this.debouncedUpdateStreetAddress()?.catch(e => console.error(e));
        }
      },
      city(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateCity) {
          this.debouncedUpdateCity()?.catch(e => console.error(e));
        }
      },
      state(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateState) {
          this.debouncedUpdateState()?.catch(e => console.error(e));
        }
      },
      province(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateProvince) {
          this.debouncedUpdateProvince()?.catch(e => console.error(e));
        }
      },
    }
  });
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
