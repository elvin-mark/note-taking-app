import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import pb from '../services/pocketbase.ts';

// Define the PocketBaseUser interface
interface PocketBaseUser {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  verified: boolean;
  email: string;
  created: string;
  updated: string;
  // Add any other fields you might have in your user collection
}

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<PocketBaseUser | null> = ref(pb.authStore.model as PocketBaseUser | null);
  const isAuthenticated: Ref<boolean> = ref(pb.authStore.isValid);

  pb.authStore.onChange(() => {
    user.value = pb.authStore.model as PocketBaseUser | null;
    isAuthenticated.value = pb.authStore.isValid;
  }, true);

  async function login(email: string, password: string): Promise<void> {
    try {
      await pb.collection('users').authWithPassword(email, password);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function register(email: string, password: string, passwordConfirm: string): Promise<void> {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });
      // After successful registration, log the user in
      await login(email, password);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  function logout(): void {
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
