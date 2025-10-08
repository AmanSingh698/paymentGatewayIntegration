<template>
<h2>Hello, {{ props.userName }}</h2>
<h2>Your pwd is : {{ props.pwd }}</h2>

</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    userName: String,
    pwd: String
});

</script>