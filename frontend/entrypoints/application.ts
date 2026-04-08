import { createApp } from 'vue'
import App from '../App.vue'
import '../assets/main.css'

createApp(App).mount('#app')

// Service Workerの登録処理
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}