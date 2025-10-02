import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useRotuloCarpeta = () => {
  const [formData, setFormData] = useState({
    codigo: 'FOR-GP-18',
    version: '05',
    fecha: '',
    pagina: 1,
    
    carpetas: [
      {
        id: 1,
        nombreSerie: '',
        nombreSubSerie: '',
        asunto: '',
        noFolios: '',
        noCarpeta: '',
        fechaInicial: '',
        fechaFinal: '',
        noCaja: '',
        ubicacionCarpeta: 1
      }
    ]
  });

  const [errors, setErrors] = useState({});
  const [rotulosGuardados, setRotulosGuardados] = useState([]);
  
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rotuloEnEdicion, setRotuloEnEdicion] = useState(null);

  useEffect(() => {
    const rotulos = JSON.parse(localStorage.getItem('rotulosCarpeta')) || [];
    const consecutivo = Number(localStorage.getItem('consecutivoCarpeta')) || 0;
    
    setRotulosGuardados(rotulos);
    setFormData(prev => ({
      ...prev,
      carpetas: [
        {
          ...prev.carpetas[0],
          ubicacionCarpeta: consecutivo + 1
        }
      ],
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

  const handleCarpetaChange = (index, field, value) => {
    const newCarpetas = [...formData.carpetas];
    newCarpetas[index] = {
      ...newCarpetas[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      carpetas: newCarpetas
    }));

    if (errors[`carpeta_${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`carpeta_${index}_${field}`]: ''
      }));
    }
  };

  const agregarCarpeta = () => {
    if (formData.carpetas.length >= 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'No se pueden agregar más de 20 carpetas',
      });
      return;
    }

    const consecutivoActual = Number(localStorage.getItem('consecutivoCarpeta')) || 0;
    const nuevaUbicacion = consecutivoActual + formData.carpetas.length + 1;

    const nuevaCarpeta = {
      id: Date.now(),
      nombreSerie: '',
      nombreSubSerie: '',
      asunto: '',
      noFolios: 1,
      noCarpeta: 1,
      fechaInicial: '',
      fechaFinal: '',
      noCaja: '',
      ubicacionCarpeta: nuevaUbicacion
    };

    setFormData(prev => ({
      ...prev,
      carpetas: [...prev.carpetas, nuevaCarpeta]
    }));
  };

  const eliminarCarpeta = (index) => {
    if (formData.carpetas.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'No permitido',
        text: 'Debe mantener al menos una carpeta',
      });
      return;
    }

    const consecutivoActual = Number(localStorage.getItem('consecutivoCarpeta')) || 0;
    
    const newCarpetas = formData.carpetas
      .filter((_, i) => i !== index)
      .map((item, i) => ({
        ...item,
        ubicacionCarpeta: consecutivoActual + i + 1
      }));

    setFormData(prev => ({
      ...prev,
      carpetas: newCarpetas
    }));
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.fecha.trim()) {
      newErrors.fecha = 'La fecha es requerida';
    }

    formData.carpetas.forEach((item, index) => {
      if (!item.nombreSerie.trim()) {
        newErrors[`carpeta_${index}_nombreSerie`] = 'El nombre de serie es requerido';
      }

      if (!item.nombreSubSerie.trim()) {
        newErrors[`carpeta_${index}_nombreSubSerie`] = 'El nombre de subserie es requerido';
      }

      if (!item.asunto.trim()) {
        newErrors[`carpeta_${index}_asunto`] = 'El asunto es requerido';
      }

      if (!item.noFolios || item.noFolios < 1) {
        newErrors[`carpeta_${index}_noFolios`] = 'El número de folios debe ser mayor a 0';
      }

      if (!item.noCarpeta || item.noCarpeta < 1) {
        newErrors[`carpeta_${index}_noCarpeta`] = 'El número de carpeta debe ser mayor a 0';
      }

      if (!item.fechaInicial.trim()) {
        newErrors[`carpeta_${index}_fechaInicial`] = 'La fecha inicial es requerida';
      }

      if (!item.fechaFinal.trim()) {
        newErrors[`carpeta_${index}_fechaFinal`] = 'La fecha final es requerida';
      }

      if (!item.noCaja.trim()) {
        newErrors[`carpeta_${index}_noCaja`] = 'El número de caja es requerido';
      }

      if (item.fechaInicial && item.fechaFinal) {
        const fechaIni = new Date(item.fechaInicial);
        const fechaFin = new Date(item.fechaFinal);
        
        if (fechaFin < fechaIni) {
          newErrors[`carpeta_${index}_fechaFinal`] = 'La fecha final no puede ser menor a la inicial';
        }
      }
    });

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
      fecha: rotuloAEditar.fecha,
      pagina: rotuloAEditar.pagina,
      carpetas: rotuloAEditar.carpetas.map((item, index) => ({
        id: Date.now() + index,
        nombreSerie: item.nombreSerie || '',
        nombreSubSerie: item.nombreSubSerie || '',
        asunto: item.asunto || '',
        noFolios: item.noFolios || 1,
        noCarpeta: item.noCarpeta || 1,
        fechaInicial: item.fechaInicial || '',
        fechaFinal: item.fechaFinal || '',
        noCaja: item.noCaja || '',
        ubicacionCarpeta: item.ubicacionCarpeta
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
        text: 'Se ha alcanzado el límite máximo de 20 rótulos de carpeta',
      });
      return;
    }

    const ultimaUbicacion = formData.carpetas[formData.carpetas.length - 1].ubicacionCarpeta;

    const nuevoRotulo = {
      id: Date.now(),
      ...formData,
      totalCarpetas: formData.carpetas.length,
      fechaCreacion: new Date().toISOString()
    };

    const nuevosRotulos = [...rotulosGuardados, nuevoRotulo];
    localStorage.setItem('rotulosCarpeta', JSON.stringify(nuevosRotulos));
    localStorage.setItem('consecutivoCarpeta', String(ultimaUbicacion));

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
      totalCarpetas: formData.carpetas.length,
      fechaModificacion: new Date().toISOString()
    };

    const nuevosRotulos = rotulosGuardados.map(rotulo => 
      rotulo.id === rotuloEnEdicion.id ? rotuloActualizado : rotulo
    );

    localStorage.setItem('rotulosCarpeta', JSON.stringify(nuevosRotulos));
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
    const consecutivoActual = Number(localStorage.getItem('consecutivoCarpeta')) || 0;
    
    setFormData({
      codigo: 'FOR-GP-18',
      version: '05',
      fecha: new Date().toISOString().split('T')[0],
      pagina: 1,
      carpetas: [
        {
          id: 1,
          nombreSerie: '',
          nombreSubSerie: '',
          asunto: '',
          noFolios: 1,
          noCarpeta: 1,
          fechaInicial: '',
          fechaFinal: '',
          noCaja: '',
          ubicacionCarpeta: consecutivoActual + 1
        }
      ]
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
    localStorage.setItem('rotulosCarpeta', JSON.stringify(nuevosRotulos));
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
    handleCarpetaChange,
    agregarCarpeta,
    eliminarCarpeta,
    
    validarFormulario,
    guardarRotulo,
    limpiarFormulario,
    
    editarRotulo,
    cancelarEdicion,
    
    obtenerRotuloPorId,
    eliminarRotulo
  };
};

export default useRotuloCarpeta;