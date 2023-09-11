document.addEventListener("DOMContentLoaded", function () {
    const tablaTasasCambio = document.getElementById("tasasCambio");
    const fechaInput = document.getElementById("fechaInput");
    const buscarButton = document.getElementById("buscarButton");

    
    const URL = "https://api.bluelytics.com.ar/v2/evolution.json";

    // Función para formatear la fecha al formato "Día/Mes/Año // Despues de mil intentos se pudo....
    function formatearFecha(fecha) {
        const partesFecha = fecha.split("-");                       // split divide mediante el parametro indicado
        const dia = partesFecha[2];
        const mes = partesFecha[1];
        const año = partesFecha[0];
        return `${dia}/${mes}/${año}`;
    }

    // Función para obtener datos de la API y mostrarlos en la tabla
    function mostrarTasasDeCambio(fechaSeleccionada) {
        // Borrar filas existentes en la tabla
        while (tablaTasasCambio.firstChild) {
            tablaTasasCambio.removeChild(tablaTasasCambio.firstChild);
        }

        
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                // Filtrar los datos por la fecha seleccionada
                const tasasFiltradas = data.filter((tasa) => tasa.date === fechaSeleccionada);

                //  Crear filas de tabla con el resultado del filtro
                tasasFiltradas.forEach((tasa) => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${formatearFecha(tasa.date)}</td>
                        <td>${tasa.source}</td>
                        <td>${tasa.value_sell} ARS</td>
                        <td>${tasa.value_buy} ARS</td>
                    `;
                    tablaTasasCambio.appendChild(fila);
                });

                if (tasasFiltradas.length === 0) {
                    const mensaje = document.createElement("p");
                    mensaje.textContent = "No se encontraron tasas de cambio para la fecha seleccionada.Esta busqueda esta basada desde 01-03-2011 hasta la actualidad";
                    tablaTasasCambio.appendChild(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener los datos de la API:", error);
            });
    }

    // Evento clic en el botón de búsqueda
    buscarButton.addEventListener("click", function () {
        const fechaSeleccionada = fechaInput.value;
        mostrarTasasDeCambio(fechaSeleccionada);
    });
});

