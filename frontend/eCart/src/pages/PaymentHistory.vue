<template>
  <div class="history-container">
    <h2>Payment History</h2>
    <div v-if="history.length === 0" class="no-history">
      No transaction history found.
    </div>

    <div v-else class="history-list">
      <div v-for="(item, index) in history" :key="index" class="history-card">
        <p><b>Product:</b> {{ item.productName }}</p>
        <p><b>Quantity:</b> {{ item.quantity }}</p>
        <p><b>Amount:</b> ₹{{ item.amount }}</p>
        <p><b>Date:</b> {{ item.date }}</p>
        <p><b>Status:</b> <span :class="statusClass(item.transactionStatus)">{{ item.transactionStatus }}</span></p>
        <button 
          v-if="item.transactionStatus === 'Pending'" 
          @click="fetchStatus(item)" 
          :disabled="loadingMap[item.transactionToken]"
        >
          {{ loadingMap[item.transactionToken] ? 'Checking...' : 'Fetch Status' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

const history = ref([])
const loadingMap = reactive({});

const fetchHistory = () => {
  const stored = JSON.parse(localStorage.getItem('paymentHistory')) || []
  history.value = stored
}

const statusClass = (status) => {
  if (status === 'Pending') return 'pending'
  if (status === 'Completed') return 'completed'
  return 'failed'
}

const fetchStatus = async (item) => {
  try {
    loadingMap[item.transactionToken] = true
    const res = await axios.post('https://paymentgatewayintegration.onrender.com/api/status', { token: item.transactionToken })
    const updatedStatus = res.data.transaction_status || 'Pending'
    item.transactionStatus = updatedStatus

    // Update in localStorage
    const all = JSON.parse(localStorage.getItem('paymentHistory')) || []
    const idx = all.findIndex(h => h.transactionToken === item.transactionToken)
    if (idx > -1) {
      all[idx].transactionStatus = updatedStatus
      localStorage.setItem('paymentHistory', JSON.stringify(all))
    }
  } catch (err) {
    console.error('Failed to fetch status', err)
  } finally {
    loadingMap[item.transactionToken] = false
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.history-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  text-align: center;
}

.no-history {
  font-size: 18px;
  color: #666;
  margin-top: 40px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.history-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  background: #fff;
  text-align: left;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.history-card p {
  margin: 5px 0;
}

.history-card button {
  margin-top: 10px;
  padding: 8px 15px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.history-card button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pending { color: orange; font-weight: 600; }
.completed { color: green; font-weight: 600; }
.failed { color: red; font-weight: 600; }

/* Mobile responsive */
@media (max-width: 600px) {
  .history-card {
    padding: 12px;
  }
}
</style>
