import { cookies } from "./cFunctions.js";

export function nuevoTurno() {

    document.getElementById('obtener-nuevo-turno').addEventListener('click', function() {
        const Cliente_Id = getCookie('ClinicaId');
        const Paciente_DNI = getCookie('PacienteDNI');

        if (!Cliente_Id || !Paciente_DNI) {
            console.error('No se pudieron obtener las cookies necesarias.');
            return;
        }

        const urlSedes = "functions_tree.php?" + "Action=getSedes&Cliente_Id=" + Cliente_Id + '&Paciente_DNI=' + Paciente_DNI;

        const turnosContainer = document.getElementById('mis-turnos_container');
        turnosContainer.innerHTML = '';

        const nuevoTurnoContainer = document.createElement('div');
        nuevoTurnoContainer.className = 'nuevo-turno-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-step active" data-step="1">1. Selección de Sede</div>
            <div class="progress-step" data-step="2">2. Selección de Profesional</div>
            <div class="progress-step" data-step="3">3. Selección de Fecha y Hora</div>
            <div class="progress-step" data-step="4">4. Confirmación de Turno</div>
        `;
        nuevoTurnoContainer.appendChild(progressBar);

        const etapasContainer = document.createElement('div');
        etapasContainer.id = 'etapas-container';

        const etapas = [
            { id: 'sede', title: 'Selección de Sede', content: '<select id="select-sede"></select>' },
            { id: 'profesional', title: 'Selección de Profesional', content: '<select id="select-profesional"></select>' },
            { 
                id: 'fecha-hora', 
                title: 'Selección de Fecha y Hora', 
                content: '<div id="calendario-horarios-container"><input id="fecha-hora-input" type="text" placeholder="Seleccione fecha y hora"><input type="hidden" id="idTurnoHidden"></div>' 
            },
            { id: 'confirmacion', title: 'Confirmación de Turno', content: '<p id="confirmacion-texto">Revise y confirme su turno.</p>' }
        ];

        etapas.forEach((etapa, index) => {
            const etapaDiv = document.createElement('div');
            etapaDiv.id = `etapa-${etapa.id}`;
            etapaDiv.className = 'etapa';
            etapaDiv.style.display = index === 0 ? 'block' : 'none';
            etapaDiv.innerHTML = `
                <h3>${etapa.title}</h3>
                ${etapa.content}
                <br>
                <div id="btn-next-prev-container">
                <button ${index === 0 ? 'disabled' : ''} class="btn-prev">Anterior</button>
                <button class="btn-next">${index === etapas.length - 1 ? 'Confirmar' : 'Siguiente'}</button>
                </div>
            `;
            etapasContainer.appendChild(etapaDiv);
        });

        nuevoTurnoContainer.appendChild(etapasContainer);
        turnosContainer.appendChild(nuevoTurnoContainer);

        fetchSedes(urlSedes);

        let currentStep = 1;
        let Sede_Id = null;

        document.querySelectorAll('.btn-next').forEach((button, index) => {
            button.addEventListener('click', () => {
                if (currentStep < etapas.length) {
                    if (currentStep === 1) {
                        const selectSede = document.getElementById('select-sede');
                        Sede_Id = selectSede.options[selectSede.selectedIndex].value;

                        cargarProfesionales(Cliente_Id, Sede_Id, Paciente_DNI);
                    }

                    if (currentStep === 2) {
                        const selectProfesional = document.getElementById('select-profesional');
                        const Profesional_Id = selectProfesional.options[selectProfesional.selectedIndex].value;

                        cargarFechasDisponibles(Cliente_Id, Sede_Id, Profesional_Id, Paciente_DNI);
                    }

                    if (currentStep === 3) {
                        const btnNextStep = document.querySelector(`#etapa-fecha-hora .btn-next`);
                        btnNextStep.addEventListener('click', () => {

                            const fechaSeleccionada = document.getElementById('fecha-hora-input')._flatpickr.selectedDates[0];
                            const horarioSeleccionado = document.querySelector('.horario-button.active').textContent;

                            console.log("Fecha seleccionada:", fechaSeleccionada);
                            console.log("Horario seleccionado:", horarioSeleccionado);

                            // Avanzar al siguiente paso
                            document.getElementById(`etapa-${etapas[currentStep - 1].id}`).style.display = 'none';
                            if (currentStep < etapas.length) {
                                document.getElementById(`etapa-${etapas[currentStep].id}`).style.display = 'block';
                                currentStep++;
                                updateProgressBar(currentStep);

                                // Agregar evento al botón "Confirmar" en la etapa 4
                                if (currentStep === 4) {
                                    const btnConfirmar = document.querySelector(`#etapa-confirmacion .btn-next`);
                                    btnConfirmar.addEventListener('click', () => {
                                        const idTurno = document.getElementById('idTurnoHidden').value;
                                        confirmarTurno(Cliente_Id, Paciente_DNI, idTurno);
                                    });
                                }
                            }
                        });
                    } else {
                        document.getElementById(`etapa-${etapas[currentStep - 1].id}`).style.display = 'none';
                        document.getElementById(`etapa-${etapas[currentStep].id}`).style.display = 'block';
                        currentStep++;
                        updateProgressBar(currentStep);
                    }
                }
            });
        });

        document.querySelectorAll('.btn-prev').forEach((button, index) => {
            button.addEventListener('click', () => {
                if (currentStep > 1) {
                    document.getElementById(`etapa-${etapas[currentStep - 1].id}`).style.display = 'none';
                    document.getElementById(`etapa-${etapas[currentStep - 2].id}`).style.display = 'block';
                    currentStep--;
                    updateProgressBar(currentStep);
                }
            });
        });
    });

    function fetchSedes(urlSedes) {
        const selectSede = document.getElementById('select-sede');
        
        fetch(urlSedes)
            .then(response => response.json())
            .then(data => {
                if (data.Estado === 200 && Array.isArray(data.Sedes)) {
                    data.Sedes.forEach(sede => {
                        const option = document.createElement('option');
                        option.value = sede.Id;
                        option.textContent = sede.Nombre_Completo;
                        selectSede.appendChild(option);
                    });
                } else {
                    console.error('Error en la respuesta del servidor:', data);
                }
            })
            .catch(error => {
                console.error('Error al cargar sedes:', error);
            });
    }

    function cargarProfesionales(Cliente_Id, Sede_Id, Paciente_DNI) {
        const UrlProfesionales = "functions_tree.php?" + 'Action=profesionalesTurno&Cliente_Id=' + Cliente_Id + '&Sede_Id=' + Sede_Id + '&Paciente_DNI=' + Paciente_DNI;

        console.log("Llamada AJAX a:", UrlProfesionales);

        let optionProfesional = '';

        fetch(UrlProfesionales)
            .then(res => {
                console.log("Estado de la respuesta:", res.status);
                return res.json();
            })
            .then(datos => {
                console.log("Datos devueltos por el servidor:", datos);

                if (Array.isArray(datos) && datos.length > 0) {
                    datos.forEach(profesional => {
                        optionProfesional += `<option value="${profesional.Id}">${profesional.Apellido} ${profesional.Nombres}</option>`;
                    });
        
                    const selectProfesional = document.getElementById('select-profesional');
                    selectProfesional.innerHTML = '';
                    selectProfesional.innerHTML += '<option value="" disabled selected="selected">Seleccione un Profesional...</option>';
                    selectProfesional.innerHTML += optionProfesional;
                } else {
                    console.warn("No se encontraron profesionales disponibles.");
                }
            })
            .catch(error => {
                console.error('Error al cargar profesionales:', error);
            });
    }

    function cargarFechasDisponibles(Cliente_Id, Sede_Id, Profesional_Id, Paciente_DNI) {
        let urlFechas = "functions_tree.php?" + "Action=getTurnosDisponibles&Cliente_Id=" + Cliente_Id + "&Profesional_Id=" + Profesional_Id + "&Sede_Id=" + Sede_Id + "&Paciente_DNI=" + Paciente_DNI;

        console.log("Llamada AJAX a:", urlFechas);

        fetch(urlFechas)
            .then(res => res.json())
            .then(data => {
                console.log("Fechas disponibles:", data); 
                
                const fechaHoraInput = document.getElementById('fecha-hora-input');
                
                const enableDates = Object.keys(data).map(fecha => {
                    return fecha.replace(/,/g, '-');
                });

                console.log("Fechas habilitadas para flatpickr:", enableDates);

                // Inicializar flatpickr para seleccionar la fecha
                const fp = flatpickr(fechaHoraInput, {
                    locale: "es", // Configurar flatpickr en español
                    dateFormat: "Y-m-d",
                    altInput: true,
                    altFormat: "F j, Y",
                    minDate: "today",
                    enable: enableDates,
                    inline: true,
                    onChange: function(selectedDates, dateStr, instance) {
                        const selectedDate = dateStr;
                        console.log('Fecha seleccionada:', selectedDate);
                        
                        const horarios = data[selectedDate.replace(/-/g, ',')];
                        if (horarios) {
                            mostrarHorariosDisponibles(horarios);
                        } else {
                            console.warn("No hay horarios disponibles para esta fecha.");
                        }
                    }
                });

                fechaHoraInput.style.display = 'none';

                if (enableDates.length === 0) {
                    console.warn("No hay fechas disponibles.");
                } else {
                    const today = new Date().toISOString().split('T')[0];
                    const fechaMasProxima = enableDates.includes(today) ? today : enableDates[0];

                    fp.setDate(fechaMasProxima, true);
                    mostrarHorariosDisponibles(data[fechaMasProxima.replace(/-/g, ',')]);
                }
            })
            .catch(error => {
                console.error('Error al cargar fechas disponibles:', error);
            });
    }

    function mostrarHorariosDisponibles(horarios) {
        const container = document.createElement('div');
        container.className = 'horarios-disponibles-container';

        horarios.forEach(horario => {
            const button = document.createElement('button');
            button.className = 'horario-button';

            // Formatear la hora para que no muestre los segundos
            const horaSinSegundos = horario.Hora.slice(0, 5); // "HH:MM:SS" -> "HH:MM"

            button.textContent = horaSinSegundos;
            button.setAttribute('data-id', horario.Id);

            button.addEventListener('click', () => {
                console.log('Hora seleccionada:', horaSinSegundos);
                document.getElementById('idTurnoHidden').value = horario.Id;
                let idTurno = horario.Id;
                console.log('ID Turno seleccionado:', idTurno);

                // Obtener la fecha y hora seleccionadas
                const fechaSeleccionada = document.getElementById('fecha-hora-input')._flatpickr.selectedDates[0];
                const horarioSeleccionado = horaSinSegundos;

                // Formatear la fecha seleccionada
                const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const fechaFormateada = fechaSeleccionada.toLocaleDateString('es-ES', opcionesFecha);

                // Generar el mensaje de confirmación
                const mensajeConfirmacion = `Usted ha seleccionado la fecha ${fechaFormateada} a las ${horarioSeleccionado}Hs. ¿Desea confirmar su turno?`;

                // Mostrar el mensaje en el contenedor del paso 4
                document.getElementById('confirmacion-texto').textContent = mensajeConfirmacion;

                // Remover clase .active de cualquier botón previamente activo
                const activeButton = container.querySelector('.horario-button.active');
                if (activeButton) {
                    activeButton.classList.remove('active');
                }

                // Agregar clase .active al botón clickeado
                button.classList.add('active');
            });

            container.appendChild(button);
        });

        const fechaHoraInput = document.getElementById('fecha-hora-input');
        const parent = document.getElementById('calendario-horarios-container');

        // Eliminar cualquier lista de horarios previa
        const prevContainer = parent.querySelector('.horarios-disponibles-container');
        if (prevContainer) {
            prevContainer.remove();
        }

        parent.appendChild(container);
    }

    function confirmarTurno(Cliente_Id, Paciente_DNI, idTurno) {
        let UrlPasoFinal = 'Action=setTurno&Turno_Id=' + idTurno + '&Paciente_DNI=' + Paciente_DNI + '&Cliente_Id=' + Cliente_Id;
        let UrlConfirmacion = 'functions_tree.php?' + UrlPasoFinal;

        fetch(UrlConfirmacion)
            .then(res => res.json())
            .then(datos => {
                console.log(datos);
            })
            .catch(error => {
                console.error('Error al confirmar el turno:', error);
            });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function updateProgressBar(step) {
        document.querySelectorAll('.progress-step').forEach((elem) => {
            if (parseInt(elem.getAttribute('data-step')) <= step) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        });
    }
}
