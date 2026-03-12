const API_BASE_URL = 'http://localhost:8081/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data } };
  }
  return { data };
};

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },
  post: async (url, body) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: (id) => api.get(`/auth/profile/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/category/all'),
  add: (category) => api.post('/category/add', category),
  init: () => api.post('/category/init'),
};

export const providerService = {
  getByCategory: (categoryId) => api.get(`/provider/byCategory/${categoryId}`),
  getByLocation: (location) => api.get(`/provider/byLocation/${location}`),
  add: (provider) => api.post('/provider/add', provider),
};

export const bookingService = {
  create: (booking) => api.post('/bookings/create', booking),
  getCustomerBookings: (userId) => api.get(`/bookings/customer/${userId}`),
  getProviderBookings: (providerId) => api.get(`/bookings/provider/${providerId}`),
  updateStatus: (id, status) => api.post(`/bookings/update-status/${id}?status=${status}`),
};

export default api;
