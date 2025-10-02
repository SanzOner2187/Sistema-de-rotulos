import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";

const RotuloCarpetaPdf = async (datos, modo = "descargar") => {
  const carpetasTotal = datos.carpetas || [];
  const carpetas = carpetasTotal.filter(
    (carpeta) => carpeta.nombreSerie?.trim() || carpeta.nombreSubSerie?.trim()
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
        margin-top: 6px;
        padding: 10px;
        border: 1px solid #000;
      }

      .header-left {
        flex: 0 0 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .logo {
        width: 390px;
        height: 100;
      }

      .header-center {
        flex: 0 0 40%;
        text-align: center;
      }

      .header-center .banner {
        background: linear-gradient(90deg, #FFD700 0%, #90EE90 50%, #4169E1 100%);
        padding: 5px;
        border-radius: 20px;
        margin-bottom: 5px;
      }

      .header-center .municipio {
        font-size: 10px;
        font-weight: bold;
      }

      .header-center .nit {
        font-size: 9px;
      }

      .header-right {
        flex: 0 0 30%;
        text-align: right;
        font-size: 10px;
        line-height: 1.6;
      }

      .header-right strong {
        display: block;
        font-size: 11px;
        margin-bottom: 5px;
        border-bottom: 1px solid #000;
        padding-bottom: 3px;
      }

      .info-row {
        border: 1px solid #000;
        padding: 8px;
        margin-bottom: 2px;
        background-color: #f9f9f9;
      }

      .info-row.title {
        background-color: #e0e0e0;
        font-weight: bold;
        text-align: center;
        font-size: 10px;
      }

      .info-row .label {
        font-weight: bold;
        display: inline-block;
        width: 35%;
      }

      .info-row .value {
        display: inline-block;
        width: 63%;
      }

      .dates-section {
        display: flex;
        justify-content: space-between;
        margin-top: 2px;
      }

      .date-box {
        flex: 1;
        border: 1px solid #000;
        padding: 8px;
        margin: 0 2px;
      }

      .date-box .label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
      }

      .footer-section {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        gap: 10px;
      }

      .footer-box {
        flex: 1;
        border: 1px solid #000;
        padding: 10px;
        text-align: center;
      }

      .footer-box .label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
      }

      .page-break {
        page-break-after: always;
      }
    </style>

    <div class="rotulo-container">
      ${carpetas.map((carpeta, index) => `
        <div class="${index > 0 ? 'page-break' : ''}">
          <div class="header">
            <div class="header-left">
              <img src="../../../public/Alcaldia_palermo_logo.png" alt="Logo Alcaldía" class="logo" />
            </div>

            <div class="header-right">
              <strong>ROTULO DE CARPETA</strong>
              <div>Código: ${datos.codigo || "FOR-GP-18"}</div>
              <div>Versión: ${datos.version || "05"}</div>
              <div>Fecha: ${datos.fecha || ""}</div>
              <div>Página No. ${datos.pagina || "1"}</div>
            </div>
          </div>
          
          <div class="info-row">
            <span class="label">CODIGO Y NOMBRE DE LA SERIE DOCUMENTAL:</span>
            <span class="value">${carpeta.nombreSerie || ""}</span>
          </div>

          <div class="info-row">
            <span class="label">NOMBRE DE LA SUBSERIE DOCUMENTAL:</span>
            <span class="value">${carpeta.nombreSubSerie || ""}</span>
          </div>

          <div class="info-row">
            <span class="label">ASUNTO:</span>
            <span class="value">${carpeta.asunto || ""}</span>
          </div>

          <div class="info-row">
            <span class="label">NO. DE FOLIOS:</span>
            <span class="value">1 A ${carpeta.noFolios}</span>
          </div>

          <div class="info-row">
            <span class="label">NO. DE CARPETA:</span>
            <span class="value">1 DE ${carpeta.noCarpeta}</span>
          </div>

          <div class="info-row title">
            FECHAS EXTREMAS:
          </div>

          <div class="dates-section">
            <div class="date-box">
              <span class="label">INICIAL:</span>
              <span>${carpeta.fechaInicial || ""}</span>
            </div>
            <div class="date-box">
              <span class="label">FINAL:</span>
              <span>${carpeta.fechaFinal || ""}</span>
            </div>
          </div>

          <div class="footer-section">
            <div class="footer-box">
              <span class="label">CAJA No.</span>
              <span>${carpeta.noCaja || ""}</span>
            </div>
            <div class="footer-box">
              <span class="label">UBICACIÓN DE CARPETA EN LA CAJA</span>
              <span>${carpeta.ubicacionCarpeta || ""}</span>
            </div>
          </div>
        </div>
      `).join('')}
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

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (carpetas.length > 1) {
      const pageHeight = 297;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    const fileName = `rotulo-carpeta-${carpetas[0]?.ubicacionCarpeta || Date.now()}.pdf`;

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
      text: 'Error al generar el PDF, inténtalo de nuevo más tarde'
    });
    throw error;
  }
};

export default RotuloCarpetaPdf;