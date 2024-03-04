<template>
  <div class="total-income">
    <div class="row">
      <div class="col-lg-12">
        <h3>Total Income</h3>
        <canvas id="incomeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { db } from '@/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  setup() {
    const chartRef = ref(null);

    const fetchInvoicesAndCalculateIncome = async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const invoicesQuery = query(
        collection(db, "invoices"),
        where("created", ">=", startOfYear)
      );
      const querySnapshot = await getDocs(invoicesQuery);
      const monthlyTotals = {};

      querySnapshot.forEach((doc) => {
        const invoice = doc.data();
        const createdDate = invoice.created.toDate();
        const monthYear = `${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;
        if (!monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] = 0;
        }
        monthlyTotals[monthYear] += invoice.total_amount;
      });

      const labels = Object.keys(monthlyTotals);
      const data = Object.values(monthlyTotals);

      const ctx = chartRef.value.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Income',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };

    onMounted(() => {
      chartRef.value = document.getElementById('incomeChart');
      fetchInvoicesAndCalculateIncome();
    });

    return {
      chartRef
    };
  }
};
</script>

<style>
@import url(./TotalIncome.scss);
</style>
