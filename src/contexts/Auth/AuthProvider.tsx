import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useApi } from '../../hooks/useApi';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setuser] = useState<User | null>(null);
  const api = useApi();

  const signin = async (email: string, password: string) => {
    const data = await api.signin(email, password);
    if (data.user && data.accessToken) {
      setToken(data.accessToken);
      setuser(data.user);
      return true;
    }
    return false;
  };

  const setToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data = await api.signup(name, email, password);

      if (data && data.id && data.name && data.email && data.createdAt && data.updatedAt) {
        console.log('Cadastro realizado com sucesso:', data);
        return true;
      } else {
        throw new Error('Dados de cadastro incompletos.');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error.message);

      if (error.response && error.response.data && error.response.data.message) {
        alert('Erro ao cadastrar: ' + error.response.data.message);
      } else {
        alert('Erro ao cadastrar. Por favor, tente novamente mais tarde.');
      }

      return false;
    }
  };

  const signout = async () => {
    setuser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
