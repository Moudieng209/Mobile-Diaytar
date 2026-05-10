export const formatDateISO = (date) => {
  return date.toISOString().split('T')[0];
};

export const formatTimeHHMM = (date) => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};