<template>
<h2>Hello From Parent</h2>

<Child :userName="userName" :pwd="pwd"/>

</template>

<script setup>
import Child from './Child.vue'

const userName = "Aman";
const pwd = "12345";

</script>