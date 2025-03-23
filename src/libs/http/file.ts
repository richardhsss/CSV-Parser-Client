import { API_ENDPOINTS } from '../../constants';
import { api } from '../axios';

export const upload = async (formData: any) => {
  return await api.post(API_ENDPOINTS.UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getData = async ({ start, limit }: any) => {
  return (await api.get(API_ENDPOINTS.UPLOAD, { params: { start, limit } }))
    .data;
};
