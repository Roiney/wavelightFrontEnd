import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Gifs } from './pages/Gifs';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Login } from './pages/Login';
import { SignUp } from './pages/Inscricao';
import { useContext } from 'react';
import { AuthContext } from './contexts/Auth/AuthContext';

function App() {
  const auth = useContext(AuthContext);

  const handleLogout = async () => {
    await auth.signout();
    window.location.href = window.location.href;
  };
  return (
    <div className="App">
      <header>
        <h1>Desafio Wavelight</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Inscreva-se</Link>
          {auth.user && <button onClick={handleLogout}>Sair</button>}
        </nav>
      </header>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/gifs"
          element={
            <RequireAuth>
              <Gifs />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
