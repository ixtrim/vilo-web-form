<template>
  <div class="board"> 
    <List v-for="list in lists" :key="list.id" :list="list" @addTask="$emit('addTask')" @editTask="handleEditTask" @previewTask="handlePreviewTask" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { collection, query, where, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase.js';
import { Sortable } from '@shopify/draggable';
import List from '@/modules/Board/List.vue';

interface List {
  id: number;
  title: string;
  cards: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  due_date: string;
  user_assigned: string;
  status: number;
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

    const sortable = new Sortable(document.querySelectorAll('.list'), {
      draggable: '.card',
      handle: '.move-task',
      mirror: {
        constrainDimensions: true,
      },
    });

    sortable.on('sortable:stop', async (event: any) => { // Use 'any' to bypass TypeScript checks
      const taskId = event.data.dragEvent.data.source.getAttribute('data-task-id');
      const targetListElement = event.data.newContainer;
      const targetListId = Array.from(document.querySelectorAll('.list')).indexOf(targetListElement);
      const newStatus = targetListId;

      if (newStatus >= 0) {
        await this.updateTaskStatus(taskId, newStatus);
        await this.fetchTasks();
      }
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
    },
    async updateTaskStatus(taskId: string, newStatus: number) {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: newStatus
      }).then(() => {
        console.log('Task status updated');
      }).catch((error) => {
        console.error("Error updating task status: ", error);
      });
    },
    handleEditTask(taskId: string) {
      this.$emit('editTask', taskId);
    },
    handlePreviewTask(taskId: string) {
      this.$emit('previewTask', taskId);
    }
  }
});
</script>


<style>
  @import url(./styles/board.scss);
</style>
