<template>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
      {{ title }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <li v-for="item in items" :key="item.label">
        <a class="dropdown-item" href="#" @click.prevent="itemClicked(item)">{{ item.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'v-dropdown',
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    itemClicked(item) {
      this.$emit('item-clicked', item);
    }
  }
}
</script>

<style>
  @import url(./VDropDown.scss);
</style>
