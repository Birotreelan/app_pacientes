import { cookies } from "./cFunctions.js";

// Exportar la función aside
export function aside() {
    const { clinicaId, pacienteDNI } = cookies;

    const urlSalaEspera = `functions_tree.php?Action=getSalaEsperaAdmision&Cliente_Id=${clinicaId}&Paciente_DNI=${pacienteDNI}`;
    const urlTurnos = `functions_tree.php?Action=Turnos_Clinica&Cliente_Id=${clinicaId}&Paciente_DNI=${pacienteDNI}`;
    const urlEstudios = `functions_tree.php?Action=Estudios_Clinica&Cliente_Id=${clinicaId}&Paciente_DNI=${pacienteDNI}`;
    const urlUltimoLog = `functions_tree.php?Action=getLastLog&Cliente_Id=${clinicaId}&Paciente_DNI=${pacienteDNI}`;

    obtenerUltimoLog(urlUltimoLog, urlEstudios);
    obtenerTurnosEnSalaEspera(urlSalaEspera, urlTurnos);
    obtenerTurnosHoy(urlTurnos);
}

// Función para obtener el último log del paciente
function obtenerUltimoLog(urlUltimoLog, urlEstudios) {
    fetch(urlUltimoLog)
        .then(response => response.text())
        .then(dataLog => {
            const ultimoLogTimestamp = new Date(dataLog.trim().replace(/^"|"$/g, ''));
            obtenerEstudios(urlEstudios, ultimoLogTimestamp);
        })
        .catch(error => console.error('Error fetching last log data:', error));
}

// Función para obtener los estudios del paciente
function obtenerEstudios(urlEstudios, ultimoLogTimestamp) {
    fetch(urlEstudios)
        .then(response => response.json())
        .then(dataEstudios => {
            const totalEstudios = dataEstudios.Estudios.length;
            const estudiosNuevos = filtrarEstudiosNuevos(dataEstudios.Estudios, ultimoLogTimestamp);
            mostrarEstudiosNuevos(estudiosNuevos, totalEstudios);
        })
        .catch(error => console.error('Error fetching estudios data:', error));
}

// Función para filtrar estudios nuevos
function filtrarEstudiosNuevos(estudios, ultimoLogTimestamp) {
    return estudios.filter(estudio => {
        const fechaHoraISO = `${estudio.Fecha}T${estudio.Hora}`;
        const fechaEstudio = new Date(fechaHoraISO);
        return fechaEstudio > ultimoLogTimestamp;
    });
}

