const canvas = document.getElementById("canvas");
const fileInput = document.getElementById("fileInput");

function agregarBloque(tipo) {
  const bloque = document.createElement("div");
  bloque.classList.add("bloque");
  bloque.setAttribute("data-tipo", tipo);
  bloque.setAttribute("contenteditable", "true");
  bloque.style.left = "50px";
  bloque.style.top = "50px";

  switch (tipo) {
    case 'titulo':
      bloque.innerText = "Nuevo Título";
      bloque.style.fontSize = "24pt";
      bloque.style.fontWeight = "bold";
      break;
    case 'subtitulo':
      bloque.innerText = "Nuevo Subtítulo";
      bloque.style.fontSize = "18pt";
      bloque.style.fontStyle = "italic";
      break;
    case 'parrafo':
      bloque.innerText = "Este es un párrafo editable. Puedes escribir aquí.";
      bloque.style.fontSize = "12pt";
      bloque.style.lineHeight = "1.5";
      break;
    case 'cuadro':
      bloque.innerText = "Texto destacado o informativo.";
      bloque.style.background = "#e3f2fd";
      bloque.style.borderLeft = "5px solid #2196f3";
      break;
    case 'imagen':
      bloque.setAttribute("contenteditable", "false");
      const img = document.createElement("img");
      bloque.appendChild(img);
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => img.src = reader.result;
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
      break;
  }

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "boton-eliminar";
    btnEliminar.innerText = "×";
    btnEliminar.onclick = () => bloque.remove();
    bloque.appendChild(btnEliminar);

  agregarResizer(bloque);
  hacerMovible(bloque);
  canvas.appendChild(bloque);
}

function hacerMovible(el) {
  let offsetX, offsetY, isDragging = false;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains("resizer")) return;
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = "999";
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      el.style.left = `${e.clientX - offsetX}px`;
      el.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    el.style.zIndex = "";
  });
}

function agregarResizer(bloque) {
  const resizer = document.createElement("div");
  resizer.classList.add("resizer");
  bloque.appendChild(resizer);

  resizer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(window.getComputedStyle(bloque).width, 10);
    const startHeight = parseInt(window.getComputedStyle(bloque).height, 10);

    function doDrag(e) {
      bloque.style.width = startWidth + (e.clientX - startX) + "px";
      bloque.style.height = startHeight + (e.clientY - startY) + "px";
    }

    function stopDrag() {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  });
}

function exportarComoPlantilla() {
  const bloques = [...document.querySelectorAll(".bloque")].map(b => {
    const tipo = b.dataset.tipo;
    const contenido = tipo === 'imagen' 
      ? "" 
      : b.innerText.trim();

    return {
      tipo,
      contenido,
      x: parseInt(b.style.left),
      y: parseInt(b.style.top),
      width: parseInt(b.offsetWidth),
      height: parseInt(b.offsetHeight)
    };
  });

  const blob = new Blob([JSON.stringify(bloques, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "plantilla_documento.json";
  a.click();
}

document.getElementById("fileImport").addEventListener("change", async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const text = await file.text();
  let bloques;

  try {
    bloques = JSON.parse(text);
  } catch (err) {
    alert("Archivo no válido.");
    return;
  }

  canvas.innerHTML = "";

  bloques.forEach(data => {
    const bloque = document.createElement("div");
    bloque.classList.add("bloque");
    bloque.setAttribute("data-tipo", data.tipo);
    bloque.setAttribute("contenteditable", data.tipo !== "imagen");
    bloque.style.left = data.x + "px";
    bloque.style.top = data.y + "px";
    bloque.style.width = data.width + "px";
    bloque.style.height = data.height + "px";

    if (data.tipo === "imagen") {
        const img = document.createElement("img");
        if (data.contenido) img.src = data.contenido; // 
            bloque.appendChild(img);
    } else {
        bloque.innerText = data.contenido || ""; // 
    }

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "boton-eliminar";
    btnEliminar.innerText = "×";
    btnEliminar.onclick = () => bloque.remove();
    bloque.appendChild(btnEliminar);

    agregarResizer(bloque);
    hacerMovible(bloque);
    canvas.appendChild(bloque);
  });   
});