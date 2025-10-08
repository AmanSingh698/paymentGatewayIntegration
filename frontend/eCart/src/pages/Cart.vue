<template>
  <div class="history-container">
    <h2>My Cart</h2>
    <div v-if="cartItems.length === 0" class="no-history">Your cart is empty.</div>

    <div v-else class="history-list">
      <div v-for="(item, index) in cartItems" :key="index" class="history-card">
        <p><b>Product:</b> {{ item.name }}</p>
        <p><b>Quantity:</b> {{ item.quantity }}</p>
        <p><b>Price:</b> ₹{{ item.price }}</p>
        <p><b>Total:</b> ₹{{ item.total }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cartItems = ref([])

const fetchCart = () => {
  const stored = JSON.parse(localStorage.getItem('cart')) || []
  console.log("Stored cart data: ", stored);
  cartItems.value = stored
}

onMounted(() => {
  fetchCart()
})
</script>
