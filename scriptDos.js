// AGREGAR FUNCIONES CON LOS BOTONES
function agregarFuncion(texto) {
    const campo = document.getElementById("funcion");
    campo.value += texto;
    campo.focus();
}

// CONVERTIR LA FUNCIÓN
function convertirFuncion(funcionTexto) {
    try {
        const expresion = math.parse(funcionTexto);
        const compilada = expresion.compile();
        // Regresamos una función que recibe x
        return function (x) {
            const resultado = compilada.evaluate({
                x: x
            });
            return resultado;
        };
    } catch (error) {
        throw new Error("La función no es válida.");
    }
}

// BUSCAR INTERVALO
function buscarIntervalo(f) {
    const inicio = -100;
    const fin = 100;
    const paso = 0.5;


    let x1 = inicio;


    while (x1 < fin) {
        const x2 = x1 + paso;
        try {
            const f1 = f(x1);
            const f2 = f(x2);
            // Ignorar valores que no sean números
            if (
                !Number.isFinite(f1) ||
                !Number.isFinite(f2)
            ) {
                x1 = x2;
                continue;
            }
            // Encontramos una raíz exacta
            if (f1 === 0) {
                return {
                    a: x1,
                    b: x1
                };
            }
            // Hay cambio de signo
            if (f1 * f2 < 0) {
                return {
                    a: x1,
                    b: x2
                };
            }
        } catch (error)}
        }
        x1 = x2;
    }
    return null;
}


// MÉTODO DE BISECCIÓN ABIERTA
function calcularPuntoFijo() {
    const mensaje = document.getElementById("mensaje");
    const resultado = document.getElementById("resultado");
    const tabla = document.getElementById("tablaResultados");

    // Limpiar resultados anteriores
    mensaje.innerHTML = "";
    resultado.style.display = "none";
    tabla.innerHTML = "";

    // OBTENER DATOS
    const funcionTexto = document.getElementById("funcion").value.trim();
    const x0Texto = document.getElementById("a").value; // Usamos el campo 'a' como x0
    const toleranciaTexto = document.getElementById("tolerancia").value;
    const maxIteracionesTexto = document.getElementById("maxIteraciones").value;

    if (funcionTexto === "") {
        mensaje.innerHTML = "Introduce la función f(x).";
        return;
    }

    if (x0Texto === "") {
        mensaje.innerHTML = "Introduce el valor inicial x0.";
        return;
    }

    let g;
    try {
        g = convertirFuncion(funcionTexto);
    } catch (error) {
        mensaje.innerHTML = "La función f(x) introducida no es válida.";
        return;
    }

    let x0 = Number(x0Texto);
    let tolerancia = toleranciaTexto === "" ? 0.01 : Number(toleranciaTexto);
    let maxIteraciones = maxIteracionesTexto === "" ? 100 : Math.floor(Number(maxIteracionesTexto));

    // ALGORITMO DE BISECCIÓN ABIERTA
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
            mensaje.innerHTML = "La función no diverge o produce un valor indeterminado.";
            return;
        }

        error = Math.abs(xSiguiente - xActual);

        // Agregar fila a la tabla
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

    // MOSTRAR RESULTADO FINAL
    document.getElementById("raiz").textContent = formatearNumero(xActual);
    document.getElementById("numeroIteraciones").textContent = iteracion;
    document.getElementById("toleranciaUtilizada").textContent = formatearNumero(tolerancia);
    resultado.style.display = "block";

    if (iteracion >= maxIteraciones) {
        mensaje.innerHTML = "Se alcanzó el máximo de iteraciones sin lograr la tolerancia.";
    } else {
        mensaje.innerHTML = "Cálculo de Biseccion abierta completado exitosamente.";
    }


    // MSJ
    if (iteracion >= maxIteraciones) {
        mensaje.innerHTML = "Se alcanzó el máximo de iteraciones antes de llegar a la tolerancia.";
    } else {
        mensaje.innerHTML = "Cálculo realizado correctamente.";
    }
}

// BUSCAR INTERVALO DESDE UN EXTREMO
function buscarIntervaloDesde(f, punto, buscarDerecha) {
    const paso = 0.5;
    let xAnterior = punto;
    let fAnterior;

    try {
        fAnterior = f(xAnterior);
    } catch (error) {
        return null;
    }

    for (let i = 1; i <= 400; i++) {
        let xActual;
        if (buscarDerecha) {
            xActual = punto + i * paso;
        } else {
            xActual = punto - i * paso;
        }

        try {
            const fActual = f(xActual);
            if (Number.isFinite(fAnterior) && Number.isFinite(fActual)) {
                if (fAnterior * fActual < 0) {
                    if (buscarDerecha) {
                        return {
                            a: xAnterior,
                            b: xActual
                        };
                    } else {
                        return {
                            a: xActual,
                            b: xAnterior
                        };
                    }
                }
            }
            xAnterior = xActual;
            fAnterior = fActual;
        } catch (error) {
            xAnterior = xActual;
        }
    }
    return null;
}

// MOSTRAR RESULTADO
function mostrarResultado(raiz, iteraciones, a, b, tolerancia) {
    document.getElementById("raiz").textContent = formatearNumero(raiz);
    document.getElementById("numeroIteraciones").textContent = iteraciones;
    document.getElementById("intervaloUtilizado").textContent = `[ ${formatearNumero(a)}, ${formatearNumero(b)} ]`;
    document.getElementById("toleranciaUtilizada").textContent = formatearNumero(tolerancia);
    document.getElementById("resultado").style.display = "block";
}

// FORMATEAR NÚMEROS
function formatearNumero(numero) {
    if (!Number.isFinite(numero)) {
        return "No definido";
    }
    return Number(numero) .toFixed(10) .replace(/\.?0+$/, "");
}