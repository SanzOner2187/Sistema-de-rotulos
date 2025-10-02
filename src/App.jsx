import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RotuloCaja from './components/Caja/RotuloCaja.jsx';
import RotuloCarpeta from './components/Carpeta/RotuloCarpeta.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/Caja" 
            element={
              <>
                <h1 className="main-title">Sistema de Rótulos - Caja</h1>
                <div className="form-container">
                  <RotuloCaja/>
                </div>
              </>
            } 
          />

          <Route 
            path="/Carpeta" 
            element={
              <>
                <h1 className="main-title">Sistema de Rótulos - Carpeta</h1>
                <div className="form-container">
                  <RotuloCarpeta/>
                </div>
              </>
            } 
          />
        </Routes>

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
