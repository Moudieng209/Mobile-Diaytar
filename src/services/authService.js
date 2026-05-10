import API from '../api/axiosConfig';

export const inscription = (data) => API.post('/api/auth/inscription', data);
export const connexion   = (data) => API.post('/api/auth/connexion', data);
export const deconnexion = ()     => API.post('/api/auth/deconnexion');
export const getProfil   = ()     => API.get('/api/auth/profile');
export const updateProfil = (data) => API.put('/api/auth/profile', data);