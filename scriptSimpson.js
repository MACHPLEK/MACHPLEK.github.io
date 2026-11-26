
// Funcion para agregar texto a los botones
function agregarTexto(id, texto) {
    const input = document.getElementById(id);
    input.value += texto;
    input.focus();
}

// Metodo de Simpson
function calcularSimpson() {

    const funcionTexto = document.getElementById("funcion").value.trim();
    const metodo = document.getElementById("metodo").value;

    let a = parseFloat(document.getElementById("limiteA").value);
    let b = parseFloat(document.getElementById("limiteB").value);
    let n = parseInt(document.getElementById("subintervalos").value);

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

    // Revisamos los limites
    if (isNaN(a) || isNaN(b)) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Ingresa los dos limites de integración.</p>";
        return;
    }

    // Revisamos que el limite superior sea mayor
    if (b <= a) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>El limite superior debe ser mayor que el inferior.</p>";
        return;
    }

    // Revisamos el numero de subintervalos
    if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Ingresa un numero entero de subintervalos.</p>";
        return;
    }

    // Revisamos las condiciones de cada metodo
    if (metodo === "13" && n % 2 !== 0) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Para Simpson 1/3, el numero de subintervalos debe ser par.</p>";
        return;
    }

    if (metodo === "38" && n % 3 !== 0) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>Para Simpson 3/8, el numero de subintervalos debe ser multiplo de 3.</p>";
        return;
    }

    let funcion;

    try {
        // Convertimos el texto en una funcion
        funcion = math.parse(funcionTexto);

    } catch (error) {
        document.getElementById("mensaje").innerHTML =
            "<p class='text-danger'>La funcion no es valida. Revisa la expresion.</p>";
        return;
    }

    // Calculamos el tamaño del intervalo
    const h = (b - a) / n;

    let suma = 0;
    let resultadoFinal = 0;

    const tabla = document.getElementById("tablaResultados");

    // Comenzamos las evaluaciones
    for (let i = 0; i <= n; i++) {

        const xi = a + (i * h);

        let fxi;

        try {
            // Evaluamos la funcion
            fxi = funcion.evaluate({ x: xi });

        } catch (error) {
            document.getElementById("mensaje").innerHTML =
                "<p class='text-danger'>Ocurrio un error al evaluar la funcion.</p>";
            return;
        }

        // Asignamos los coeficientes
        let coeficiente = 0;

        if (i === 0 || i === n) {
            coeficiente = 1;
        } else if (metodo === "13") {

            if (i % 2 === 0) {
                coeficiente = 2;
            } else {
                coeficiente = 4;
            }

        } else {

            if (i % 3 === 0) {
                coeficiente = 2;
            } else {
                coeficiente = 3;
            }
        }

        // Multiplicamos el coeficiente por f(xi)
        const producto = coeficiente * fxi;

        suma += producto;

        // Creamos una fila para la tabla
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${i}</td>
            <td>${formatearNumero(xi)}</td>
            <td>${formatearNumero(fxi)}</td>
            <td>${coeficiente}</td>
            <td>${formatearNumero(producto)}</td>
        `;

        tabla.appendChild(fila);
    }

    // Aplicamos la formula correspondiente
    if (metodo === "13") {
        resultadoFinal = (h / 3) * suma;

        document.getElementById("metodoUsado").textContent =
            "Simpson 1/3";

        document.getElementById("formulaSimpson").textContent =
            "Integral aproximada = (h / 3) × suma de coeficientes y productos.";

    } else {
        resultadoFinal = (3 * h / 8) * suma;

        document.getElementById("metodoUsado").textContent =
            "Simpson 3/8";

        document.getElementById("formulaSimpson").textContent =
            "Integral aproximada = (3h / 8) × suma de coeficientes y productos.";
    }

    // Mostramos los resultados
    document.getElementById("resultado").style.display = "block";

    document.getElementById("valorH").textContent =
        formatearNumero(h);

    document.getElementById("resultadoIntegral").textContent =
        formatearNumero(resultadoFinal);
}

// Formato de los numeros
function formatearNumero(numero) {

    if (!isFinite(numero)) {
        return "No definido";
    }

    return Number(numero).toFixed(8);
}
