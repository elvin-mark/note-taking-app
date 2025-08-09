import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "../index.css"

import App from './App.vue'
import router from './router'
import ConfirmationToast from './components/ConfirmationToast.vue';

const app = createApp(App)

const options: PluginOptions = {
    toastComponent: {
        confirmation: ConfirmationToast
    },
    containerClassName: "custom-toast-container",
    toastClassName: "custom-toast-item"
};

app.use(createPinia())
app.use(router)
app.use(Toast, options)

app.mount('#app')
