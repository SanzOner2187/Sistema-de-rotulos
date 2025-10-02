import React, { useState } from "react";
import useRotuloCaja from "./RotuloCaja.js";
import RotuloCajaPdf from "./RotuloCajaPdf.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RotuloCaja = () => {
  const {
    formData,
    errors,
    rotulosGuardados,
    modoEdicion,
    rotuloEnEdicion,
    handleInputChange,
    handleContenidoChange,
    agregarContenido,
    eliminarContenido,
    guardarRotulo,
    limpiarFormulario,
    editarRotulo,
    cancelarEdicion,
    eliminarRotulo,
    validarFormulario,
  } = useRotuloCaja();

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
    RotuloCajaPdf(formData, "descargar");
    MySwal.fire({
      icon: "success",
      title: "PDF generado",
      text: "El rótulo fue descargado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleDescargarTodos = () => {
    const rotulos = JSON.parse(localStorage.getItem("rotulosCaja") || "[]");

    if (!rotulos.length) {
      MySwal.fire({
        icon: "info",
        title: "Sin rótulos",
        text: "No hay rótulos para descargar.",
      });
      return;
    }

    rotulos.forEach((rotulo) => {
      RotuloCajaPdf(rotulo);
    });

    localStorage.removeItem("rotulosCaja");

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
    RotuloCajaPdf(formData, "imprimir");
    MySwal.fire({
      icon: "success",
      title: "PDF enviado a impresión",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleImprimirPDFGuardado = (rotulo) => {
    RotuloCajaPdf(rotulo, "imprimir");
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
          {modoEdicion ? 'Editar Rótulo de Caja' : 'Crear Rótulo de Caja'}
        </h1>
        <div className="formulario-stats">
          <span className="stat-item">
            Rótulos creados: <strong>{rotulosGuardados.length}/20</strong>
          </span>
          <span className="stat-item">
            Caja No: <strong>{formData.noCaja}</strong>
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
                      Caja No: {rotulo.noCaja}
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
                    <p style={{ margin: 0 }}><strong>Sección:</strong> {rotulo.seccion}</p>
                    <p style={{ margin: 0 }}><strong>Subsección:</strong> {rotulo.subseccion}</p>
                    <p style={{ margin: 0 }}><strong>Contenidos:</strong> {rotulo.totalUnidadesAlmacenadas}</p>
                    <p style={{ margin: 0 }}><strong>Fechas:</strong> {rotulo.fechaInicialGeneral} - {rotulo.fechaFinalGeneral}</p>
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
                    onClick={() => RotuloCajaPdf(rotulo)}
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
          <h3 className="seccion-titulo">Clasificación</h3>
          <div className="form-group full-width">
            <label className="form-label">Fondo</label>
            <input
              type="text"
              className="form-input readonly"
              value={formData.fondo}
              readOnly
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sección</label>
              <input
                type="text"
                className={`form-input ${errors.seccion ? 'error' : ''}`}
                value={formData.seccion}
                onChange={(e) => handleInputChange('seccion', e.target.value)}
                placeholder="Ingrese la sección"
                required
              />
              {errors.seccion && <span className="error-message">{errors.seccion}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Subsección</label>
              <input
                type="text"
                className={`form-input ${errors.subseccion ? 'error' : ''}`}
                value={formData.subseccion}
                onChange={(e) => handleInputChange('subseccion', e.target.value)}
                placeholder="Ingrese la subsección"
                required
              />
              {errors.subseccion && <span className="error-message">{errors.subseccion}</span>}
            </div>
          </div>
        </div>

        <div className="form-seccion">
          <div className="seccion-header">
            <h3 className="seccion-titulo">Contenido ({formData.contenido.length})/20 </h3>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={agregarContenido}
              disabled={formData.contenido.length >= 20}
            >
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Contenido
            </button>
          </div>

          <div className="contenido-lista">
            {formData.contenido.map((item, index) => (
              <div key={item.id} className="contenido-item">
                <div className="contenido-header">
                  <span className="contenido-numero">#{item.nroCta}</span>
                  {formData.contenido.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-circle-sm"
                      onClick={() => eliminarContenido(index)}
                    >
                      <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="contenido-form">
                  <div className="form-group">
                    <label className="form-label">Código Serie/Subserie</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`contenido_${index}_codigoSerie`] ? 'error' : ''}`}
                      value={item.codigoSerie}
                      onChange={(e) => handleContenidoChange(index, 'codigoSerie', e.target.value)}
                      placeholder="Código de la serie documental"
                      required
                    />
                    {errors[`contenido_${index}_codigoSerie`] && (
                      <span className="error-message">{errors[`contenido_${index}_codigoSerie`]}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nombre Serie/Subserie</label>
                    <input
                      type="text"
                      className={`form-input ${errors[`contenido_${index}_nombreSerie`] ? 'error' : ''}`}
                      value={item.nombreSerie}
                      onChange={(e) => handleContenidoChange(index, 'nombreSerie', e.target.value)}
                      placeholder="Nombre de la serie documental"
                      required
                    />
                    {errors[`contenido_${index}_nombreSerie`] && (
                      <span className="error-message">{errors[`contenido_${index}_nombreSerie`]}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-seccion">
          <h3 className="seccion-titulo">Fechas Extremas</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Fecha Inicial</label>
              <input
                type="date"
                className={`form-input ${errors.fechaInicialGeneral ? 'error' : ''}`}
                value={formData.fechaInicialGeneral}
                onChange={(e) => handleInputChange('fechaInicialGeneral', e.target.value)}
                required
              />
              {errors.fechaInicialGeneral && <span className="error-message">{errors.fechaInicialGeneral}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Final</label>
              <input
                type="date"
                className={`form-input ${errors.fechaFinalGeneral ? 'error' : ''}`}
                value={formData.fechaFinalGeneral}
                onChange={(e) => handleInputChange('fechaFinalGeneral', e.target.value)}
                required
              />
              {errors.fechaFinalGeneral && <span className="error-message">{errors.fechaFinalGeneral}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Total Unidades Almacenadas</label>
              <input
                type="number"
                className="form-input readonly"
                value={formData.contenido.length}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">No. de Caja</label>
              <input
                type="number"
                className="form-input readonly"
                value={formData.noCaja}
                readOnly
              />
            </div>
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
            disabled={!formData.contenido.length}
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

export default RotuloCaja;