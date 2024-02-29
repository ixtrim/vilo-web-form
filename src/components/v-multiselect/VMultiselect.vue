<template>
  <div class="multiselect">
    <select @change="addItem($event.target.value)" multiple>
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <div class="multiselect-selected-items">
      <span v-for="item in selectedItems" :key="item.value">
        {{ item.label }}
        <button @click="removeItem(item)"></button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    selected: Array
  },
  data() {
    return {
      selectedItems: this.selected || []
    };
  },
  methods: {
    addItem(value) {
      const item = this.items.find(i => i.value === value);
      if (item && !this.selectedItems.find(i => i.value === value)) {
        this.selectedItems.push(item);
        this.$emit('update:selected', this.selectedItems);
      }
    },
    removeItem(itemToRemove) {
      this.selectedItems = this.selectedItems.filter(item => item.value !== itemToRemove.value);
      this.$emit('update:selected', this.selectedItems);
    }
  }
};
</script>

<style>
  @import url(./VMultiselect.scss);
</style>

