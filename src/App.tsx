import { Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Gifs } from './pages/Gifs';
import { RequireAuth } from './contexts/Auth/RequireAuth';

function App() {
  return (
    <div className="App">
      <header>
        <h1>TESTE</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/gifs">Biblioteca de Gifs</Link>
        </nav>
      </header>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
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
