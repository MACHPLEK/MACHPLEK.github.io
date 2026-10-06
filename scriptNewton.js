// Funcion para agregar texto a los botones
function agregarTexto(id, texto) {

    const input = document.getElementById(id);

    input.value += texto;

    input.focus();
}


// Metodo de Newton
function calcularNewton() {

    const funcionTexto = document.getElementById("funcion").value.trim();

    let xActual = parseFloat(document.getElementById("x0").value);

    let tolerancia = parseFloat(document.getElementById("tolerancia").value);

    let maxIteraciones = parseInt(document.getElementById("maxIteraciones").value);


    // Valores predeterminados
    if (isNaN(tolerancia) || tolerancia <= 0) {
        tolerancia = 0.01;
    }

    if (isNaN(maxIteraciones) || maxIteraciones <= 0) {
        maxIteraciones = 100;
    }


    // Limpiamos los resultados anteriores
    document.getElementById("mensaje").innerHTML = "";

    document.getElementById("resultado").style.display = "none";

    document.getElementById("tablaResultados").innerHTML = "";


    // Revisamos que se haya escrito una funcion
    if (funcionTexto === "") {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Ingresa una función f(x).</p>";

        return;
    }


    // Revisamos que se haya puesto el valor inicial
    if (isNaN(xActual)) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Ingresa un valor inicial x₀.</p>";

        return;
    }


    let funcion;
    let derivada;


    try {

        // Convertimos el texto en una funcion
        funcion = math.parse(funcionTexto);

        // Sacamos la derivada
        derivada = math.derivative(funcion, "x");

    } catch (error) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>La función no es válida. Revisa la expresión.</p>";

        return;
    }


    const tabla = document.getElementById("tablaResultados");

    let convergio = false;

    let errorActual = null;

    let iteracionesRealizadas = 0;

    let raiz = xActual;


    // Comienzan las iteraciones
    for (let n = 1; n <= maxIteraciones; n++) {

        try {

            // Evaluamos la funcion y su derivada
            const fx = funcion.evaluate({ x: xActual });

            const derivadaFx = derivada.evaluate({ x: xActual });


            // Revisamos que la derivada no sea cero
            if (!isFinite(derivadaFx) ||
                Math.abs(derivadaFx) < 1e-14) {

                document.getElementById("mensaje").innerHTML =
                    "<p class='text-danger'>La derivada es cero o demasiado cercana a cero. El método no puede continuar.</p>";

                return;
            }


            // Formula del metodo de Newton
            const xNuevo = xActual - (fx / derivadaFx);


            // Calculamos el error
            if (xNuevo !== 0) {

                errorActual =
                    Math.abs((xNuevo - xActual) / xNuevo) * 100;

            } else {

                errorActual =
                    Math.abs(xNuevo - xActual) * 100;

            }


            // Creamos una fila para la tabla
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${n}</td>
                <td>${formatearNumero(xActual)}</td>
                <td>${formatearNumero(fx)}</td>
                <td>${formatearNumero(derivadaFx)}</td>
                <td>${formatearNumero(xNuevo)}</td>
                <td>${formatearNumero(errorActual)}</td>
            `;

            tabla.appendChild(fila);


            iteracionesRealizadas = n;

            raiz = xNuevo;


            // Revisamos si ya se alcanzo la tolerancia
            if (errorActual < tolerancia) {

                convergio = true;

                break;
            }


            // El nuevo valor pasa a ser el actual
            xActual = xNuevo;

        } catch (error) {

            document.getElementById("mensaje").innerHTML =
                "<p class='text-danger'>Ocurrió un error al evaluar la función.</p>";

            return;
        }

    }


    // Mostramos el resultado
    document.getElementById("resultado").style.display = "block";

    document.getElementById("raiz").textContent =
        formatearNumero(raiz);

    document.getElementById("numeroIteraciones").textContent =
        iteracionesRealizadas;

    document.getElementById("errorFinal").textContent =
        errorActual !== null
            ? formatearNumero(errorActual) + " %"
            : "No disponible";


    // Mostramos el estado del metodo
    if (convergio) {

        document.getElementById("estadoConvergencia").textContent =
            "El método convergió correctamente.";

    } else {

        document.getElementById("estadoConvergencia").textContent =
            "No se alcanzó la tolerancia indicada.";

    }

}


// Formato de los numeros
function formatearNumero(numero) {

    if (!isFinite(numero)) {

        return "No definido";
    }

    return Number(numero).toFixed(8);
}