<template>
  <div class="total-income">
    <div class="row">
      <div class="col-lg-12">
        <h3>Client’s breakdown</h3>
        <canvas id="incomeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { db } from '@/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  setup() {
    const fetchInvoicesAndCalculateIncome = async () => {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const invoicesQuery = query(
        collection(db, "invoices"),
        where("due_date", ">=", startOfYear)
      );
      const querySnapshot = await getDocs(invoicesQuery);
      const monthlyTotals = {};

      querySnapshot.forEach((doc) => {
        const invoice = doc.data();
        const dueDate = invoice.due_date.toDate();
        const monthYear = `${dueDate.getMonth() + 1}-${dueDate.getFullYear()}`;
        if (!monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] = 0;
        }
        monthlyTotals[monthYear] += invoice.total_amount;
        
      });

      const labels = Object.keys(monthlyTotals).map(monthYear => {
        const [month, year] = monthYear.split('-');
        return `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`;
      });
      const data = Object.values(monthlyTotals);

      const ctx = document.getElementById('incomeChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Income',
            data: data,
            backgroundColor: '#444CE7',
            borderColor: '#444CE7',
            borderWidth: 2,
            fill: false,
            lineTension: 0.4
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value, index, values) {
                  return '$' + value.toLocaleString(); // Format as currency
                }
              },
              grid: {
                color: '#EAECF0'
              }
            },
            x: {
              grid: {
                color: '#ffffff'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                    size: 14
                }
              }
            }
          }
        }
      });
    };

    onMounted(fetchInvoicesAndCalculateIncome);
  }
};
</script>

<style>
@import url(./ClientsBreakdown.scss);
</style>
