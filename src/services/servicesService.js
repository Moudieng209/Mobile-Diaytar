import API from '../api/axiosConfig';

export const getServices = () => API.get('/api/services');
export const getServiceById = (id) => API.get(`/api/services/${id}`);
export const createService = (data) => API.post('/api/services', data);
export const updateService = (id, data) => API.put(`/api/services/${id}`, data);
export const deleteService = (id) => API.delete(`/api/services/${id}`);