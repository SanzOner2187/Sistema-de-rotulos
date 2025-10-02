import React, { useState } from "react";
import useRotuloCarpeta from "./RotuloCarpeta";
import RotuloCarpetaPdf from "./RotuloCarpetaPdf.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RotuloCarpeta = () => {
  const {
    formData,
    errors,
    rotulosGuardados,
    modoEdicion,
    rotuloEnEdicion,
    handleInputChange,
    handleCarpetaChange,
    agregarCarpeta,
    eliminarCarpeta,
    guardarRotulo,
    limpiarFormulario,
    editarRotulo,
    cancelarEdicion,
    eliminarRotulo,
    validarFormulario,
  } = useRotuloCarpeta();

  const [mostrarLista, setMostrarLista] = useState(false);

  const navigate = useNavigate();

  const toggleLista = () => {
    setMostrarLista(!mostrarLista);
  };

  const handleDescargaPDF = () => {
    if (!validarFormulario()) {
      MySwal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos antes de generar el PDF.",
      });
      return;
    }
    RotuloCarpetaPdf(formData, "descargar");
    MySwal.fire({
      icon: "success",
      title: "PDF generado",
      text: "El rótulo fue descargado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleDescargarTodos = () => {
    const rotulos = JSON.parse(localStorage.getItem("rotulosCarpeta") || "[]");

    if (!rotulos.length) {
      MySwal.fire({
        icon: "info",
        title: "Sin rótulos",
        text: "No hay rótulos para descargar.",
      });
      return;
    }

    rotulos.forEach((rotulo) => {
      RotuloCarpetaPdf(rotulo);
    });

    localStorage.removeItem("rotulosCarpeta");

    MySwal.fire({
      icon: "success",
      title: "Descarga completada",
      text: "Todos los rótulos han sido descargados y se reinició el contador.",
      timer: 2500,
      showConfirmButton: false,
    }).then(() => {
      window.dispatchEvent(new Event("storage"));
      window.location.reload();
    });
  };

  const handleImprimirPDF = () => {
    if (!validarFormulario()) {
      MySwal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos antes de generar el PDF.",
      });
      return;
    }
    RotuloCarpetaPdf(formData, "imprimir");
    MySwal.fire({
      icon: "success",
      title: "PDF enviado a impresión",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleImprimirPDFGuardado = (rotulo) => {
    RotuloCarpetaPdf(rotulo, "imprimir");
    MySwal.fire({
      icon: "success",
      title: "PDF enviado a impresión",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <div className="formulario-rotulo">
      <div className="formulario-header">
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/')}
        >
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </button>
        <h1 className="formulario-titulo">
          {modoEdicion ? 'Editar Rótulo de Carpeta' : 'Crear Rótulo de Carpeta'}
        </h1>
        <div className="formulario-stats">
          <span className="stat-item">
            Rótulos creados: <strong>{rotulosGuardados.length}/20</strong>
          </span>
          <span className="stat-item">
            Ubicación: <strong>{formData.carpetas[0]?.ubicacionCarpeta || 1}</strong>
          </span>
          {modoEdicion && (
            <span className="modo-edicion">
              <svg className="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editando
            </span>
          )}
        </div>
      </div>

      {rotulosGuardados.length > 0 && (
        <div className="lista-toggle">
          <button
            className="btn btn-ghost btn-sm"
            onClick={toggleLista}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mostrarLista ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
            </svg>
            {mostrarLista ? 'Ocultar' : 'Ver'} Rótulos Guardados ({rotulosGuardados.length})
          </button>
        </div>
      )}

      {mostrarLista && (
        <div className="form-seccion-edit">
          <h3 className="seccion-titulo">Rótulos Guardados</h3>
          <div className="contenido-lista">
            {rotulosGuardados.map((rotulo) => (
              <div
                key={rotulo.id}
                className={`rotulo-item ${modoEdicion && rotuloEnEdicion?.id === rotulo.id ? 'en-edicion' : ''}`}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--color-gray-900)', fontSize: '1rem' }}>
                      Carpeta Nro: {rotulo.carpetas[rotulo.carpetas.length - 1]?.ubicacionCarpeta}
                    </strong>
                    <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginLeft: '1rem' }}>
                      Creado: {new Date(rotulo.fechaCreacion).toLocaleDateString()}
                    </span>
                    {rotulo.fechaModificacion && (
                      <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                        | Modificado: {new Date(rotulo.fechaModificacion).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    <p style={{ margin: 0 }}><strong>Fecha:</strong> {rotulo.fecha}</p>
                    <p style={{ margin: 0 }}><strong>Total Carpetas:</strong> {rotulo.totalCarpetas}</p>
                    <p style={{ margin: 0 }}><strong>Primera Ubicación:</strong> {rotulo.carpetas[0]?.ubicacionCarpeta}</p>
                    <p style={{ margin: 0 }}><strong>Última Ubicación:</strong> {rotulo.carpetas[rotulo.carpetas.length - 1]?.ubicacionCarpeta}</p>
                  </div>
                </div>
                <div className="rotulo-acciones" style={{ flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => editarRotulo(rotulo.id)}
                    disabled={modoEdicion}
                  >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleImprimirPDFGuardado(rotulo)}
                  >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => RotuloCarpetaPdf(rotulo)}
                  >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      MySwal.fire({
                        title: "¿Está seguro?",
                        text: "Esta acción eliminará el rótulo permanentemente.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          eliminarRotulo(rotulo.id);
                          MySwal.fire({
                            icon: "success",
                            title: "Eliminado",
                            text: "El rótulo fue eliminado correctamente.",
                            timer: 2000,
                            showConfirmButton: false,
                          });
                        }
                      });
                    }}
                    disabled={modoEdicion && rotuloEnEdicion?.id === rotulo.id}
                  >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="formulario-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-seccion">
          <h3 className="seccion-titulo">Información General</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Código</label>
              <input
                type="text"
                className="form-input readonly"
                value={formData.codigo}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Versión</label>
              <input
                type="text"
                className="form-input readonly"
                value={formData.version}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className={`form-input ${errors.fecha ? 'error' : ''}`}
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                required
              />
              {errors.fecha && <span className="error-message">{errors.fecha}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Página</label>
              <input
                type="number"
                className="form-input"
                value={formData.pagina}
                onChange={(e) => handleInputChange('pagina', e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="form-seccion">
          <div className="seccion-header">
            <h3 className="seccion-titulo">Carpetas ({formData.carpetas.length}/20)</h3>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={agregarCarpeta}
              disabled={formData.carpetas.length >= 20}
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Carpeta
            </button>
          </div>

          <div className="contenido-lista">
            {formData.carpetas.map((carpeta, index) => (
              <div key={carpeta.id} className="contenido-item">
                <div className="contenido-header">
                  <span className="contenido-numero">Ubicación: #{carpeta.ubicacionCarpeta}</span>
                  {formData.carpetas.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-circle-sm"
                      onClick={() => eliminarCarpeta(index)}
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="contenido-form">
                  <div className="form-group">
                    <label className="form-label">Nombre Serie</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`carpeta_${index}_nombreSerie`] ? 'error' : ''}`}
                      value={carpeta.nombreSerie}
                      onChange={(e) => handleCarpetaChange(index, 'nombreSerie', e.target.value)}
                      placeholder="Ingrese el nombre de la serie"
                      required
                    />
                    {errors[`carpeta_${index}_nombreSerie`] && (
                      <span className="error-message">{errors[`carpeta_${index}_nombreSerie`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nombre Subserie</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`carpeta_${index}_nombreSubSerie`] ? 'error' : ''}`}
                      value={carpeta.nombreSubSerie}
                      onChange={(e) => handleCarpetaChange(index, 'nombreSubSerie', e.target.value)}
                      placeholder="Ingrese el nombre de la subserie"
                      required
                    />
                    {errors[`carpeta_${index}_nombreSubSerie`] && (
                      <span className="error-message">{errors[`carpeta_${index}_nombreSubSerie`]}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Asunto</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`carpeta_${index}_asunto`] ? 'error' : ''}`}
                      value={carpeta.asunto}
                      onChange={(e) => handleCarpetaChange(index, 'asunto', e.target.value)}
                      placeholder="Ingrese el asunto"
                      required
                    />
                    {errors[`carpeta_${index}_asunto`] && (
                      <span className="error-message">{errors[`carpeta_${index}_asunto`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">No. Folios</label>
                    <input
                      type="number"
                      className={`form-input ${errors[`carpeta_${index}_noFolios`] ? 'error' : ''}`}
                      value={carpeta.noFolios}
                      placeholder="Desde 1 a"
                      onChange={(e) => handleCarpetaChange(index, 'noFolios', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                    />
                    {errors[`carpeta_${index}_noFolios`] && (
                      <span className="error-message">{errors[`carpeta_${index}_noFolios`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">No. Carpeta</label>
                    <input
                      type="number"
                      className={`form-input ${errors[`carpeta_${index}_noCarpeta`] ? 'error' : ''}`}
                      value={carpeta.noCarpeta}
                      placeholder="Desde 1 a"
                      onChange={(e) => handleCarpetaChange(index, 'noCarpeta', parseInt(e.target.value) || 1)}
                      min="1"
                      required
                    />
                    {errors[`carpeta_${index}_noCarpeta`] && (
                      <span className="error-message">{errors[`carpeta_${index}_noCarpeta`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha Inicial</label>
                    <input
                      type="date"
                      className={`form-input ${errors[`carpeta_${index}_fechaInicial`] ? 'error' : ''}`}
                      value={carpeta.fechaInicial}
                      onChange={(e) => handleCarpetaChange(index, 'fechaInicial', e.target.value)}
                      required
                    />
                    {errors[`carpeta_${index}_fechaInicial`] && (
                      <span className="error-message">{errors[`carpeta_${index}_fechaInicial`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha Final</label>
                    <input
                      type="date"
                      className={`form-input ${errors[`carpeta_${index}_fechaFinal`] ? 'error' : ''}`}
                      value={carpeta.fechaFinal}
                      onChange={(e) => handleCarpetaChange(index, 'fechaFinal', e.target.value)}
                      required
                    />
                    {errors[`carpeta_${index}_fechaFinal`] && (
                      <span className="error-message">{errors[`carpeta_${index}_fechaFinal`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">No. Caja</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`carpeta_${index}_noCaja`] ? 'error' : ''}`}
                      value={carpeta.noCaja}
                      onChange={(e) => handleCarpetaChange(index, 'noCaja', e.target.value)}
                      placeholder="Ingrese el número de caja"
                      required
                    />
                    {errors[`carpeta_${index}_noCaja`] && (
                      <span className="error-message">{errors[`carpeta_${index}_noCaja`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ubicación Carpeta</label>
                    <input
                      type="number"
                      className="form-input readonly"
                      value={carpeta.ubicacionCarpeta}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          {modoEdicion && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelarEdicion}
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar Edición
            </button>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            onClick={limpiarFormulario}
            disabled={modoEdicion}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar Formulario
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={guardarRotulo}
            disabled={!modoEdicion && rotulosGuardados.length >= 20}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {modoEdicion ? 'Actualizar Rótulo' : 'Guardar Rótulo'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleImprimirPDF}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleDescargaPDF}
            disabled={!formData.carpetas.length}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDescargarTodos}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Todos
          </button>
        </div>
      </form>
    </div>
  );
};

export default RotuloCarpeta;