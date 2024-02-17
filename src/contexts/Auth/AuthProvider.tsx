import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { User } from '../../types/User';
import { useApi } from '../../hooks/useApi';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setuser] = useState<User | null>(null);
  const api = useApi();

  const signin = async (email: string, password: string) => {
    const data = await api.signin(email, password);
    if (data.user && data.acessToken) {
      setuser(data.user);
      return true;
    }
    return false;
  };

  const signout = async () => {
    setuser(null);
  };

  return <AuthContext.Provider value={{ user, signin, signout }}>{children}</AuthContext.Provider>;
};
