import { cookies } from "./cFunctions.js";

export function miPerfil() {
    console.log('miPerfilJs');

    // Obtener elementos
    const elements = {
        nombre: document.getElementById('miPerfil_nombre'),
        nro_afiliado: document.getElementById('miPerfil_afiliado'),
        nro_hc: document.getElementById('miPerfil_hc'),
        dni: document.getElementById('miPerfil_dni'),
        fecha_nacimiento: document.getElementById('miPerfil_fechaNacimiento'),
        genero: document.getElementById('miPerfil_genero'),
        cobertura_medica: document.getElementById('miPerfil_coberturaMedica'),
        domicilio: document.getElementById('miPerfil_domicilio'),
        celular: document.getElementById('miPerfil_celular'),
        telefono: document.getElementById('miPerfil_telefono'),
        email: document.getElementById('miPerfil_email'),
        password: document.getElementById('miPerfil_password'),
        showHidePassword: document.getElementById('showhide_password'),
        input_password: document.getElementById('miPerfil_password'),
        cambiarDatos_button: document.getElementById('cambiar-datos'),
        inputs: document.querySelectorAll('.miPerfil_input'),
        headerPacienteData: document.getElementById('header_paciente_data'),
        formularioObraSocial: document.getElementById('formularioObraSocial'),
    };

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    // Peticion de informacion Paciente_Clinica
    // const UrlPerfil = `functions_tree.php?token=${btoa("Action=Paciente_Clinica&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const UrlPerfil = `functions_tree.php?${"Action=Paciente_Clinica&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(UrlPerfil)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Convertir el formato de la fecha de nacimiento
            const fechaInicial = data.Fecha_Nac;
            const partesFecha = fechaInicial.split("-");
            const fechaFormateada = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]).toISOString().slice(0, 10);

            // Insertar valores
            elements.nombre.innerHTML = data.Apellido + ', ' + data.Nombres;
            elements.nro_afiliado.value = data.Nro_Afiliado;
            elements.nro_hc.value = data.HC;
            elements.dni.value = data.DNI;
            elements.fecha_nacimiento.value = fechaFormateada;
            elements.genero.value = data.Genero;

            // Cobertura medica: Iterar a través de los Deudores y crear elementos <option> en base a ellos
            data.Deudores.forEach(deudor => {
                const option = document.createElement('option');
                option.id = deudor.Id;
                option.text = deudor.Nombre;

                // Verificar si el deudor está seleccionado y establecer selected en consecuencia
                if (deudor.Selected) {
                    option.selected = true;
                }

                elements.cobertura_medica.appendChild(option);
            });
            elements.domicilio.value = data.Domicilio;
            elements.celular.value = data.Celular;
            elements.telefono.value = data.Telefono;
            elements.email.value = data.Mail;
            elements.password.value = data.Password;

            // Insertar datos en el header
            let headerContent = data.Apellido + ', ' + data.Nombres;
            if (data.HC !== '') {
                headerContent += ' - HC: ' + data.HC;
            }
            elements.headerPacienteData.innerHTML = headerContent;

            // Verificar si es la primera vez
            if (data.Primera_Vez) {
                showDatosPaciente(data, clinicaId);
            }
        });

    // Mostrar u ocultar contraseña
    elements.showHidePassword.setAttribute('src', './img/hide.png');
    elements.input_password.setAttribute('type', 'password');

    elements.showHidePassword.addEventListener('click', () => {
        if (elements.showHidePassword.getAttribute('src') === './img/hide.png') {
            elements.showHidePassword.setAttribute('src', './img/show.png');
            elements.input_password.setAttribute('type', 'text');
        } else {
            elements.showHidePassword.setAttribute('src', './img/hide.png');
            elements.input_password.setAttribute('type', 'password');
        }
    });

    // Posicionarse en cualquier input, activa el boton cambiar datos
    elements.inputs.forEach(input => {
        input.addEventListener('focus', () => {
            elements.cambiarDatos_button.disabled = false;
            elements.cambiarDatos_button.style.display = '';
        });
    });

    elements.cambiarDatos_button.addEventListener('click', () => {
        elements.cambiarDatos_button.innerHTML = '<div class="loader"></div>';

        // Obtener el id del option seleccionado en Cobertura medica
        const optionSeleccionado = elements.cobertura_medica.options[elements.cobertura_medica.selectedIndex];
        const option_cobertura_id = optionSeleccionado.id;

        changeProfile(
            clinicaId,
            pacienteDNI,
            elements.telefono.value,
            elements.celular.value,
            elements.domicilio.value,
            elements.email.value,
            elements.password.value,
            elements.genero.value,
            option_cobertura_id,
            elements.nro_afiliado.value
        );
    });

    function changeProfile(ClinicaId, pacienteDNI, telefono, celular, domicilio, email, password, genero, cobertura_medica, nro_afiliado) {
        console.log('change profile');
        // const UrlCambiarDatos = `functions_tree.php?token=${btoa("Action=Mdf_Paciente&Cliente_Id=" + ClinicaId + "&Paciente_DNI=" + pacienteDNI + "&Telefono=" + telefono + "&Celular=" + celular + "&Domicilio=" + domicilio + "&E_Mail=" + email + "&Password=" + password + "&Genero=" + genero + "&Cobertura_Medica=" + cobertura_medica + "&Nro_Afiliado=" + nro_afiliado)}`;
        const UrlCambiarDatos = `functions_tree.php?${"Action=Mdf_Paciente&Cliente_Id=" + ClinicaId + "&Paciente_DNI=" + pacienteDNI + "&Telefono=" + telefono + "&Celular=" + celular + "&Domicilio=" + domicilio + "&E_Mail=" + email + "&Password=" + password + "&Genero=" + genero + "&Cobertura_Medica=" + cobertura_medica + "&Nro_Afiliado=" + nro_afiliado}`;
        fetch(UrlCambiarDatos)
            .then(response => response.json())
            .then(data => {
                if (data.result == 200) {
                    miPerfil();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'La información se actualizó correctamente.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    elements.cambiarDatos_button.innerHTML = 'Cambiar Datos';
                    elements.cambiarDatos_button.disabled = true;
                } else {
                    console.log("error en la actualizacion de los datos");
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'No se pudo actualizar la información. Intente nuevamente en unos segundos.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
    }
}

function showDatosPaciente(pacienteData, clinicaId) {
    let formulario_obra_social = document.getElementById('formularioObraSocial');

    if (pacienteData.Primera_Vez) {
        formulario_obra_social.style.display = 'flex';

        let selectObraSocial = document.getElementById('registro-obraSocial');
        selectObraSocial.innerHTML = '<option disabled selected>Seleccione Obra Social</option>';

        pacienteData.Deudores.forEach(element => {
            let option_obraSocial = '<option id="' + element.Id + '" value="' + element.Id + '">' + element.Nombre + '</option>';
            selectObraSocial.innerHTML += option_obraSocial;
        });

        let registro_nombre = document.getElementById('registro-nombre');
        let registro_apellido = document.getElementById('registro-apellido');
        let registro_DNI = document.getElementById('registro-dni');
        let registro_mail = document.getElementById('registro-email');
        let registro_telefono = document.getElementById('registro-telefono');
        let registro_celular = document.getElementById('registro-celular');

        registro_nombre.value = pacienteData.Nombres;
        registro_apellido.value = pacienteData.Apellido;
        registro_DNI.value = pacienteData.DNI;
        registro_mail.value = pacienteData.Mail;
        registro_telefono.value = pacienteData.Telefono;
        registro_celular.value = pacienteData.Celular;

        function verificarRegistros() {
            // Verificar campos de entrada
            const inputRegistros = document.querySelectorAll('.input-registro');
            for (const input of inputRegistros) {
                if (input.value.trim() === '') {
                    input.classList.add('error-border');
                } else {
                    input.classList.remove('error-border');
                }
            }

            // Verificar campos selectores
            const selectRegistros = document.querySelectorAll('.select-registro');
            for (const select of selectRegistros) {
                const initialValue = select.getAttribute('data-initial-value');
                if (select.value === initialValue) {
                    select.classList.add('error-border');
                } else {
                    select.classList.remove('error-border');
                }
            }
        }

        // Obtener elementos de entrada y selectores
        const inputs = document.querySelectorAll('.input-registro');
        const selects = document.querySelectorAll('.select-registro');

        // Guardar valores iniciales para selectores
        selects.forEach(select => {
            select.setAttribute('data-initial-value', select.value);
        });

        // Ejecutar la función cuando se produzcan cambios en los campos
        inputs.forEach(input => {
            input.addEventListener('input', verificarRegistros);
        });

        selects.forEach(select => {
            select.addEventListener('change', verificarRegistros);
        });

        // Verificar el estado inicial al cargar la página
        verificarRegistros();

        if (!selectObraSocial.dataset.eventAdded) {
            selectObraSocial.addEventListener('change', function(event) {
                var selectedElement = event.target.selectedOptions[0];
                var Deudor_Id = selectedElement.id;
                // let urlPlanes = "functions_tree.php?token=" + btoa("Action=getPlanes&Cliente_Id=" + clinicaId + "&Deudor_Id=" + Deudor_Id);
                let urlPlanes = "functions_tree.php?" + "Action=getPlanes&Cliente_Id=" + clinicaId + "&Deudor_Id=" + Deudor_Id;

                let selectPlanes = document.getElementById('registro-plan');
                selectPlanes.innerHTML = '<option disabled selected>Seleccione un plan</option>';

                fetch(urlPlanes)
                    .then(response => response.json())
                    .then(planes => {
                        planes.forEach(element => {
                            let optionPlan = '<option id="' + element.Id + '" value="' + element.Id + '">' + element.Nombre + '</option>';
                            selectPlanes.innerHTML += optionPlan;
                        });
                    });
            });

            selectObraSocial.dataset.eventAdded = true;

            let cargaDatos = document.getElementById('cargarDatos');
            let loaderCargaDatos = document.getElementById('loader-registrarme');
            let subtitulo = document.getElementById('subtitle_box_registro');
            cargaDatos.addEventListener('click', () => {
                loaderCargaDatos.style.display = '';
                cargaDatos.style.display = 'none';

                let Nombres = document.getElementById('registro-nombre').value;
                let Apellido = document.getElementById('registro-apellido').value;
                let DNI = document.getElementById('registro-dni').value;
                let Mail = document.getElementById('registro-email').value;
                let Telefono = document.getElementById('registro-telefono').value;
                let Celular = document.getElementById('registro-celular').value;

                let Deudor_select = document.getElementById('registro-obraSocial');
                var DeudorId = Deudor_select.value;

                let Plan_select = document.getElementById('registro-plan');
                var PlanId = Plan_select.value;

                let Nro_Afiliado = document.getElementById('registro-numeroAfiliado').value;

                if (Nombres != '' && Apellido != '' && DNI != '' && Mail != '' && Telefono != '' && Celular != '' && DeudorId != '' && PlanId != '' && Nro_Afiliado != '') {
                    // let urlCargaDatos = "functions_tree.php?token=" + btoa('Action=formRegister&Cliente_Id=' + clinicaId + '&Nombres=' + Nombres + '&Apellido=' + Apellido + '&DNI=' + DNI + '&Mail=' + Mail + '&Telefono=' + Telefono + '&Celular=' + Celular + '&Deudor_Id=' + DeudorId + '&Nro_Afiliado=' + Nro_Afiliado + '&Plan_Id=' + PlanId);
                    let urlCargaDatos = "functions_tree.php?" + 'Action=formRegister&Cliente_Id=' + clinicaId + '&Nombres=' + Nombres + '&Apellido=' + Apellido + '&DNI=' + DNI + '&Mail=' + Mail + '&Telefono=' + Telefono + '&Celular=' + Celular + '&Deudor_Id=' + DeudorId + '&Nro_Afiliado=' + Nro_Afiliado + '&Plan_Id=' + PlanId;
                    fetch(urlCargaDatos)
                        .then(response => response.json())
                        .then(carga => {
                            if (carga.Result == 200) {
                                document.getElementById('loader-registrarme').style.display = "none";
                                document.getElementById('ok-registrarme').style.display = "flex";
                                // Espera 1,5 segundos (1500 milisegundos) antes de ocultar la ventana
                                setTimeout(function() {
                                    document.getElementById('formularioObraSocial').style.display = 'none';
                                }, 1500);
                            } else {
                                loaderCargaDatos.style.display = 'none';
                                cargaDatos.style.display = '';
                                subtitulo.style.display = '';
                                subtitulo.innerHTML = 'Hubo un error. intente de nuevo más tarde.';
                                subtitulo.style.color = 'red';
                            }
                        });
                } else {
                    loaderCargaDatos.style.display = 'none';
                    cargaDatos.style.display = '';
                    subtitulo.style.display = '';
                    subtitulo.innerHTML = 'Complete todos los campos';
                    subtitulo.style.color = 'red';
                }
            });
        }
    } else {
        formulario_obra_social.style.display = 'none';
    }
}

