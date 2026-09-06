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

// BUSCAR INTERVALO AUTOMÁTICAMENTE

function buscarIntervalo(f) {
    // Buscamos entre -100 y 100
    // usando pasos de 0.5

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
        } catch (error) {
            // Si la función no existe en ese punto,
            // continuamos buscando
        }
        x1 = x2;
    }
    return null;
}

// MÉTODO DE BISECCIÓN

function calcularBiseccion() {
    const mensaje = document.getElementById("mensaje");
    const resultado = document.getElementById("resultado");
    const tabla = document.getElementById("tablaResultados");
    // Limpiar resultados anteriores
    mensaje.innerHTML = "";
    resultado.style.display = "none";
    tabla.innerHTML = "";

    // OBTENER DATOS

    const funcionTexto =
        document.getElementById("funcion").value.trim();
    let aTexto = document.getElementById("a").value;
    let bTexto = document.getElementById("b").value;
    let toleranciaTexto = document.getElementById("tolerancia").value;
    let maxIteracionesTexto = document.getElementById("maxIteraciones").value;

    // VALIDAR FUNCIÓN

    if (funcionTexto === "") {
        mensaje.innerHTML = "Introduce una función.";

        return;
    }

    // CREAR FUNCIÓN

    let f;
    try {
        f = convertirFuncion(funcionTexto);
    } catch (error) {
        mensaje.innerHTML = "La función introducida no es válida.";
        return;
    }
 
    // TOLERANCIA

    let tolerancia;
    if (toleranciaTexto === "") {
        tolerancia = 0.01;
    } else {
        tolerancia = Number(toleranciaTexto);
    }

    if (
        !Number.isFinite(tolerancia) ||
        tolerancia <= 0
    ) {
        mensaje.innerHTML =
            "La tolerancia debe ser mayor que 0.";
        return;
    }

    // MÁXIMO DE ITERACIONES

    let maxIteraciones;
    if (maxIteracionesTexto === "") {
        maxIteraciones = 100;
    } else {
        maxIteraciones = Number(maxIteracionesTexto);
    }

    if ( !Number.isFinite(maxIteraciones) || maxIteraciones <= 0 ) {
        mensaje.innerHTML = "El máximo de iteraciones no es válido.";
        return;
    }

    maxIteraciones = Math.floor(maxIteraciones);

    // INTERVALO

    let a;
    let b;

    const tieneA = aTexto !== "";
    const tieneB = bTexto !== "";

    // CASO 1:
    // NO SE INTRODUJERON A NI B

    if (!tieneA && !tieneB) {
        const intervalo = buscarIntervalo(f);
        if (!intervalo) {
            mensaje.innerHTML = "No se encontró automáticamente un intervalo donde exista cambio de signo.";
            return;
        }
        a = intervalo.a;
        b = intervalo.b;
    }

    // CASO 2:
    // SE INTRODUJERON A Y B

    else if (tieneA && tieneB) {
        a = Number(aTexto);
        b = Number(bTexto);
    }

    // CASO 3:
    // SOLO SE INTRODUJO A

    else if (tieneA && !tieneB) {
        a = Number(aTexto);
        const intervalo = buscarIntervaloDesde(f, a, true);
        if (!intervalo) {
            mensaje.innerHTML = "No se pudo encontrar automáticamente el valor de b.";
            return;
        }
        b = intervalo.b;
    }

    // CASO 4:
    // SOLO SE INTRODUJO B

    else if (!tieneA && tieneB) {
        b = Number(bTexto);
        const intervalo = buscarIntervaloDesde(f, b, false);
        if (!intervalo) {
            mensaje.innerHTML = "No se pudo encontrar automáticamente el valor de a.";
            return;
        }
        a = intervalo.a;
    }

    // VALIDAR A Y B

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        mensaje.innerHTML = "Los valores del intervalo no son válidos.";
        return;
    }

    if (a === b) {
        mensaje.innerHTML = "Los valores a y b no pueden ser iguales.";
        return;
    }

    if (a > b) {
        const temporal = a;
        a = b;
        b = temporal;
    }

    // EVALUAR EXTREMOS

    let fa;
    let fb;

    try {
        fa = f(a);
        fb = f(b);
    } catch (error) {
        mensaje.innerHTML = "No se pudo evaluar la función en el intervalo.";
        return;
    }

    if (!Number.isFinite(fa) || !Number.isFinite(fb)) {
        mensaje.innerHTML = "La función no está definida en alguno de los extremos.";
        return;
    }

    // RAÍZ EXACTA EN A

    if (fa === 0) {
        mostrarResultado(a, 0, a, b, tolerancia);
        return;
    }

    // RAÍZ EXACTA EN B

    if (fb === 0) {
        mostrarResultado(b, 0, a, b, tolerancia);
        return;
    }

    // VALIDAR CAMBIO DE SIGNO

    if (fa * fb > 0) {
        mensaje.innerHTML = "No existe cambio de signo en el intervalo. Para aplicar bisección debe cumplirse f(a) · f(b) < 0.";
        return;
    }

    // ==========================================
    // BISECCIÓN
    // ==========================================

    let xm;
    let fxm;

    let error = Infinity;

    let iteracion = 0;

    let raiz = null;


    while (
        error > tolerancia &&
        iteracion < maxIteraciones
    ) {

        iteracion++;


        // Punto medio
        xm = (a + b) / 2;


        // Evaluar función
        try {

            fxm = f(xm);

        } catch (errorFuncion) {

            mensaje.innerHTML =
                "No se pudo evaluar la función.";

            return;
        }


        if (!Number.isFinite(fxm)) {

            mensaje.innerHTML =
                "La función no está definida en uno de los puntos evaluados.";

            return;
        }


        // Error de bisección
        error = Math.abs(b - a) / 2;


        // ==========================================
        // AGREGAR FILA A LA TABLA
        // ==========================================

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${iteracion}</td>
            <td>${formatearNumero(a)}</td>
            <td>${formatearNumero(b)}</td>
            <td>${formatearNumero(xm)}</td>
            <td>${formatearNumero(fxm)}</td>
            <td>${formatearNumero(error)}</td>
        `;

        tabla.appendChild(fila);


        // ==========================================
        // ENCONTRAMOS LA RAÍZ
        // ==========================================

        if (fxm === 0) {

            raiz = xm;
            error = 0;

            break;
        }


        // ==========================================
        // CAMBIAR INTERVALO
        // ==========================================

        if (fa * fxm < 0) {

            b = xm;
            fb = fxm;

        } else {

            a = xm;
            fa = fxm;
        }


        // Aproximación actual
        raiz = xm;
    }


    // ==========================================
    // MOSTRAR RESULTADO
    // ==========================================

    mostrarResultado(
        raiz,
        iteracion,
        a,
        b,
        tolerancia
    );


    // ==========================================
    // MENSAJE
    // ==========================================

    if (iteracion >= maxIteraciones) {

        mensaje.innerHTML =
            "Se alcanzó el máximo de iteraciones antes de llegar a la tolerancia.";

    } else {

        mensaje.innerHTML =
            "Cálculo realizado correctamente.";
    }
}


// ==========================================
// BUSCAR INTERVALO DESDE UN EXTREMO
// ==========================================

function buscarIntervaloDesde(
    f,
    punto,
    buscarDerecha
) {

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

            xActual =
                punto + i * paso;

        } else {

            xActual =
                punto - i * paso;
        }


        try {

            const fActual =
                f(xActual);


            if (
                Number.isFinite(fAnterior) &&
                Number.isFinite(fActual)
            ) {

                if (
                    fAnterior * fActual < 0
                ) {

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


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultado(
    raiz,
    iteraciones,
    a,
    b,
    tolerancia
) {

    document.getElementById("raiz").textContent =
        formatearNumero(raiz);

    document.getElementById("numeroIteraciones").textContent =
        iteraciones;

    document.getElementById("intervaloUtilizado").textContent =
        `[ ${formatearNumero(a)}, ${formatearNumero(b)} ]`;

    document.getElementById("toleranciaUtilizada").textContent =
        formatearNumero(tolerancia);


    document.getElementById("resultado").style.display =
        "block";
}


// ==========================================
// FORMATEAR NÚMEROS
// ==========================================

function formatearNumero(numero) {

    if (!Number.isFinite(numero)) {

        return "No definido";
    }

    return Number(numero)
        .toFixed(10)
        .replace(/\.?0+$/, "");
}