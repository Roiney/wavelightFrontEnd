import React, { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import './index.css';

export const SignUp = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleNameInput = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordsMatch(event.target.value === confirmPassword);
  };

  const handleConfirmPasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);

    setPasswordsMatch(event.target.value === password);
  };

  const handleSignUp = async () => {
    if (name && email && password) {
      const isSingUp = await auth.signup(name, email, password);
      if (isSingUp) {
        navigate('/login');
      } else {
        alert('Não deu certo.');
      }
    }
  };
  return (
    <div>
      <h1>Sign Up</h1>
      <input type="text" value={name} onChange={handleNameInput} placeholder="Digite seu nome" />
      <input
        type="text"
        value={email}
        onChange={handleEmailInput}
        placeholder="Digite seu e-mail"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordInput}
        placeholder="Digite sua senha"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={handleConfirmPasswordInput}
        placeholder="Confirme sua senha"
      />
      {!passwordsMatch && <p style={{ color: 'red' }}>As senhas não coincidem</p>}
      <button onClick={handleSignUp} disabled={!passwordsMatch}>
        Inscrever-se
      </button>
    </div>
  );
};
