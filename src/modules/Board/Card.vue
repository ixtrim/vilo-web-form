<template>
  <div :class="'card priority--' + card.priority">
    <div class="card__task-name">
      <h5>{{ card.title }}</h5>
      <p>{{ card.description }}</p>
    </div>
    <div class="card__meta">
      <ul>
        <li class="card__meta__due">
          <span>Due {{ card.due_date }}</span>
        </li>
        <li class="card__meta__user">
          <img :src="'https://randomuser.me/api/portraits/men/' + card.assignedUserId + '.jpg'" alt="User avatar" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: ['card']
  };
</script>
