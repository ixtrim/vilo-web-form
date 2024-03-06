<template>
  <div class="clients-breakdown">
    <div class="row">
      <div class="col-lg-12">
        <h3>Client’s Breakdown</h3>
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, nextTick } from 'vue';
import Chart from 'chart.js/auto';

export default {
  setup() {
    const chartRef = ref(null);

    const fetchInvoicesAndCalculateIncome = async () => {
      // Example data and labels
      const data = [3500, 19583]; // Replace with your actual data
      const labels = ['Aniyah Ernser', 'James Williams']; // Replace with your actual labels

      // Wait for the next DOM update cycle to ensure the ref is bound
      await nextTick();

      if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Income',
              data: data,
              backgroundColor: [
                '#444ce7',
                '#6172f3',
                '#8098f9',
                '#a4bcfd',
                '#eaecf0',
              ],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      }
    };

    onMounted(fetchInvoicesAndCalculateIncome);

    return {
      chartRef
    };
  }
};
</script>

<style>
@import url(./ClientsBreakdown.scss);
</style>
