<template>
  <div id="app">
    <header class="navbar">
      <div class="logo" @click="goHome">
        <img :src="'./eCart.png'" alt="Logo"/>
        <span>eCart</span>
      </div>

      <nav>
        <router-link to="/">Home</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
#app {
  font-family: "Inter", sans-serif;
  color: #222;
  background: #fafafa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo img {
  height: 35px;
  margin-right: 8px;
}

.navbar nav a {
  margin: 0 12px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.navbar nav a.router-link-active {
  color: #1976d2;
}

.main-content {
  flex: 1;
  padding: 0px 20px;
}
</style>
