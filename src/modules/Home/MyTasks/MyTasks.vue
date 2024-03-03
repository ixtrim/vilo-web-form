<template>
  <div class="my-tasks">
    <!-- Heading and View All Link -->
    <div class="row">
      <div class="col-lg-8">
        <h3>My Taskss</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/case-boards" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>

    <!-- Tasks Summary -->
    <div class="row">
      <div class="col-lg-12 align-center">
        <div class="my-tasks__wrapper">
          <ul class="my-tasks__wrapper__summary">
            <li>
              <VBadge variant="primary">In Progress ({{ tasks.filter(t => t.status === 1).length }})</VBadge>
            </li>
            <li>
              <VBadge variant="light">In Review ({{ tasks.filter(t => t.status === 2).length }})</VBadge>
            </li>
            <li>
              <VBadge variant="warning">Pending ({{ tasks.filter(t => t.status === 0).length }})</VBadge>
            </li>
          </ul>

          <!-- Tasks List -->
          <div v-for="task in tasks" :key="task.id" class="my-tasks__wrapper__item">
            <div class="my-tasks__wrapper__item__top">
              <h4>{{ task.title }}</h4>
              <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="" text=""></VButton>
            </div>
            <ul class="my-tasks__wrapper__item__bottom">
              <li>
                <VTimestamp :variant="getTimestampVariant(task.due_date)">{{ task.due_date }}</VTimestamp>
              </li>
              <li>
                <VLink :to="`/case-board/${task.case}`" isRouteLink styled="secondary" icon="left" icon-style="tag">{{ task.caseTitle }}</VLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { db } from '@/firebase.js';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/stores/userStore';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VTimestamp from '@/components/v-timestamp/VTimestamp.vue';
import VButton from '@/components/v-button/VButton.vue';

interface Task {
  id: string;
  title: string;
  due_date: string; // Now storing as a formatted string
  status: number;
  case?: string;
  caseTitle?: string;
}

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VButton,
    VTimestamp
  },
  setup() {
    const { user } = useUserStore();
    const tasks = ref<Task[]>([]);

    const fetchTasks = async () => {
      if (!user.value) return;

      const tasksQuery = query(
        collection(db, "tasks"),
        where("user_assigned", "==", user.value.id),
        where("status", "in", [0, 1, 2])
      );

      const querySnapshot = await getDocs(tasksQuery);
      tasks.value = querySnapshot.docs.map(doc => {
        const taskData = doc.data();
        const dueDate = taskData.due_date.toDate(); // Convert Firestore Timestamp to JavaScript Date object
        const formattedDueDate = `${dueDate.getDate().toString().padStart(2, '0')}.${(dueDate.getMonth() + 1).toString().padStart(2, '0')}.${dueDate.getFullYear()}`;
        return {
          ...taskData,
          due_date: formattedDueDate, // Store the formatted string
          id: doc.id,
        };
      }) as Task[];
    };

    onMounted(fetchTasks);

    // No changes needed for getTimestampVariant function
    const getTimestampVariant = (dueDate: string): string => {
      // Your logic to determine the variant based on dueDate
      return 'primary'; // Placeholder return, adjust as needed
    };

    return {
      tasks,
      getTimestampVariant,
    };
  },
});

</script>

<style>
  @import url(./MyTasks.scss);
</style>