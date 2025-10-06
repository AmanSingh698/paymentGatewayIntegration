<template>
  <div class="container">
    <h1>Our Products</h1>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="card" @click="goToProduct(product.id)">
        <img :src="product.image" alt="Product" />
        <h3>{{ product.name }}</h3>
        <p>₹{{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import productsData from './productsData.json'

const router = useRouter();
const products = ref(productsData);

const goToProduct = (id) => {
  router.push(`/product/${id}`);
};
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  text-align: center;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 30px;
}
.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: 0.3s;
}
.card:hover { transform: translateY(-5px); }
img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
