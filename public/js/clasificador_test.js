document.addEventListener("DOMContentLoaded", async () => {
  const pdfSelect = document.getElementById("pdfSelect");
  const topicInput = document.getElementById("topicInput");
  const procesarBtn = document.getElementById("procesarBtn");
  const resultadosCards = document.getElementById("resultadosCards");
  const sinResultados = document.getElementById("sinResultados");


  try {
    const res = await fetch("/api/lista-pdfs");
    const archivos = await res.json();
    archivos.forEach(nombre => {
      const opt = document.createElement("option");
      opt.value = nombre;
      opt.textContent = nombre;
      pdfSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error al cargar PDFs:", err);
  }


  procesarBtn.addEventListener("click", async () => {
    const archivo = pdfSelect.value;
    const temas = topicInput.value.trim();

    resultadosCards.innerHTML = "";
    resultadosCards.style.display = "none";
    sinResultados.style.display = "none";

    if (!archivo || !temas) {
      alert("Debes seleccionar un archivo y al menos un tema.");
      return;
    }

    try {
      const res = await fetch("/api/procesar-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archivo, temas })
      });

      const datos = await res.json();

      if (!Array.isArray(datos) || datos.length === 0) {
        sinResultados.style.display = "block";
        return;
      }

      datos.forEach(fragmento => {
        const card = document.createElement("div");
        card.classList.add("resultado-card");
        card.innerHTML = `<p>${fragmento}</p>`;
        resultadosCards.appendChild(card);
        });
      resultadosCards.style.display = "block";
    } catch (err) {
      console.error("Error procesando PDF:", err);
      alert("Error procesando el PDF. Revisa la consola.");
    }
  });
});
