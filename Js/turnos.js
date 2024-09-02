import { cookies } from './cFunctions.js';

export function misTurnos() {
    console.log('misTurnosJs');
    const misTurnosContainer = document.getElementById('mis-turnos_item_container');
    misTurnosContainer.innerHTML = '';

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;
    const selectElement = document.getElementById("turnos_select");
    const pasadoOption = document.querySelector('option[value="pasado"]');

    const UrlTurnos = `functions_tree.php?${"Action=Turnos_Clinica&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(UrlTurnos)
        .then(response => response.json())
        .then(data => {
            if (data.Numero_Turnos === 0) {
                // Deshabilitar la selección si no hay turnos disponibles
                selectElement.disabled = true;
                pasadoOption.selected = true;
                mostrarElementos("pasado");
            } else {
                // Ordenar los turnos por fecha y hora de menor a mayor
                data.Turnos.sort((a, b) => {
                    const fechaHoraA = new Date(a.Fecha + 'T' + a.Hora);
                    const fechaHoraB = new Date(b.Fecha + 'T' + b.Hora);

                    return fechaHoraA - fechaHoraB; // Orden ascendente por fecha y hora
                });

                console.log(data.Turnos);

                data.Turnos.forEach(element => {
                    // Obtener fecha y hora del elemento y fecha y hora actual
                    const fechaHoraElemento = new Date(element.Fecha + 'T' + element.Hora);
                    const fechaHoraActual = new Date();
                    let estadoTurno = fechaHoraElemento > fechaHoraActual ? 'futuro' : 'pasado';

                    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

                    const diaSemana = diasSemana[fechaHoraElemento.getDay()];
                    const diaMes = fechaHoraElemento.getDate();
                    const mes = meses[fechaHoraElemento.getMonth()];
                    const año = fechaHoraElemento.getFullYear();

                    const fechaFormateada = `${diaSemana}, ${diaMes} de ${mes} ${año}`;
                    const horaFormateada = element.Hora.slice(0, 5);

                    const turno = `
                        <span class="mis-turnos-item ${estadoTurno}">
                            <span class="mis-turnos-item_dot ${estadoTurno}"><span></span></span>
                            <span class="mis-turnos-item_info">
                                <h2>${fechaFormateada} - ${horaFormateada} hs</h2>
                                <p>${element.Nombre_Prof} - ${element.Especialidad_Prof}</p>
                                <p>${element.Nombre_Sede}</p>
                                <p>${element.Domicilio_Sede} - ${element.Localidad_Sede}</p>
                            </span>
                        </span>
                    `;

                    misTurnosContainer.innerHTML += turno;
                });

                // Función para mostrar elementos futuros, pasados o todos
                function mostrarElementos(elementoAMostrar) {
                    const elementos = document.querySelectorAll(".mis-turnos-item");
                    elementos.forEach((elemento) => {
                        if (elementoAMostrar === "todos" || elemento.classList.contains(elementoAMostrar)) {
                            elemento.style.display = "";
                        } else {
                            elemento.style.display = "none";
                        }
                    });
                }
                
                selectElement.addEventListener("change", filtrarElementos);
                
                function filtrarElementos() {
                    const valorSeleccionado = selectElement.value;

                    // Primero, eliminamos cualquier elemento "turno" existente
                    const elementoTurnoExistente = document.querySelector('.mis-turnos-empty');
                    if (elementoTurnoExistente) {
                        elementoTurnoExistente.remove();
                    }

                    switch (valorSeleccionado) {
                        case "todos":
                            mostrarElementos("todos");
                            break;
                        case "futuro":
                            const elementosFuturos = document.getElementsByClassName('futuro');
                            if (elementosFuturos.length === 0) {
                                console.log("No hay próximos turnos disponibles.");
                                let turno = `
                                            <span class="mis-turnos-empty">
                                                <span class="mis-turnos-item_dot"><span></span></span>
                                                <span class="mis-turnos-item_info">
                                                    <h2>No se encontró ningún turno</h2>
                                                </span>
                                            </span>
                                        `;

                                mostrarElementos("futuro");
                                misTurnosContainer.innerHTML += turno;
                            } else {
                                mostrarElementos("futuro");
                            }
                            break;
                        case "pasado":
                            const elementosPasados = document.getElementsByClassName('pasado');
                            if (elementosPasados.length === 0) {
                                let turno = `
                                            <span class="mis-turnos-empty">
                                                <span class="mis-turnos-item_dot"><span></span></span>
                                                <span class="mis-turnos-item_info">
                                                    <h2>No se encontró ningún turno</h2>
                                                </span>
                                            </span>
                                        `;

                                mostrarElementos("pasado");
                                misTurnosContainer.innerHTML += turno;
                            } else {
                                mostrarElementos("pasado");
                            }
                            break;
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching turnos:', error));
}
