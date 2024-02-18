import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useApi } from '../../hooks/useApi';
import './index.css';

export const Gifs = () => {
  const auth = useContext(AuthContext);
  const api = useApi();
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [gifs, setGifs] = useState([]);
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
        const gifList = document.querySelector('.gif-list');

        for (const gif of gifs) {
          const gifFileName = await api.serverGifFileName(token, gif.filePath);
          const listItem = document.createElement('li');
          listItem.textContent = `Nome do arquivo do GIF: ${gifFileName}`;

          if (gifList) {
            gifList.appendChild(listItem);
            console.log('Nome do arquivo do GIF:', gifFileName);
          } else {
            console.log('Nenhum GIF encontrado.');
          }
        }
      } else {
        console.log('Nenhum GIF encontrado.');
      }
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
      <div className="gif-library">
        <ul className="gif-list"></ul>
      </div>

      <div>
        <button onClick={handlePreviousPage}>Página Anterior</button>
        <button onClick={handleNextPage}>Próxima Página</button>
      </div>
    </div>
  );
};
