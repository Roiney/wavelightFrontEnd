import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API
});

export const useApi = () => ({
  validateToken: async (token: string) => {
    const response = await api.post('/validate', { token });
    return response.data;
  },

  signin: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });

    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('user', { name, email, password });

    return response.data;
  },

  logout: async () => {},

  enviavideo: async (token: string, file: File) => {
    const apivideos = axios.create({
      baseURL: process.env.REACT_APP_API,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apivideos.post('/converter/mp4', formData);

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      throw error;
    }
  },

  serverGif: async (token: string, skip: string, take: string) => {
    const apivideos = axios.create({
      baseURL: process.env.REACT_APP_API,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const response = await apivideos.get(`server-gif?skip=${skip}&take=${take}`);

    return response.data;
  },

  serverGifFileName: async (token: string, filename: string) => {
    const apiGif = axios.create({
      baseURL: process.env.REACT_APP_API,
      headers: {
        'Content-Type': 'image/gif',
        Authorization: `Bearer ${token}`
      }
    });
    try {
      const encodedFilename = encodeURIComponent(filename);

      const url = `server-gif/${encodedFilename}`;

      const response = await apiGif.get(url);
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao obter o nome do arquivo do GIF:', error);

      throw error;
    }
  }
});
