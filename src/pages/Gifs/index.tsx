/* eslint-disable no-unused-vars */
import { ChangeEvent, Key, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useApi } from '../../hooks/useApi';

import './index.css';
export const Gifs = () => {
  const imagePath = './assents/nei_beal@hotmail.com/1708288829755_nioqd.gif';
  const auth = useContext(AuthContext);
  const api = useApi();
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [gifsData, setGifsData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchGifs();
  }, [page]);

  const fetchGifs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    try {
      const skip = (page - 1) * 10;
      const take = '5';
      const gifsData = await api.serverGif(token, skip.toString(), take.toString());

      if (gifsData && gifsData.allGifs && gifsData.allGifs.length > 0) {
        const gifs = gifsData.allGifs.map(
          (gif: { id: any; filePath: any; createdAt: string | number | Date; userId: any }) => ({
            id: gif.id,
            filePath: gif.filePath,
            createdAt: new Date(gif.createdAt).toLocaleString(),
            userId: gif.userId
          })
        );
        gifs.forEach((gif: { filePath: any }) => {
          console.log(gif.filePath);
        });
        setGifsData(gifs);
      } else {
        console.log('Nenhum GIF encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar GIFs:', error);
    }
  };

  const handleDownload = async (filePath: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado no localStorage');
        return;
      }

      const response = await api.serverGifFileName(token, filePath);

      if (!response) {
        console.error('Erro ao buscar arquivo:', response.statusText);
        return;
      }

      const blob = new Blob([response], { type: 'image/gif' });

      const url = window.URL.createObjectURL(blob);

      // Criar um link de download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'new_gif');
      document.body.appendChild(link);
      link.click();

      // Limpa os recursos usados
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao buscar GIFs:', error);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleVideoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('Token não encontrado no localStorage');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.enviavideo(token, file);
        console.log('Resposta do servidor:', response);
        setResponseMessage(response);
      } catch (error) {
        console.error('Erro ao enviar vídeo:', error);
        setResponseMessage('Erro ao enviar o vídeo');
      }
      fetchGifs();
    }
  };

  return (
    <div className="container">
      <h2>Conversor de Vídeo para GIF</h2>
      <p className="welcome-message">
        Olá {auth.user?.name}, selecione um vídeo para converter em GIF:
      </p>

      <label htmlFor="videoUpload" className="label-wrapper">
        Clique aqui para selecionar um vídeo
        <input
          id="videoUpload"
          type="file"
          accept="video/*"
          onChange={(event: ChangeEvent<HTMLInputElement>) => handleVideoUpload(event)}
          style={{ display: 'none' }}
        />
      </label>
      {responseMessage && <p className="response-message">{responseMessage}</p>}

      <h2>Biblioteca de GIFs</h2>
      <img src={imagePath} alt="" />
      <h1></h1>
      <div className="gif-library">
        <ul className="gif-list">
          {gifsData.map((gif) => (
            <li key={gif.id}>
              <button onClick={() => handleDownload(gif.filePath)}>Download GIF {gif.id}</button>
              <p>Criado em: {gif.createdAt}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handlePreviousPage}>Página Anterior</button>
        <button onClick={handleNextPage}>Próxima Página</button>
      </div>
    </div>
  );
};
