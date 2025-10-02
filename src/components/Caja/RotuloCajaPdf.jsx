import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

const RotuloCajaPdf = async (datos, modo = "descargar") => {

  const contenidoTotal = datos.contenido || [];
  const totalUnidades = contenidoTotal.length;

  const contenido = contenidoTotal.filter(
    (item) => item.codigoSerie?.trim() || item.nombreSerie?.trim()
  );

  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "210mm";
  container.style.padding = "10mm";
  container.style.backgroundColor = "white";
  container.style.fontFamily = "Arial, sans-serif";

  container.innerHTML = `
    <style>
      .rotulo-container {
        width: 100%;
        font-size: 11px;
        color: #000;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        border: 1px solid #000;
        padding: 8px;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .logo {
        width: 390px;
        height: 100px;
      }
      .municipio {
        text-align: center;
      }
      .municipio-nombre {
        font-size: 10px;
        font-weight: bold;
      }
      .municipio-title {
        font-size: 16px;
        font-weight: bold;
        margin: 2px 0;
      }
      .nit {
        font-size: 9px;
      }
      .header-right {
        text-align: right;
        border-left: 1px solid #000;
        padding-left: 15px;
      }
      .header-right div {
        margin: 2px 0;
        font-size: 10px;
        border-bottom: 1px solid #000;
        padding: 2px 5px;
        min-width: 150px;
      }
      .info-section {
        border: 1px solid #000;
        margin-bottom: 10px;
      }
      .info-row {
        display: flex;
        border-bottom: 1px solid #000;
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        font-weight: bold;
        padding: 5px 8px;
        background-color: #ffffffff;
        border-right: 1px solid #000;
        width: 120px;
      }
      .info-value {
        padding: 5px 8px;
        flex: 1;
      }
      .table-header {
        background-color: #f0f0f0;
        border: 1px solid #000;
        text-align: center;
        font-weight: bold;
        padding: 8px 0;
      }
      .content-table {
        width: 100%;
        border-collapse: collapse;
        border-top: none;
      }
      .content-table td {
        border: 0.5px solid #000;
        padding: 6px 8px;
        font-size: 10px;
      }
      .col-codigo {
        width: 15%;
        text-align: center;
      }
      .col-nro {
        width: 10%;
        text-align: center;
      }
      .col-nombre {
        width: 75%;
      }
      .fechas-section {
        border: 1px solid #000;
        margin: 10px 0;
      }
      .fechas-row {
        display: flex;
        border-bottom: 1px solid #000;
      }
      .fechas-row:last-child {
        border-bottom: none;
      }
      .fechas-label {
        font-weight: bold;
        padding: 5px 8px;
        width: 150px;
        border-right: 1px solid #000;
      }
      .fechas-value {
        padding: 5px 8px;
        flex: 1;
      }
      .fechas-inline {
        display: inline;
      }
      .caja-box {
        border: 2px solid #000;
        margin-top: 15px;
        min-height: 120px;
      }
      .caja-header {
        background-color: #f0f0f0;
        border-bottom: 2px solid #000;
        padding: 8px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
      }
      .caja-content {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
      }
      .caja-number {
        font-size: 96px;
        font-weight: bold;
      }
    </style>
    
    <div class="rotulo-container">
      <div class="header">
        <div class="header-left">
          <img src="../../../public/Alcaldia_palermo_logo.png" alt="Logo Alcaldía" class="logo" />
        </div>
        <div class="header-right">
          <div><strong>ROTULO DE CAJA</strong></div>
          <div>Código: ${datos.codigo || "FOR-GR-15"}</div>
          <div>Versión: ${datos.version || "05"}</div>
          <div>Fecha: ${datos.fecha || ""}</div>
          <div>Página No. ${datos.pagina || "1"}</div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <div class="info-label">FONDO:</div>
          <div class="info-value"><b>${datos.fondo || "ALCALDIA MUNICIPIO DE PALERMO"}</b></div>
        </div>
        <div class="info-row">
          <div class="info-label">SECCIÓN:</div>
          <div class="info-value">${datos.seccion || "SECRETARIA GENERAL Y DE PARTICIPACIÓN COMUNITARIA"}</div>
        </div>
        <div class="info-row">
          <div class="info-label">SUBSECCIÓN:</div>
          <div class="info-value">${datos.subseccion || "COMISARIA DE FAMILIA"}</div>
        </div>
      </div>

      <div class="table-header">CONTENIDO</div>
      <table class="content-table">
        <thead>
          <tr>
            <td class="col-codigo" style="font-weight: bold; background-color: #bad6b6ff;">CÓDIGO SERIE O<br/>SUBSERIE<br/>DOCUMENTAL</td>
            <td class="col-nro" style="font-weight: bold; background-color: #bad6b6ff;">NRO.<br/>CTA</td>
            <td class="col-nombre" style="font-weight: bold; background-color: #bad6b6ff;">NOMBRE DE LA SERIE O SUBSERIE DOCUMENTAL</td>
          </tr>
        </thead>
        <tbody>
          ${contenido.map((item, index) => `
            <tr>
              <td class="col-codigo">${item.codigoSerie || ""}</td>
              <td class="col-nro">${item.nroCta || index + 1}</td>
              <td class="col-nombre">${item.nombreSerie || ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="fechas-section">
        <div class="fechas-row">
          <div class="fechas-label">FECHAS EXTREMAS:</div>
          <div class="fechas-value">
            <b>Inicial:</b> ${datos.fechaInicialGeneral || ""} &nbsp;&nbsp;&nbsp; 
            <b>Final:</b> ${datos.fechaFinalGeneral || ""}
          </div>
        </div>
        <div class="fechas-row">
          <div class="fechas-label">
            TOTAL DE UNIDADES<br/>ALMACENADAS<br/>No DE CARPETAS
          </div>
          <div class="fechas-value">${totalUnidades}</div>
        </div>
      </div>
      <div class="caja-box">
        <div class="caja-header">No. De CAJA</div>
        <div class="caja-content">
          <div class="caja-number">${datos.noCaja || ""}</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("../../../public/Alcaldia_palermo_logo.png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const fileName = `rotulo-caja-${datos.noCaja || ""}.pdf`;

    if (modo === "descargar") {
      pdf.save(fileName);
    } else if (modo === "imprimir") {
      const pdfBlob = pdf.output("bloburl");
      const win = window.open(pdfBlob);
      if (win) {
        win.onload = () => {
          win.print();
        };
      }
    }
  } catch (error) {
    document.body.removeChild(container);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al general el PDF, intentalo de nuevo más tarde'
    })
    throw error;
  }
};

export default RotuloCajaPdf;