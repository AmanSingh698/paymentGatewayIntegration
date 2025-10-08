<template>
  <div class="payment-container">
    <h3>Make Payment</h3>
    <p><b>Product:</b> {{ product.name }}</p>
    <p><b>Quantity:</b> {{ quantity }}</p>
    <p><b>Amount:</b> ₹{{ totalPrice }}</p>
    {{ product }}
    <button @click="addToCart(product, quantity)" style="margin-right: 10px;">Add to Cart</button>

    <!-- Pay Now Button -->
    <button @click="createTransaction" :disabled="loadingCreate || token">
      {{ loadingCreate ? 'Processing...' : token ? 'Transaction Created' : 'Pay Now' }}
    </button>

    <!-- Payment Details Section -->
    <div v-if="depositDetails" class="details">
      <hr />
      <h4>Payment Details</h4>
      <img :src="depositDetails.qr" alt="UPI QR" class="qr" />

      <div class="upi-link">
        <p><b>UPI Link:</b></p>
        <a :href="depositDetails.link" target="_blank">{{ depositDetails.link }}</a>
      </div>

      <p><b>Amount:</b> ₹{{ depositDetails.amount }}</p>

      <div class="status">
        <p>
          <b>Status: </b>
          <span :class="statusClass">{{ transactionStatus }}</span>
        </p>
        <!-- Check Status Button -->
        <button @click="checkStatus" :disabled="loadingStatus || transactionStatus !== 'Pending'">
          {{ loadingStatus ? 'Checking...' : 'Check Status' }}
        </button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  product: { type: Object, required: true },
  quantity: { type: Number, required: true },
})

// Separate loading states
const loadingCreate = ref(false)
const loadingStatus = ref(false)
const token = ref(null)
const depositDetails = ref(null)
const transactionStatus = ref('Pending')
const error = ref('')

const totalPrice = computed(() => props.product.price * props.quantity)

const statusClass = computed(() => {
  if (transactionStatus.value === 'Pending') return 'pending'
  if (transactionStatus.value === 'Completed') return 'completed'
  return 'failed'
})

const addToCart = (product, quantity) => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart'));

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const item = {
      name: product.name,
      price: product.price,
      quantity,
      total: product.price * quantity,
    };

    // Here, we are checking if item already exists in cart
    // If it exists, we update the quantity and total price
    const existingItemIndex = cart.findIndex(p => p.name === product.name);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].total =
        cart[existingItemIndex].price * cart[existingItemIndex].quantity;
    } else {
      cart.push(item);
    }

    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Product added to cart!');
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};


// Save transaction to localStorage
const saveToLocalStorage = () => {
  const history = JSON.parse(localStorage.getItem('paymentHistory')) || []

  const existingIndex = history.findIndex((h) => h.transactionToken === token.value)
  const record = {
    productName: props.product.name,
    quantity: props.quantity,
    amount: totalPrice.value,
    date: new Date().toLocaleString(),
    transactionToken: token.value,
    transactionStatus: transactionStatus.value,
  }

  if (existingIndex > -1) {
    history[existingIndex] = record
  } else {
    history.push(record)
  }

  localStorage.setItem('paymentHistory', JSON.stringify(history))
}

// API calls
const createTransaction = async () => {
  try {
    loadingCreate.value = true
    error.value = ''

    const res = await axios.post('https://paymentgatewayintegration.onrender.com/api/create', {
      product: props.product,
      quantity: props.quantity,
      totalPrice: totalPrice.value,
    })

    token.value = res.data?.data?.token
    if (!token.value) throw new Error('Token not received')

    // Save initial pending transaction
    saveToLocalStorage()

    await getDepositDetails()
  } catch (err) {
    error.value = 'Failed to create transaction.'
    console.error(err)
  } finally {
    loadingCreate.value = false
  }
}

const getDepositDetails = async () => {
  try {
    const res = await axios.post('https://paymentgatewayintegration.onrender.com/api/deposit', {
      token: token.value,
    })
    const data = Array.isArray(res.data) ? res.data[0] : res.data
    const qr = data.data.qr

    depositDetails.value = {
      ...data.data,
      qr: qr.startsWith('data:image') ? qr : `data:image/png;base64,${qr}`,
    }
  } catch {
    error.value = 'Failed to fetch deposit details.'
  }
}

const checkStatus = async () => {
  try {
    loadingStatus.value = true
    const res = await axios.post('https://paymentgatewayintegration.onrender.com/api/status', {
      token: token.value,
    })
    transactionStatus.value = res.data.transaction_status || 'Pending'

    // Update localStorage
    saveToLocalStorage()
  } catch {
    error.value = 'Failed to check transaction status.'
  } finally {
    loadingStatus.value = false
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

/* Responsive UPI link */
.upi-link {
  overflow-x: auto;
  padding: 5px 0;
  max-width: 100%;
}

.upi-link a {
  display: inline-block;
  word-break: break-all;
  color: #1976d2;
  text-decoration: underline;
}
</style>
