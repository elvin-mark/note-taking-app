<template>
  <div class="flex items-center justify-center h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center">Create an Account</h1>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" id="email" type="email" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" id="password" type="password" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input v-model="passwordConfirm" id="passwordConfirm" type="password" required class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</button>
      </form>
       <p class="text-sm text-center">
        Already have an account? <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    toast.error("Passwords do not match!");
    return;
  }
  try {
    await authStore.register(email.value, password.value, passwordConfirm.value);
    router.push('/');
  } catch (error) {
    toast.error('Registration Failed: ' + error.message);
  }
};
</script>
