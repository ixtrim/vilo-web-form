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
  priority: number;
  due_date: string;
  assignedUserId: string;
  assignedUserName: string;
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
      const tasks = querySnapshot.docs.map(doc => ({ ...(doc.data() as Task), id: doc.id }));
      

      // Reset cards in lists
      this.lists.forEach(list => { list.cards = []; });

      // Assign tasks to the appropriate list based on their status
      tasks.forEach(task => {
        const list = this.lists.find(list => list.id === task.status + 1);
        if (list) {
          list.cards.push({
            id: task.id,
            title: task.title,
            priority: task.priority,
            due_date: new Date(task.due_date).toLocaleDateString(),
            assignedUserId: task.assignedUserId,
            assignedUserName: '',
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
