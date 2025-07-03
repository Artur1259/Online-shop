export const auth = {
  isAuthenticated: false,
  user: null,

  init() {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAuthenticated = true;
    }
    return this;
  },

  login(userData) {
    this.user = userData;
    this.isAuthenticated = true;
    sessionStorage.setItem("user", JSON.stringify(userData));

  },
  logout() {
    this.user = null;
    this.isAuthenticated = false;
    sessionStorage.removeItem('user');
    },

};

auth.init()