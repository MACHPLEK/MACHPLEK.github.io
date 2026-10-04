// 1. FUNCION PARA LOS BOTONES
function agregarTexto(idCampo, texto) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.value += texto;
        campo.focus();
    }
}

// ALIAS EN CASO DE LLAMAR CON UN SOLO PARAMETRO
function agregarFuncion(texto) {
    agregarTexto("funcion", texto);
}

// 2. PARSER Y EVALUADOR CON MATH.JS
function convertirFuncion(funcionTexto) {
    try {
        const expresion = math.parse(funcionTexto);
        const compilada = expresion.compile();
        return function (x) {
            return compilada.evaluate({ x: x });
        };
    } catch (error) {
        throw new Error("La función introducida no es válida.");
    }
}

// 3. CÁLCULO DE BISECCIÓN ABIERTA / PUNTO FIJO
function calcularBiseccionAbierta() {
    const mensaje = document.getElementById("mensaje");
    const resultado = document.getElementById("resultado");
    const tabla = document.getElementById("tablaResultados");

    mensaje.innerHTML = "";
    resultado.style.display = "none";
    tabla.innerHTML = "";

    const campoG = document.getElementById("funcion");
    const campoX0 = document.getElementById("x0");
    const campoTol = document.getElementById("tolerancia");
    const campoMaxIter = document.getElementById("maxIteraciones");

    if (!campoG || !campoX0) {
        mensaje.innerHTML = "Error interno: Faltan campos en el HTML.";
        return;
    }

    const gTexto = campoG.value.trim();
    const x0Texto = campoX0.value;
    const toleranciaTexto = campoTol ? campoTol.value : "";
    const maxIteracionesTexto = campoMaxIter ? campoMaxIter.value : "";

    if (gTexto === "") {
        mensaje.innerHTML = "Introduce la función despejada g(x).";
        return;
    }

    if (x0Texto === "") {
        mensaje.innerHTML = "Introduce el valor inicial x₀.";
        return;
    }

    let g;
    try {
        g = convertirFuncion(gTexto);
    } catch (error) {
        mensaje.innerHTML = "La función g(x) introducida no es válida.";
        return;
    }

    let x0 = Number(x0Texto);
    let tolerancia = toleranciaTexto === "" ? 0.01 : Number(toleranciaTexto);
    let maxIteraciones = maxIteracionesTexto === "" ? 100 : Math.floor(Number(maxIteracionesTexto));

    let xActual = x0;
    let xSiguiente;
    let error = Infinity;
    let iteracion = 0;

    while (error > tolerancia && iteracion < maxIteraciones) {
        iteracion++;

        try {
            xSiguiente = g(xActual);
        } catch (e) {
            mensaje.innerHTML = "Error al evaluar la función en x = " + xActual;
            return;
        }

        if (!Number.isFinite(xSiguiente)) {
            mensaje.innerHTML = "La función diverge o produce un valor indeterminado.";
            return;
        }

        error = Math.abs(xSiguiente - xActual);

        // Fila de la tabla
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${iteracion}</td>
            <td>${formatearNumero(xActual)}</td>
            <td>${formatearNumero(xSiguiente)}</td>
            <td>${formatearNumero(error)}</td>
        `;
        tabla.appendChild(fila);

        xActual = xSiguiente;
    }

    // MOSTRAR RESULTADOS
    const elemRaiz = document.getElementById("raiz");
    const elemIter = document.getElementById("numeroIteraciones");
    const elemError = document.getElementById("errorFinal");
    const elemEstado = document.getElementById("estadoConvergencia");

    if (elemRaiz) elemRaiz.textContent = formatearNumero(xActual);
    if (elemIter) elemIter.textContent = iteracion;
    if (elemError) elemError.textContent = formatearNumero(error);

    if (iteracion >= maxIteraciones) {
        if (elemEstado) elemEstado.textContent = "Divergente o límite alcanzado";
        mensaje.innerHTML = "Se alcanzó el máximo de iteraciones antes de lograr la tolerancia.";
    } else {
        if (elemEstado) elemEstado.textContent = "Convergente";
        mensaje.innerHTML = "Cálculo realizado correctamente.";
    }

    resultado.style.display = "block";
}

function formatearNumero(numero) {
    if (!Number.isFinite(numero)) return "No definido";
    return Number(numero).toFixed(10).replace(/\.?0+$/, "");
}