// Función para mostrar los estudios nuevos en el contenedor
function mostrarEstudiosNuevos(estudiosNuevos, totalEstudios) {
    const tarjetaEstudiosContainer = document.getElementById('tarjetaEstudiosContainer');

    if (estudiosNuevos.length > 0) {
        tarjetaEstudiosContainer.style.display = 'block';
        tarjetaEstudiosContainer.innerHTML = '';

        const headerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <h2 class="titulo">Nuevos estudios</h2>
                <a class="enlace" id="ver_estudios">Ver todos (${totalEstudios})</a>
            </div>
        `;
        tarjetaEstudiosContainer.innerHTML += headerHTML;

        estudiosNuevos.forEach(estudio => {
            const estudioElement = document.createElement('div');
            estudioElement.className = 'tarjeta-estudios';
            estudioElement.innerHTML = `
                <div>
                    <p class="texto">${estudio.Fecha.split('-').reverse().join('/')}</p>
                    <h3 class="subtitulo">${estudio.Titulo}</h3>
                </div>
                <button class="blue-button" onclick="window.open('${estudio.Link}', '_blank')">ABRIR</button>
            `;
            tarjetaEstudiosContainer.appendChild(estudioElement);
        });

        const verEstudiosButton = document.getElementById('ver_estudios');
        verEstudiosButton.addEventListener('click', () => {
            const event = new CustomEvent('openMisEstudios');
            document.dispatchEvent(event);
        });

    } else {
        tarjetaEstudiosContainer.style.display = 'none';
    }
}

// Función para obtener todos los turnos del paciente
function obtenerTodosLosTurnos(urlTurnos, callback) {
    fetch(urlTurnos)
        .then(response => response.json())
        .then(data => {
            const turnos = data.Turnos || [];
            callback(turnos); // Llama a la función callback con los turnos obtenidos
        })
        .catch(error => console.error('Error fetching turnos data:', error));
}

// Función para obtener los turnos en sala de espera
function obtenerTurnosEnSalaEspera(urlSalaEspera, urlTurnos) {
    fetch(urlSalaEspera)
        .then(response => response.json())
        .then(data => {
            mostrarTurnosEnSalaEspera(data, urlTurnos);
        })
        .catch(error => console.error('Error fetching sala de espera data:', error));
}

// Función para mostrar turnos en sala de espera
function mostrarTurnosEnSalaEspera(data, urlTurnos) {
    if (data.Turnos && data.Turnos.length > 0) {
        let turno = data.Turnos[0];
        const fechaFormateada = formatearFecha(turno.Fecha);
        const horaFormateada = formatearHora(turno.Hora);

        document.getElementById('pacientesEspera').textContent = turno.Pacientes_Espera;
        document.getElementById('nombreProfesional').textContent = turno.Profesional;
        document.getElementById('fechaTurno').innerHTML = `<img src="./img/calendario.png" style="width: 20px; margin-right: 5px;">${fechaFormateada}`;
        document.getElementById('horaTurno').innerHTML = `<img src="./img/reloj.png" style="width: 16px; margin-right: 5px;">${horaFormateada}`;
        document.getElementById('sedeTurno').innerHTML = `<img src="./img/sede.png" style="width: 20px; margin-right: 5px;">${turno.Nombre_Sede}`;
        document.getElementById('direccionTurno').innerHTML = `<img src="./img/direccion.png" style="width: 20px; margin-right: 5px;">${turno.Direccion}`;
        document.getElementById('sala_espera_inactiva').style.display = 'none';
        document.getElementById('sala_espera_activa').style.display = 'block';
    } else {
        // No hay turnos en sala de espera, buscar el próximo turno más cercano
        obtenerTodosLosTurnos(urlTurnos, (turnos) => {
            const proximoTurno = obtenerProximoTurno(turnos);
            if (proximoTurno) {
                const fechaFormateada = formatearFecha(proximoTurno.Fecha);
                const horaFormateada = formatearHora(proximoTurno.Hora);
                const mensajeProximoTurno = `Programada para el día ${fechaFormateada} a las ${horaFormateada}`;
                document.querySelector('#sala_espera_inactiva p').textContent = mensajeProximoTurno;
            } else {
                // Si no hay turnos futuros, mantener el mensaje por defecto
                document.querySelector('#sala_espera_inactiva p').textContent = 'No hay turnos programados.';
            }

            document.getElementById('sala_espera_inactiva').style.display = 'block';
            document.getElementById('sala_espera_activa').style.display = 'none';
        });
    }
}

// Funciones para formatear la fecha y la hora en el formato requerido
function formatearFecha(fecha) {
    const fechaTurno = new Date(fecha);
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const diaSemana = diasSemana[fechaTurno.getDay()];
    const diaMes = fechaTurno.getDate();
    const mes = meses[fechaTurno.getMonth()];
    const año = fechaTurno.getFullYear();

    return `${diaSemana} ${diaMes} de ${mes}, ${año}`;
}

function formatearHora(hora) {
    const [horas, minutos] = hora.split(':');
    return `${horas}:${minutos} Hs`;
}

// Función para obtener los turnos del día de hoy
function obtenerTurnosHoy(urlTurnos) {
    fetch(urlTurnos)
        .then(response => response.json())
        .then(data => {
            mostrarTurnosHoy(data.Turnos);
        })
        .catch(error => console.error('Error fetching turnos data:', error));
}

// Función para mostrar los turnos de hoy
function mostrarTurnosHoy(turnos) {
    const today = new Date();
    const turnosHoyContainer = document.getElementById('proximos-turnos-hoy');
    const proximoTurnoContainer = document.getElementById('proximoTurnoContainer');

    // Filtra los turnos que son del día de hoy
    const turnosHoy = turnos.filter(turno => {
        const fechaTurno = new Date(turno.Fecha + 'T' + turno.Hora);
        return fechaTurno.toDateString() === today.toDateString();
    }).sort((a, b) => new Date(a.Fecha + 'T' + a.Hora) - new Date(b.Fecha + 'T' + b.Hora));

    // Filtra los turnos futuros
    const turnosFuturos = turnos.filter(turno => {
        const fechaTurno = new Date(turno.Fecha + 'T' + turno.Hora);
        return fechaTurno >= today;
    }).sort((a, b) => new Date(a.Fecha + 'T' + a.Hora) - new Date(b.Fecha + 'T' + b.Hora));

    const cantidadTurnosFuturos = turnosFuturos.length;

    if (turnosHoy.length > 0) {
        // Mostrar turnos de hoy
        turnosHoyContainer.style.display = 'block';
        turnosHoyContainer.innerHTML = ''; // Limpiar contenido previo

        turnosHoy.forEach((turno) => {
            const turnoCard = document.createElement('div');
            turnoCard.classList.add('tarjeta-turnos');
            turnoCard.innerHTML = `
                <div class="doctor-container">
                    <h3>${turno.Nombre_Prof}</h3>
                    <span class="icono-turnos-container"><img src="./img/mas.png" style="opacity: 0.6; width: 1em;"></span>
                </div>
                <div class="container-fecha-hora-confirmacion">
                    <span>${formatearFecha(turno.Fecha)}</span>
                    <span>${formatearHora(turno.Hora)}</span>
                    <span>${turno.Estado_Confirmacion || 'Sin confirmar'}</span>
                </div>
                <div class="container-buttons">
                    <button class="gray-button">CANCELAR</button>
                    <button class="blue-button">CONFIRMAR</button>
                </div>
            `;
            turnosHoyContainer.appendChild(turnoCard);
        });

        proximoTurnoContainer.style.display = 'none'; // Ocultar próximo turno si hay turnos hoy
    } else {
        // No hay turnos hoy, mostrar el próximo turno
        turnosHoyContainer.style.display = 'none';

        const proximoTurno = turnosFuturos.length > 0 ? turnosFuturos[0] : null; // Obtener el próximo turno

        if (proximoTurno) {
            proximoTurnoContainer.style.display = 'block';
            const fechaFormateada = formatearFecha(proximoTurno.Fecha);
            const horaFormateada = formatearHora(proximoTurno.Hora);

            document.getElementById('nombreProfesionalProximoTurno').textContent = proximoTurno.Nombre_Prof;
            document.getElementById('fechaProximoTurno').innerHTML = `<img src="./img/calendario.png" style="width: 20px; margin-right: 5px;">${fechaFormateada}`;
            document.getElementById('horaProximoTurno').innerHTML = `<img src="./img/reloj.png" style="width: 16px; margin-right: 5px;">${horaFormateada}`;
            document.getElementById('infoExtraProximoTurno').innerHTML = `<img src="./img/clinic.png" style="width: 17px; margin: 0 7px 7px 2px;">${proximoTurno.Domicilio_Sede}<br>${proximoTurno.Detalles_Extra || ''}`;
        } else {
            proximoTurnoContainer.style.display = 'none'; // No hay turnos futuros para mostrar
        }
    }

    // Actualizar el texto del botón "Ver todos" con la cantidad de turnos futuros
    const verTurnosButton = document.getElementById('ver_turnos');
    if (verTurnosButton) {
        verTurnosButton.textContent = `Ver todos (${cantidadTurnosFuturos})`; // Actualizar con el número de turnos futuros
        verTurnosButton.addEventListener('click', () => {
            const event = new CustomEvent('openMisTurnos');
            document.dispatchEvent(event);
        });
    }
}

// Función para obtener el próximo turno más cercano
function obtenerProximoTurno(turnos) {
    const fechaActual = new Date();
    const turnosFuturos = turnos.filter(turno => new Date(turno.Fecha + 'T' + turno.Hora) > fechaActual);

    if (turnosFuturos.length === 0) {
        return null; // No hay turnos futuros
    } else {
        turnosFuturos.sort((a, b) => new Date(a.Fecha + 'T' + a.Hora) - new Date(b.Fecha + 'T' + b.Hora));
        return turnosFuturos[0]; // Devuelve el próximo turno
    }
}

// Funciones de utilidad para mostrar y cerrar información adicional
export function mostrarInfo() {
    document.getElementById('info-popup').style.display = 'block';
}

export function cerrarInfo() {
    document.getElementById('info-popup').style.display = 'none';
}
