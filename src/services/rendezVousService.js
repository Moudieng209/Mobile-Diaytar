import API from '../api/axiosConfig';

export const getRendezVous      = ()         => API.get('/api/rendezvous');
export const getAllRendezVous   = ()         => API.get('/api/rendezvous/all');
export const getRendezVousById  = (id)       => API.get(`/api/rendezvous/${id}`);
export const createRendezVous   = (data)     => API.post('/api/rendezvous', data);
export const updateRendezVous   = (id, data) => API.put(`/api/rendezvous/${id}`, data);
export const annulerRendezVous  = (id)       => API.patch(`/api/rendezvous/${id}/annuler`);
export const confirmerRendezVous = (id)      => API.patch(`/api/rendezvous/${id}/confirmer`);
export const terminerRendezVous = (id)       => API.patch(`/api/rendezvous/${id}/terminer`);
export const updateStatut       = (id, statut) => API.patch(`/api/rendezvous/${id}/statut`, { statut });
