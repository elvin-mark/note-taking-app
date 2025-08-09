import { defineStore } from 'pinia';
import { ref } from 'vue';
import pb from '../services/pocketbase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(pb.authStore.model);
  const isAuthenticated = ref(pb.authStore.isValid);

  pb.authStore.onChange(() => {
    user.value = pb.authStore.model;
    isAuthenticated.value = pb.authStore.isValid;
  }, true);

  async function login(email, password) {
    try {
      await pb.collection('users').authWithPassword(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(email, password, passwordConfirm) {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });
      // After successful registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  function logout() {
    pb.authStore.clear();
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
