<template>
  <div id="app">
    <header class="navbar">
      <div class="logo" @click="goHome">
        <img :src="'./eCart.png'" alt="Logo"/>
        <span>eCart</span>
      </div>

      <!-- Hamburger toggle for mobile -->
      <button class="menu-toggle" @click="toggleMenu">☰</button>

      <nav :class="{ open: menuOpen }">
        <router-link to="/">Home</router-link>
        <router-link to="/payment-history">Payment History</router-link>
        <router-link to="/cart">Cart</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const menuOpen = ref(false);

const goHome = () => router.push("/");
const toggleMenu = () => menuOpen.value = !menuOpen.value;
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

/* Desktop nav */
.navbar nav {
  display: flex;
  gap: 12px;
}

.navbar nav a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.navbar nav a.router-link-active {
  color: #1976d2;
}

/* Hamburger button hidden on desktop */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }

  /* Show hamburger */
  .menu-toggle {
    display: block;
  }

  /* Hide nav links by default */
  .navbar nav {
    display: none;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
  }

  /* Show nav when menuOpen */
  .navbar nav.open {
    display: flex;
  }

  .navbar nav a {
    padding: 10px 0;
    width: 100%;
    text-align: center;
    border-top: 1px solid #eee;
  }
}

.main-content {
  flex: 1;
  padding: 0 20px;
}
</style>
