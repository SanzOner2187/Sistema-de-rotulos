import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useRotuloCaja = () => {
  const [formData, setFormData] = useState({
    codigo: 'FOR-GF-19',
    version: '05',
    fondo: 'ALCALDÍA MUNICIPIO DE PALERMO',
    
    fecha: '',
    pagina: 1,
    seccion: 'SECRETARIA GENERAL Y DE PARTICIPACIÓN COMUNITARIA',
    subseccion: 'COMISARIA DE FAMILIA',
    noCaja: 0,
    
    contenido: [
      {
        id: 1,
        nroCta: 1,
        codigoSerie: '',
        nombreSerie: ''
      }
    ],
    
    fechaInicialGeneral: '',
    fechaFinalGeneral: ''
  });

  const [errors, setErrors] = useState({});
  const [rotulosGuardados, setRotulosGuardados] = useState([]);
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rotuloEnEdicion, setRotuloEnEdicion] = useState(null);

  useEffect(() => {
    const rotulos = JSON.parse(localStorage.getItem('rotulosCaja')) || [];
    const consecutivo = Number(localStorage.getItem('consecutivoCaja')) || 0;
    
    setRotulosGuardados(rotulos);
    setFormData(prev => ({
      ...prev,
      noCaja: consecutivo + 1,
      fecha: new Date().toISOString().split('T')[0] 
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleContenidoChange = (index, field, value) => {
    const newContenido = [...formData.contenido];
    newContenido[index] = {
      ...newContenido[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      contenido: newContenido
    }));

    if (errors[`contenido_${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`contenido_${index}_${field}`]: ''
      }));
    }
  };

  const agregarContenido = () => {
    if (formData.contenido.length >= 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'No se pueden agregar más de 20 elementos de contenido',
      });
      return;
    }

    const nuevoNroCta = formData.contenido.length + 1;
    const nuevoContenido = {
      id: Date.now(),
      nroCta: nuevoNroCta,
      codigoSerie: '',
      nombreSerie: ''
    };

    setFormData(prev => ({
      ...prev,
      contenido: [...prev.contenido, nuevoContenido]
    }));
  };

  const eliminarContenido = (index) => {
    if (formData.contenido.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'No permitido',
        text: 'Debe mantener al menos un elemento de contenido',
      });
      return;
    }

    const newContenido = formData.contenido
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        nroCta: i + 1
      }));

    setFormData(prev => ({
      ...prev,
      contenido: newContenido
    }));
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.fecha.trim()) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.seccion.trim()) {
      newErrors.seccion = 'La sección es requerida';
    }

    if (!formData.subseccion.trim()) {
      newErrors.subseccion = 'La subsección es requerida';
    }

    formData.contenido.forEach((item, index) => {
      if (!item.codigoSerie.trim()) {
        newErrors[`contenido_${index}_codigoSerie`] = 'El código de serie es requerido';
      }

      if (!item.nombreSerie.trim()) {
        newErrors[`contenido_${index}_nombreSerie`] = 'El nombre de serie es requerido';
      }
    });

    if (!formData.fechaInicialGeneral.trim()) {
      newErrors.fechaInicialGeneral = 'La fecha inicial general es requerida';
    }

    if (!formData.fechaFinalGeneral.trim()) {
      newErrors.fechaFinalGeneral = 'La fecha final general es requerida';
    }

    if (formData.fechaInicialGeneral && formData.fechaFinalGeneral) {
      const fechaIni = new Date(formData.fechaInicialGeneral);
      const fechaFin = new Date(formData.fechaFinalGeneral);
      
      if (fechaFin < fechaIni) {
        newErrors.fechaFinalGeneral = 'La fecha final no puede ser menor a la inicial';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const editarRotulo = (id) => {
    const rotuloAEditar = rotulosGuardados.find(rotulo => rotulo.id === id);
    
    if (!rotuloAEditar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Rótulo no encontrado',
      });
      return;
    }
    
    const datosParaEditar = {
      codigo: rotuloAEditar.codigo,
      version: rotuloAEditar.version,
      fondo: rotuloAEditar.fondo,
      fecha: rotuloAEditar.fecha,
      pagina: rotuloAEditar.pagina,
      seccion: rotuloAEditar.seccion,
      subseccion: rotuloAEditar.subseccion,
      noCaja: rotuloAEditar.noCaja,
      fechaInicialGeneral: rotuloAEditar.fechaInicialGeneral,
      fechaFinalGeneral: rotuloAEditar.fechaFinalGeneral,
      contenido: rotuloAEditar.contenido.map((item, index) => ({
        id: Date.now() + index,
        nroCta: index + 1,
        codigoSerie: item.codigoSerie || '',
        nombreSerie: item.nombreSerie || ''
      }))
    };

    setFormData(datosParaEditar);
    setModoEdicion(true);
    setRotuloEnEdicion(rotuloAEditar);
    setErrors({});
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setRotuloEnEdicion(null);
    limpiarFormulario();
  };

  const guardarRotulo = () => {
    if (!validarFormulario()) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, corrija los errores en el formulario',
      });
      return;
    }

    if (modoEdicion) {
      actualizarRotulo();
    } else {
      crearNuevoRotulo();
    }
  };

  const crearNuevoRotulo = () => {
    if (rotulosGuardados.length >= 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Se ha alcanzado el límite máximo de 20 rótulos de caja',
      });
      return;
    }

    const nuevoRotulo = {
      id: Date.now(),
      ...formData,
      totalUnidadesAlmacenadas: formData.contenido.length,
      fechaCreacion: new Date().toISOString()
    };

    const nuevosRotulos = [...rotulosGuardados, nuevoRotulo];
    localStorage.setItem('rotulosCaja', JSON.stringify(nuevosRotulos));
    localStorage.setItem('consecutivoCaja', String(formData.noCaja));

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Rótulo guardado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
    
    limpiarFormulario();
    setRotulosGuardados(nuevosRotulos);
  };

  const actualizarRotulo = () => {
    const rotuloActualizado = {
      ...rotuloEnEdicion,
      ...formData,
      totalUnidadesAlmacenadas: formData.contenido.length,
      fechaModificacion: new Date().toISOString()
    };

    const nuevosRotulos = rotulosGuardados.map(rotulo => 
      rotulo.id === rotuloEnEdicion.id ? rotuloActualizado : rotulo
    );

    localStorage.setItem('rotulosCaja', JSON.stringify(nuevosRotulos));
    setRotulosGuardados(nuevosRotulos);

    Swal.fire({
      icon: 'success',
      title: 'Actualizado',
      text: 'Rótulo actualizado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });

    setModoEdicion(false);
    setRotuloEnEdicion(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    const consecutivoActual = Number(localStorage.getItem('consecutivoCaja')) || 0;
    
    setFormData({
      codigo: 'FOR-GF-19',
      version: '05',
      fondo: 'ALCALDÍA MUNICIPIO DE PALERMO',
      fecha: new Date().toISOString().split('T')[0],
      pagina: 1,
      seccion: 'SECRETARIA GENERAL Y DE PARTICIPACIÓN COMUNITARIA',
      subseccion: 'COMISARIA DE FAMILIA',
      noCaja: consecutivoActual + 1,
      contenido: [
        {
          id: 1,
          nroCta: 1,
          codigoSerie: '',
          nombreSerie: ''
        }
      ],
      fechaInicialGeneral: '',
      fechaFinalGeneral: ''
    });
    
    setErrors({});
  };

  const obtenerRotuloPorId = (id) => {
    return rotulosGuardados.find(rotulo => rotulo.id === id);
  };

  const eliminarRotulo = (id) => {
    if (modoEdicion && rotuloEnEdicion && rotuloEnEdicion.id === id) {
      cancelarEdicion();
    }

    const nuevosRotulos = rotulosGuardados.filter(rotulo => rotulo.id !== id);
    localStorage.setItem('rotulosCaja', JSON.stringify(nuevosRotulos));
    setRotulosGuardados(nuevosRotulos);
    
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'Rótulo eliminado exitosamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return {
    formData,
    errors,
    rotulosGuardados,
    modoEdicion,
    rotuloEnEdicion,
    
    handleInputChange,
    handleContenidoChange,
    agregarContenido,
    eliminarContenido,
    
    validarFormulario,
    guardarRotulo,
    limpiarFormulario,
    
    editarRotulo,
    cancelarEdicion,
    
    obtenerRotuloPorId,
    eliminarRotulo
  };
};

export default useRotuloCaja;
