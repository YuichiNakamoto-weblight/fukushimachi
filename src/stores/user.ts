import { defineStore } from 'pinia';

type UserState = {
  userId: number | null;
  userType: 'employer' | 'seeker' | null;
  email: string | null;
  emailVerified: boolean;
};

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: null,
    userType: null,
    email: null,
    emailVerified: false,
  }),
  actions: {
    setLogin(userId: number, userType: 'employer' | 'seeker') {
      this.userId = userId;
      this.userType = userType;
      this.emailVerified = true;
    },
    setPendingEmail(email: string, userId?: number) {
      this.email = email;
      if (userId) this.userId = userId;
    },
    logout() {
      this.userId = null;
      this.userType = null;
      this.email = null;
      this.emailVerified = false;
    },
  },
});

