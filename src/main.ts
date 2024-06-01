import './assets/main.css'
import 'vue-advanced-cropper/dist/style.css';

import { createApp } from 'vue'
import App from './App.vue'
import PhotoTagging from './components/PhotoTagging.vue'

createApp(App).component("PhotoTagging", PhotoTagging).mount('#app')
