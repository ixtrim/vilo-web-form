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
              <h4>Company Name</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="VILO Inc." 
                v-model="companyName"
              />
            </div>
          </div>

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
                label="Branch" 
                placeholder="00001" 
                v-model="branch"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Account Type</h4>
              <p>Choose the type of account you have.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VDropdown :title="accountType.label" :items="accountTypeOptions" @item-clicked="changeAccountType" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Currency</h4>
              <p>Select the currency of your account.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VDropdown :title="currency.label" :items="currencyOptions" @item-clicked="changeCurrency" />
            </div>
          </div>

          <div class="dashboard__form__section" style="display: none;">
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
              <h4>Address</h4>
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
              <h4>Sort Code</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="BAJAJMKN XXX BIC" 
                v-model="sortCode"
              />
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
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VEmailInputGroup from '@/components/v-email-input-group/VEmailInputGroup.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';

  interface NotificationRef {
    showNotification: () => void;
  }

  interface DropdownItem {
    label: string;
    value: string;
  }

  export default defineComponent({
    components: {
      VButton,
      VInput,
      TabsSettings,
      VEmailInputGroup,
      VNotification,
      VDropdown,
    },
    data() {
      return {
        initialDataLoaded: false,
        notificationType: 'success',
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
        companyName: '',
        accountNumber: '',
        bankName: '',
        branch: '',
        emails: [],
        streetAddress: '',
        sortCode: '',
        accountType: { label: '', value: '' },
        currency: { label: '', value: '' },
        accountTypeOptions: [
          { label: 'Savings', value: 'savings' },
          { label: 'Checkings', value: 'checkings' },
        ],
        currencyOptions: [
          { label: 'USD', value: 'usd' },
          { label: 'JMD', value: 'jmd' },
        ],
        debouncedUpdateCompanyName: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateAccountNumber: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateBankName: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateBranch: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateStreetAddress: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateSortCode: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateAccountType: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateCurrency: null as ((...args: any[]) => Promise<void> | undefined) | null,
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
            this.companyName   = docSnap.data().company_name;
            this.accountNumber = docSnap.data().account_number;
            this.bankName      = docSnap.data().bank_name;
            this.branch        = docSnap.data().branch;
            this.emails        = docSnap.data().email_addresses || [];
            this.streetAddress = docSnap.data().street_address;
            this.sortCode      = docSnap.data().sort_code;
            const accountTypeValue = docSnap.data().account_type;
            const currencyValue = docSnap.data().currency;
            const matchingAccountType = this.accountTypeOptions.find(item => item.value === accountTypeValue);
            const matchingCurrency = this.currencyOptions.find(item => item.value === currencyValue);
            if (matchingAccountType) {
              this.accountType = matchingAccountType;
            }
            if (matchingCurrency) {
              this.currency = matchingCurrency;
            }
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
      async userInitiatedUpdateCompanyName() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            company_name: this.companyName
          });
          this.triggerNotification('success', 'Changes saved', 'Company name was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
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
      async userInitiatedUpdateBranch() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            branch: this.branch
          });
          this.triggerNotification('success', 'Changes saved', 'Branch information was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async updateEmailAddresses(emails: string[]) {
        if (!this.initialDataLoaded) return;

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
      async userInitiatedUpdateSortCode() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            sort_code: this.sortCode
          });
          this.triggerNotification('success', 'Changes saved', 'Sort code was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateAccountType() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            account_type: this.accountType.value
          });
          this.triggerNotification('success', 'Changes saved', 'Account type was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async userInitiatedUpdateCurrency() {
        try {
          const docRef = doc(db, "settings", "billing");
          await updateDoc(docRef, {
            currency: this.currency.value
          });
          this.triggerNotification('success', 'Changes saved', 'Currency was changed successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      changeAccountType(item: DropdownItem) {
        this.accountType.label = item.label;
        this.accountType.value = item.value;
        if (this.debouncedUpdateAccountType) {
          try {
            this.debouncedUpdateAccountType();
          } catch (e) {
            console.error(e);
          }
        }
      },
      changeCurrency(item: DropdownItem) {
        this.currency.label = item.label;
        this.currency.value = item.value;
        if (this.debouncedUpdateCurrency) {
          try {
            this.debouncedUpdateCurrency();
          } catch (e) {
            console.error(e);
          }
        }
      },
    },
    mounted() {
      this.fetchViewData();
      this.debouncedUpdateCompanyName     = debounce(this.userInitiatedUpdateCompanyName, 1000);
      this.debouncedUpdateAccountNumber = debounce(this.userInitiatedUpdateAccountNumber, 1000);
      this.debouncedUpdateBankName      = debounce(this.userInitiatedUpdateBankName, 1000);
      this.debouncedUpdateBranch     = debounce(this.userInitiatedUpdateBranch, 1000);
      this.debouncedUpdateStreetAddress = debounce(this.userInitiatedUpdateStreetAddress, 1000);
      this.debouncedUpdateSortCode          = debounce(this.userInitiatedUpdateSortCode, 1000);
      this.debouncedUpdateAccountType = debounce(this.userInitiatedUpdateAccountType, 1000);
      this.debouncedUpdateCurrency = debounce(this.userInitiatedUpdateCurrency, 1000);
    },
    watch: {
      companyName(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateCompanyName) {
          this.debouncedUpdateCompanyName()?.catch(e => console.error(e));
        }
      },
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
      branch(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateBranch) {
          this.debouncedUpdateBranch()?.catch(e => console.error(e));
        }
      },
      streetAddress(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateStreetAddress) {
          this.debouncedUpdateStreetAddress()?.catch(e => console.error(e));
        }
      },
      sortCode(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateSortCode) {
          this.debouncedUpdateSortCode()?.catch(e => console.error(e));
        }
      },
      accountType(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateAccountType) {
          this.debouncedUpdateAccountType()?.catch(e => console.error(e));
        }
      },
      currency(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateCurrency) {
          this.debouncedUpdateCurrency()?.catch(e => console.error(e));
        }
      },
    }
  });
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
