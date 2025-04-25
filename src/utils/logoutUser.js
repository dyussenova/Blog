export const logoutUser = () => {
  localStorage.removeItem('login');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
