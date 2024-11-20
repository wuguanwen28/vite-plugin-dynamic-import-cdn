<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import lodash from 'lodash'
import isArray from 'lodash/isArray'
import dayjs from 'dayjs'
import moment from 'moment'
// @ts-ignore
import 'moment/dist/locale/zh-cn'
import axios from 'axios'
import { ref } from 'vue'
import { createRouter } from 'vue-router'

console.log('Vue.ref(123) ==> ', ref(123))
console.log('createRouter ==> ', createRouter)
console.log('lodash.isArray(23) ==> ', isArray(23))
console.log('lodash.isArray([]) ==> ', lodash.isArray([]))
axios.get('/').then((res) => console.log('axios ==> ', res))
console.log('dayjs ==> ', dayjs().format('YYYY-MM-DD HH:mm:ss'))
console.log('moment ==> ', moment().format('LLLL'))
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
