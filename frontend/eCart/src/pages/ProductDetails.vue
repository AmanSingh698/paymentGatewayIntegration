<template>
  <div v-if="product" class="container">
    <img :src="product.image || '/dummy-images/default.jpg'" alt="Product Image" class="image" />
    <h1>{{ product.name }}</h1>
    <p class="desc">{{ product.description }}</p>

    <!-- Quantity Selector -->
    <div class="quantity-section">
      <label for="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        v-model.number="quantity"
        min="1"
      />
    </div>

    <!-- Total Price -->
    <p class="price">₹{{ totalPrice }}</p>

    <!-- Pass product (unit price) and quantity -->
    <PaymentSection :product="product" :quantity="quantity" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PaymentSection from './PaymentSection.vue'
import productsData from './productsData.json'

const route = useRoute()
const id = Number(route.params.id)
const product = productsData.find((p) => p.id === id)

// Quantity state
const quantity = ref(1)

// Total price computed
const totalPrice = computed(() => product.price * quantity.value)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  text-align: center;
}
.image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}
.price {
  font-size: 24px;
  margin: 10px 0;
}
.quantity-section {
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.quantity-section input {
  width: 60px;
  padding: 5px;
  font-size: 16px;
  text-align: center;
}
</style>
