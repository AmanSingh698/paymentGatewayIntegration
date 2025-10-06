<template>
  <div class="payment-container">
    <h3>Make Payment</h3>
    <p><b>Product:</b> {{ product.name }}</p>
    <p><b>Quantity:</b> {{ quantity }}</p>
    <p><b>Amount:</b> ₹{{ totalPrice }}</p>

    <button @click="createTransaction" :disabled="loading || token">
      {{ loading ? 'Processing...' : token ? 'Transaction Created' : 'Pay Now' }}
    </button>

    <div v-if="depositDetails" class="details">
      <hr />
      <h4>Payment Details</h4>
      <img :src="depositDetails.qr" alt="UPI QR" class="qr" />
      <p><b>UPI Link:</b></p>
      <a :href="depositDetails.link" target="_blank">{{ depositDetails.link }}</a>
      <p><b>Amount:</b> ₹{{ depositDetails.amount }}</p>

      <div class="status">
        <p>
          <b>Status:</b>
          <span :class="statusClass">{{ transactionStatus }}</span>
        </p>
        <button @click="checkStatus" :disabled="loading">Check Status</button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const token = ref(null)
const depositDetails = ref(null)
const transactionStatus = ref('Pending')
const loading = ref(false)
const error = ref('')

// Compute total price dynamically
const totalPrice = computed(() => props.product.price * props.quantity)

const statusClass = computed(() => {
  if (transactionStatus.value === 'Pending') return 'pending'
  if (transactionStatus.value === 'Completed') return 'completed'
  return 'failed'
})

const createTransaction = async () => {
  try {
    loading.value = true
    error.value = ''

    // Send unit price + quantity + totalPrice
    const res = await axios.post('https://payment-gateway-integration-lilac.vercel.app/api/create', {
      product: props.product,
      quantity: props.quantity,
      totalPrice: totalPrice.value
    })

    token.value = res.data?.data?.token
    if (token.value) await getDepositDetails()
    else throw new Error('Token not received')
  } catch (err) {
    error.value = 'Failed to create transaction.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getDepositDetails = async () => {
  try {
    const res = await axios.post('https://payment-gateway-integration-lilac.vercel.app/api/deposit', { token: token.value })
    const data = Array.isArray(res.data) ? res.data[0] : res.data
    const qr = data.data.qr
    depositDetails.value = {
      ...data.data,
      qr: qr.startsWith('data:image') ? qr : `data:image/png;base64,${qr}`
    }
  } catch {
    error.value = 'Failed to fetch deposit details.'
  }
}

const checkStatus = async () => {
  try {
    loading.value = true
    const res = await axios.post('https://payment-gateway-integration-lilac.vercel.app/api/status', { token: token.value })
    transactionStatus.value = res.data.transaction_status || 'Pending'
  } catch {
    error.value = 'Failed to check transaction status.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-container {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 25px;
  background: #fff;
  margin-top: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

button {
  padding: 10px 20px;
  margin: 10px 0;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.qr {
  width: 200px;
  margin: 20px auto;
  display: block;
}

.status {
  margin-top: 15px;
}
.pending {
  color: orange;
  font-weight: 600;
}
.completed {
  color: green;
  font-weight: 600;
}
.failed {
  color: red;
  font-weight: 600;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
