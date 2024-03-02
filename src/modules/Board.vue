<template>
  <div class="board"> 
    <List v-for="list in lists" :key="list.id" :list="list" @addTask="$emit('addTask')" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.js';
import { Sortable } from '@shopify/draggable';
import List from '@/modules/Board/List.vue';

interface List {
  id: number;
  title: string;
  cards: Task[]; // Use the Task interface
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  due_date: string;
  user_assigned: string;
  status: number; // Add this line
}

export default defineComponent({
  components: {
    List
  },
  props: {
    caseId: String
  },
  data() {
    return {
      lists: [
        { id: 1, title: 'Pending', cards: [] as Task[] },
        { id: 2, title: 'In Progress', cards: [] as Task[] },
        { id: 3, title: 'In Review', cards: [] as Task[] },
        { id: 4, title: 'Completed', cards: [] as Task[] },
      ] as List[]
    };
  },
  async mounted() {
    await this.fetchTasks();
    const boardElement = this.$refs.board as HTMLElement;
    if (boardElement) {
      new Sortable(boardElement, {
        draggable: '.list',
        handle: '.list__drag'
      });
    }

    const sortable = new Sortable(document.querySelectorAll('.list'), {
      draggable: '.card'
    });

    sortable.on('sortable:stop', (event) => {
      
    });
  },
  watch: {
    async caseId(newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.fetchTasks();
      }
    }
  },
  methods: {
    async fetchTasks() {
      if (!this.caseId) return;
      const tasksQuery = query(collection(db, "tasks"), where("case", "==", this.caseId));
      const querySnapshot = await getDocs(tasksQuery);
      const tasks = querySnapshot.docs.map(doc => {
        const taskData = doc.data() as any; // Temporarily use 'any' to access Firestore Timestamp
        const dueDate = taskData.due_date.toDate(); // Convert Firestore Timestamp to Date
        const formattedDueDate = `${dueDate.getDate().toString().padStart(2, '0')}.${(dueDate.getMonth() + 1).toString().padStart(2, '0')}.${dueDate.getFullYear()}`;

        return {
          ...taskData,
          id: doc.id,
          due_date: formattedDueDate, // Now correctly formatted
        };
      });
      

      // Reset cards in lists
      this.lists.forEach(list => { list.cards = []; });

      // Assign tasks to the appropriate list based on their status
      tasks.forEach(task => {
        const list = this.lists.find(list => list.id === task.status + 1);
        if (list) {
          list.cards.push({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            due_date: task.due_date,
            user_assigned: task.user_assigned,
            status: 0,
          });
        }
      });
    }
  }
});
</script>


<style>
  @import url(./styles/board.scss);
</style>
