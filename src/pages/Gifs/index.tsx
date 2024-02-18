import { useContext } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';

export const Gifs = () => {
  const auth = useContext(AuthContext);
  return (
    <div>
      <h2>Gifs</h2>
      Olá {auth.user?.name}, tudo bem?
    </div>
  );
};
