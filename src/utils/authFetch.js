export const authFetch = (url, options = {}) => {
    const token = localStorage.getItem('token');
  
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Token ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
  };
  