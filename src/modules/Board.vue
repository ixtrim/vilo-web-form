<template>
  <div class="board">
    <List v-for="list in lists" :key="list.id" :list="list" @addTask="$emit('addTask')" />
  </div>
</template>

<script lang="ts">
import { Sortable } from '@shopify/draggable';
import List from '@/modules/Board/List.vue';

export default {
  components: {
    List
  },
  data() {
    return {
      lists: [
        {
          id: 1, 
          title: 'Pending', 
          cards: [
            { id: 'a1', title: 'Consult with experts in relevant fields for opinions and analysis that could strengthen the case.', priority: 'high', dueDate: '05.12.2023', assignedUserId: '1', assignedUserName: 'Jane Doe' },
            { id: 'a2', title: 'Prepare for trial, including organizing evidence, preparing witness testimonies, and planning opening and closing statements.', priority: 'medium', dueDate: '10.12.2023', assignedUserId: '2', assignedUserName: 'John Smith' },
            { id: 'a3', title: 'Ensure all legal procedures and actions comply with ethical and legal standards.', priority: 'low', dueDate: '15.12.2023', assignedUserId: '3', assignedUserName: 'Emily Johnson' },
            { id: 'a4', title: 'Regularly update the client on the cases progress, including potential risks and changes in strategy.', priority: 'high', dueDate: '20.12.2023', assignedUserId: '4', assignedUserName: 'Michael Brown' }
          ]
        },
        {
          id: 2, 
          title: 'In Progress', 
          cards: [
            { id: 'b1', title: 'Manage the discovery process, including requests for production, interrogatories, and depositions.', priority: 'medium', dueDate: '06.12.2023', assignedUserId: '5', assignedUserName: 'Sarah Miller' },
            { id: 'b2', title: 'Ensure all necessary documents are correctly filed with the court before deadlines.', priority: 'high', dueDate: '12.12.2023', assignedUserId: '6', assignedUserName: 'David Wilson' },
            { id: 'b3', title: 'Develop a comprehensive legal strategy, considering various scenarios and potential outcomes.', priority: 'low', dueDate: '18.12.2023', assignedUserId: '7', assignedUserName: 'Linda Garcia' }
          ]
        },
        {
          id: 3, 
          title: 'In Review', 
          cards: [
            { id: 'c1', title: 'Identify and interview potential witnesses to gather more information and statements that could support the case.', priority: 'medium', dueDate: '07.12.2023', assignedUserId: '8', assignedUserName: 'Brian Martinez' },
            { id: 'c2', title: 'Analyze all evidence, including documents, photos, and electronic data, to determine its relevance and admissibility.', priority: 'high', dueDate: '13.12.2023', assignedUserId: '9', assignedUserName: 'Nancy Robinson' },
            { id: 'c3', title: 'Prepare necessary legal documents, such as briefs, motions, and pleadings, relevant to the case.', priority: 'low', dueDate: '19.12.2023', assignedUserId: '10', assignedUserName: 'Daniel Clark' }
          ]
        },
        {
          id: 4, 
          title: 'Completed', 
          cards: [
            { id: 'd1', title: 'Legal research to find relevant statutes, case laws, and legal precedents that could impact the case.', priority: 'low', dueDate: '08.12.2023', assignedUserId: '11', assignedUserName: 'Jessica Rodriguez' },
            { id: 'd2', title: 'Examine all case documents, evidence, and client information', priority: 'medium', dueDate: '14.12.2023', assignedUserId: '12', assignedUserName: 'William Lewis' }
          ]
        }
      ]
    };
  },
  mounted() {
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
  }
};
</script>

<style>
  @import url(./styles/board.scss);
</style>
