
// Funcion para agregar texto a los botones
function agregarTexto(id, texto) {

    const input = document.getElementById(id);

    input.value += texto;

    input.focus();
}


// Metodo de Taylor
function calcularTaylor() {

    const funcionTexto = document.getElementById("funcion").value.trim();

    let a = parseFloat(document.getElementById("a").value);

    let x = parseFloat(document.getElementById("x").value);

    let grado = parseInt(document.getElementById("grado").value);


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


    // Revisamos que se hayan ingresado los valores
    if (isNaN(a) || isNaN(x)) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Ingresa el punto de expansión y el valor a aproximar.</p>";

        return;
    }


    // Revisamos el grado del polinomio
    if (isNaN(grado) || grado < 0 || grado > 10) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>El grado debe estar entre 0 y 10.</p>";

        return;
    }


    let funcion;
    let derivada;


    try {

        // Convertimos el texto en una funcion
        funcion = math.parse(funcionTexto);

        // Comenzamos con la funcion original
        derivada = funcion;

    } catch (error) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>La función no es válida. Revisa la expresión.</p>";

        return;
    }


    const tabla = document.getElementById("tablaResultados");

    let resultadoTaylor = 0;

    let polinomioTexto = "P" + grado + "(x) = ";


    // Comenzamos a calcular los terminos del polinomio
    for (let n = 0; n <= grado; n++) {

        try {

            // Evaluamos la derivada en el punto a
            const valorDerivada = derivada.evaluate({ x: a });


            // Calculamos el factorial
            const factorial = math.factorial(n);


            // Calculamos el termino de Taylor
            const termino = (valorDerivada / factorial) * Math.pow(x - a, n);


            // Sumamos el termino al resultado
            resultadoTaylor += termino;


            // Creamos una fila para la tabla
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${n}</td>
                <td>${formatearNumero(valorDerivada)}</td>
                <td>${factorial}</td>
                <td>${formatearNumero(termino)}</td>
                <td>${formatearNumero(resultadoTaylor)}</td>
            `;

            tabla.appendChild(fila);


            // Agregamos el termino al polinomio
            if (n === 0) {

                polinomioTexto += formatearNumero(valorDerivada);

            } else {

                polinomioTexto += " + (" +
                    formatearNumero(valorDerivada / factorial) +
                    ")(x - " + a + ")^" + n;

            }


            // Calculamos la siguiente derivada
            if (n < grado) {

                derivada = math.derivative(derivada, "x");

            }

        } catch (error) {

            document.getElementById("mensaje").innerHTML =
                "<p class='text-danger'>Ocurrió un error al calcular las derivadas.</p>";

            document.getElementById("tablaResultados").innerHTML = "";

            return;
        }

    }


    // Calculamos el valor real de la funcion
    let valorReal;

    try {

        valorReal = funcion.evaluate({ x: x });

    } catch (error) {

        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>No se pudo evaluar la función.</p>";

        return;
    }


    // Calculamos el error absoluto
    const errorAbsoluto = Math.abs(valorReal - resultadoTaylor);


    // Calculamos el error porcentual
    let errorPorcentual;

    if (valorReal !== 0) {

        errorPorcentual =
            (errorAbsoluto / Math.abs(valorReal)) * 100;

    } else {

        errorPorcentual = null;

    }


    // Mostramos el resultado
    document.getElementById("resultado").style.display = "block";

    document.getElementById("polinomio").textContent =
        polinomioTexto;

    document.getElementById("aproximacion").textContent =
        formatearNumero(resultadoTaylor);

    document.getElementById("valorReal").textContent =
        formatearNumero(valorReal);

    document.getElementById("errorAbsoluto").textContent =
        formatearNumero(errorAbsoluto);

    document.getElementById("errorPorcentual").textContent =
        errorPorcentual !== null
            ? formatearNumero(errorPorcentual) + " %"
            : "No definido";

}


// Formato de los numeros
function formatearNumero(numero) {

    if (!isFinite(numero)) {

        return "No definido";
    }

    return Number(numero).toFixed(8);
}
