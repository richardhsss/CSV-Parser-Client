import { API_ENDPOINTS } from '../../constants';
import { api } from '../axios';

export const upload = async (formData: FormData) => {
  return await api.post(API_ENDPOINTS.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getData = async ({
  start,
  limit,
}: {
  start: number;
  limit: number;
}) => {
  return (await api.get(API_ENDPOINTS.UPLOAD, { params: { start, limit } }))
    .data;
};
