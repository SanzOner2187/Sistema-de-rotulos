import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    carpetas: 0,
    cajas: 0,
    consecutivoCarpeta: 0,
    consecutivoCaja: 0,
  });

  useEffect(() => {
    const rotulosCarpeta = JSON.parse(localStorage.getItem("rotulosCarpeta")) || [];
    const rotulosCaja = JSON.parse(localStorage.getItem("rotulosCaja")) || [];
    const consecutivoCarpeta = localStorage.getItem("consecutivoCarpeta") || 0;
    const consecutivoCaja = localStorage.getItem("consecutivoCaja") || 0;

    setStats({
      carpetas: rotulosCarpeta.length,
      cajas: rotulosCaja.length,
      consecutivoCarpeta: Number(consecutivoCarpeta),
      consecutivoCaja: Number(consecutivoCaja),
    });
  }, []);

  const handleResetConsecutive = async (type) => {
    const { value: newConsecutive } = await MySwal.fire({
      title: `Ingrese el nuevo consecutivo para ${type}:`,
      input: "number",
      inputAttributes: {
        min: 1,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (newConsecutive && !isNaN(newConsecutive) && Number(newConsecutive) > 0) {
      localStorage.setItem(`consecutivo${type}`, newConsecutive);
      setStats((prev) => ({
        ...prev,
        [`consecutivo${type}`]: Number(newConsecutive),
      }));

      MySwal.fire({
        icon: "success",
        title: `Consecutivo de ${type} actualizado`,
        text: `Nuevo valor: ${newConsecutive}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else if (newConsecutive !== undefined) {
      MySwal.fire({
        icon: "error",
        title: "Número inválido",
        text: "Debe ingresar un número mayor a 0",
      });
    }
  };

  const handleClearData = (type) => {
    MySwal.fire({
      title: `¿Está seguro de eliminar todos los rótulos de ${type}?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(`rotulos${type}`);
        localStorage.removeItem(`consecutivo${type}`);
        setStats((prev) => ({
          ...prev,
          [type.toLowerCase()]: 0,
          [`consecutivo${type}`]: 0,
        }));

        MySwal.fire({
          icon: "success",
          title: `Datos de ${type} eliminados exitosamente`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Sistema de Rótulos</h1>
        <p className="home-subtitle">
          Alcaldía Municipio de Palermo - Secretaría General y de Participación Comunitaria
        </p>
      </header>

      <div className="stats-container">
        <div className="stats-card">
          <h3 className="stats-title carpeta">Rótulos de Carpeta</h3>
          <div className="stats-info">
            <p><span className="stats-label">Rótulos creados:</span> {stats.carpetas}/20</p>
            <p><span className="stats-label">Próximo consecutivo:</span> {stats.consecutivoCarpeta}</p>
          </div>
          <div className="stats-buttons">
            <button
              onClick={() => handleResetConsecutive('Carpeta')}
              className="btn btn-warning btn-sm"
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cambiar Consecutivo
            </button>
            <button
              onClick={() => handleClearData('Carpeta')}
              className="btn btn-danger btn-sm"
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar Datos
            </button>
          </div>
        </div>

        <div className="stats-card">
          <h3 className="stats-title caja">Rótulos de Caja</h3>
          <div className="stats-info">
            <p><span className="stats-label">Rótulos creados:</span> {stats.cajas}/20</p>
            <p><span className="stats-label">Próximo consecutivo:</span> {stats.consecutivoCaja}</p>
          </div>
          <div className="stats-buttons">
            <button
              onClick={() => handleResetConsecutive('Caja')}
              className="btn btn-warning btn-sm"
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Cambiar Consecutivo
            </button>
            <button
              onClick={() => handleClearData('Caja')}
              className="btn btn-danger btn-sm"
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar Datos
            </button>
          </div>
        </div>
      </div>

      <div className="modules-container">
        <button
          onClick={() => navigate('/carpeta')}
          className="module-card carpeta"
        >
          <div className="module-icon">
            <svg className="icon-module" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="module-title">Rótulo Carpeta</h3>
          <p className="module-description">
            Crear rótulos para carpetas individuales con numeración automática
          </p>
          <div className="module-counter">
            {stats.carpetas}/20 rótulos creados
          </div>
        </button>

        <button
          onClick={() => navigate('/Caja')}
          className="module-card caja"
        >
          <div className="module-icon">
            <svg className="icon-module" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="module-title">Rótulo Caja</h3>
          <p className="module-description">
            Crear rótulos para cajas con múltiples números de cuenta
          </p>
          <div className="module-counter">
            {stats.cajas}/20 rótulos creados
          </div>
        </button>
      </div>

      <footer className="home-footer">
        <p>Sistema de Gestión de Rótulos v1.0</p>
      </footer>
    </div>
  );
}


export default Home;