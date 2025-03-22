import axios from 'axios';

const { REACT_APP_BASE_URL } = process.env;

export const api = axios.create({
  baseURL: REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
