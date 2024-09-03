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
            const totalEstudios = dataEstudios.Estudios.length; // Total de estudios
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

    // Mostrar el contenedor solo si hay estudios nuevos
    if (estudiosNuevos.length > 0) {
        tarjetaEstudiosContainer.style.display = 'block';
        tarjetaEstudiosContainer.innerHTML = '';

        const headerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <h2 class="titulo">Nuevos estudios</h2>
                <a class="enlace" id="ver_estudios">Ver todos (${totalEstudios})</a> <!-- Muestra el total de estudios -->
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
    } else {
        // Ocultar el contenedor si no hay estudios nuevos
        tarjetaEstudiosContainer.style.display = 'none';
    }
}

// Función para obtener los turnos en sala de espera
function obtenerTurnosEnSalaEspera(urlSalaEspera, urlTurnos) {
    fetch(urlSalaEspera)
        .then(response => response.json())
        .then(data => {
            mostrarTurnosEnSalaEspera(data);
            obtenerTurnosHoy(urlTurnos);
        })
        .catch(error => console.error('Error fetching sala de espera data:', error));
}

// Función para mostrar turnos en sala de espera
function mostrarTurnosEnSalaEspera(data) {
    if (data.length > 0) {
        let turno = data[0];
        document.getElementById('pacientesEspera').textContent = turno.Pacientes_Espera;
        document.getElementById('nombreProfesional').textContent = turno.Profesional;
        document.getElementById('fechaTurno').innerHTML = `<img src="./img/calendario.png" style="width: 20px; margin-right: 5px;">${turno.Fecha.split('-').reverse().join('/')}`;
        document.getElementById('horaTurno').innerHTML = `<img src="./img/reloj.png" style="width: 16px; margin-right: 5px;">${turno.Hora}`;
        document.getElementById('sedeTurno').innerHTML = `<img src="./img/sede.png" style="width: 20px; margin-right: 5px;">${turno.Nombre_Sede}`;
        document.getElementById('direccionTurno').innerHTML = `<img src="./img/direccion.png" style="width: 20px; margin-right: 5px;">${turno.Direccion}`;
        document.getElementById('sala_espera_inactiva').style.display = 'none';
        document.getElementById('sala_espera_activa').style.display = 'block';
    }
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

    const turnosHoy = turnos.filter(turno => {
        const fechaTurno = new Date(turno.Fecha + 'T' + turno.Hora);
        return fechaTurno.toDateString() === today.toDateString();
    }).sort((a, b) => new Date(a.Fecha + 'T' + a.Hora) - new Date(b.Fecha + 'T' + b.Hora));

    if (turnosHoy.length > 0) {
        turnosHoyContainer.style.display = 'block';
        turnosHoy.forEach((turno, index) => {
            const turnoCard = document.createElement('div');
            turnoCard.classList.add('tarjeta-turnos');
            turnoCard.innerHTML = `
                <div class="doctor-container">
                    <h3>${turno.Nombre_Prof}</h3>
                    <span class="icono-turnos-container"><img src="./img/mas.png" style="opacity: 0.6; width: 1em;"></span>
                </div>
                <div class="container-fecha-hora-confirmacion">
                    <span>${turno.Fecha.split('-').reverse().join('/')}</span>
                    <span>${turno.Hora.slice(0, 5)} Hs</span>
                    <span>${turno.Estado_Confirmacion || 'Sin confirmar'}</span>
                </div>
                <div class="container-buttons">
                    <button class="gray-button">CANCELAR</button>
                    <button class="blue-button">CONFIRMAR</button>
                </div>
            `;
            turnosHoyContainer.appendChild(turnoCard);
        });
        proximoTurnoContainer.style.display = 'none';
    } else {
        turnosHoyContainer.style.display = 'none';
        proximoTurnoContainer.style.display = 'block';
    }
}

// Funciones de utilidad para mostrar y cerrar información adicional
export function mostrarInfo() {
    document.getElementById('info-popup').style.display = 'block';
}

export function cerrarInfo() {
    document.getElementById('info-popup').style.display = 'none';
}
