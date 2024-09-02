import { cookies } from "./cFunctions.js";

let llamadasRealizadas = false; // Variable bandera para controlar las llamadas

export function cargarAutorizaciones() {
    if (llamadasRealizadas) {
        return; // Evita llamadas repetidas
    }

    // Cargar todas las autorizaciones del paciente.
    getAutorizaciones('getAutorizacionesEst');

    console.log('autorizacionesJs');

    const select = document.getElementById('select_autorizacionesEstudios');
    const button = document.getElementById('enviar_formulario_autorizacionesEstudios');

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    select.innerHTML = '<option disabled selected>Listado de estudios disponibles...</option>';
    // Listado de estudios convenidos
    // const UrlListadoEstudios = `functions_tree.php?token=${btoa("Action=getEstudiosConvenidos&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const UrlListadoEstudios = `functions_tree.php?${"Action=getEstudiosConvenidos&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(UrlListadoEstudios)
        .then(response => response.json())
        .then(data => {

            if (data.Result == 200)
            {
                console.log(data.Result);
                data.Convenio.forEach(item => {
                    let option = '<option value="'+item.Id+'">'+item.Nombre+'</option>';
                    select.innerHTML += option;
                });
            }
            else if (data.Result == 404)
            {
                console.log('no se encontraron resultados para ese deudor y plan');
                select.innerHTML = '<option disabled selected>No se encontraron resultados para su cobertura médica.</option>';
            }
        });

    button.addEventListener("click", buttonCarga);
    }

    function buttonCarga() {

        const select = document.getElementById('select_autorizacionesEstudios');
        const inputDate = document.getElementById('input_date_autorizacionesEstudios');
        const inputFile = document.getElementById('input_file_autorizacionesEstudios');
        const button = document.getElementById('enviar_formulario_autorizacionesEstudios');
        // Obtener ClinicaId y pacienteDNI
        const { clinicaId, pacienteDNI } = cookies;

        button.removeEventListener("click", buttonCarga);

        console.log('button clicked');

        if (inputDate.value !== "" && inputFile.files.length > 0 && select.selectedIndex !== 0) {

        button.innerHTML = '<div class="loader"></div>';

        const valor = select.value;
        const fecha = inputDate.value;
        const archivo = inputFile.files[0];
        const Action = 'setAutorizacion';
        var Tipo = document.getElementById('enviar_formulario_autorizacionesEstudios').value;

        const formData = new FormData();
        formData.append('Action', Action);
        formData.append('Tipo', Tipo);
        formData.append('Cliente_Id', clinicaId);
        formData.append('Paciente_DNI', pacienteDNI);
        formData.append('Nombre', valor);
        formData.append('Documento', archivo);
        formData.append('Fecha', fecha);

        // let UrlCargarDocumento = 'functions_tree.php?token=' + btoa(formData.toString());
        let UrlCargarDocumento = 'functions_tree.php?' + formData.toString();

        fetch(UrlCargarDocumento, {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {

            if (data.Result == 200)
            {
                console.log(data.Result);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Proceso finalizado',
                    text: 'La '+data.Tipo+' ha sido cargada correctamente.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                // Cargar todas las autorizaciones del paciente.
                setTimeout(function() {
                getAutorizaciones('getAutorizacionesEst');
                }, 100);

                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas

                inputDate.value = "";
                inputFile.value = ""; // Esto vacía el valor actual
                select.selectedIndex = 0;
                var newInputFile = inputFile.cloneNode(true); // Clona el elemento
                inputFile.parentNode.replaceChild(newInputFile, inputFile); // Reemplaza el elemento original con el clon

                button.addEventListener("click", buttonCarga);
            }
            else if (data.Result == 404)
            {
                console.log('paciente no encontrado');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Paciente no encontrado. Verifique DNI.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas
                button.addEventListener("click", buttonCarga);
            }
            else if (data.Result == 500)
            {
                console.log('Hubo un error');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo cargar el documento: ' + data.Error + '.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas

                inputDate.value = "";
                inputFile.value = ""; // Esto vacía el valor actual
                select.selectedIndex = 0;
                var newInputFile = inputFile.cloneNode(true); // Clona el elemento
                inputFile.parentNode.replaceChild(newInputFile, inputFile); // Reemplaza el elemento original con el clon

                button.addEventListener("click", buttonCarga);
            }
        });
    } else {

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, verifique haber seleccionado el nombre de estudio, fecha y adjuntar el archivo correspondiente.',
            showConfirmButton: true
        })
    
        button.addEventListener("click", buttonCarga);
    }
};

export function cargarAutorizaciones_cirugias() {
    if (llamadasRealizadas) {
        return; // Evita llamadas repetidas
    }

    // Cargar todas las autorizaciones del paciente.
    getAutorizaciones('getAutorizacionesCir');

    const select = document.getElementById('select_autorizacionesCirugias');
    const button = document.getElementById('enviar_formulario_autorizacionesCirugias');

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    select.innerHTML = '<option disabled selected>Listado de cirugías disponibles...</option>';
    //Listado de cirugias convenidas
    // const UrlListadoCirugias = `functions_tree.php?token=${btoa("Action=getCirugiasConvenidas&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const UrlListadoCirugias = `functions_tree.php?${"Action=getCirugiasConvenidas&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(UrlListadoCirugias)
        .then(response => response.json())
        .then(data => {

            if (data.Result == 200)
            {
                console.log(data.Result);
                data.Convenio.forEach(item => {
                    let option = '<option value="'+item.Id+'">'+item.Nombre+'</option>';
                    select.innerHTML += option;
                });
            }
            else if (data.Result == 404)
            {
                console.log('no se encontraron resultados para ese deudor y plan');
                select.innerHTML = '<option disabled selected>No se encontraron resultados para su cobertura médica.</option>';
            }
        });

    button.addEventListener("click", buttonCarga_Cirugias);
    }

    function buttonCarga_Cirugias() {

        const select = document.getElementById('select_autorizacionesCirugias');
        const inputDate = document.getElementById('input_date_autorizacionesCirugias');
        const inputFile = document.getElementById('input_file_autorizacionesCirugias');
        const button = document.getElementById('enviar_formulario_autorizacionesCirugias');
    
        // Obtener ClinicaId y pacienteDNI
        const { clinicaId, pacienteDNI } = cookies;

        button.removeEventListener("click", buttonCarga_Cirugias);

        console.log('button clicked');

        if (inputDate.value !== "" && inputFile.files.length > 0 && select.selectedIndex !== 0) {

        button.innerHTML = '<div class="loader"></div>';

        const valor = select.value;
        const fecha = inputDate.value;
        const archivo = inputFile.files[0];
        const Action = 'setAutorizacion';
        var Tipo = document.getElementById('enviar_formulario_autorizacionesCirugias').value;

        const formData = new FormData();
        formData.append('Action', Action);
        formData.append('Tipo', Tipo);
        formData.append('Cliente_Id', clinicaId);
        formData.append('Paciente_DNI', pacienteDNI);
        formData.append('Nombre', valor);
        formData.append('Documento', archivo);
        formData.append('Fecha', fecha);

        // let UrlCargarDocumento = 'functions_tree.php?token=' + btoa(formData.toString());
        let UrlCargarDocumento = 'functions_tree.php?' + formData.toString();

        fetch(UrlCargarDocumento, {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {

            if (data.Result == 200)
            {
                console.log(data.Result);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Proceso finalizado',
                    text: 'La '+data.Tipo+' ha sido cargada correctamente.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar'; 
                setTimeout(function() {
                getAutorizaciones('getAutorizacionesCir');
                }, 100);
                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas

                inputDate.value = "";
                inputFile.value = ""; // Esto vacía el valor actual
                select.selectedIndex = 0;
                var newInputFile = inputFile.cloneNode(true); // Clona el elemento
                inputFile.parentNode.replaceChild(newInputFile, inputFile); // Reemplaza el elemento original con el clon

                button.addEventListener("click", buttonCarga_Cirugias);
            }
            else if (data.Result == 404)
            {
                console.log('paciente no encontrado');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Paciente no encontrado. Verifique DNI.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas
                button.addEventListener("click", buttonCarga_Cirugias);
            }
            else if (data.Result == 500)
            {
                console.log('Hubo un error');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo cargar la autorización. Intente nuevamente en unos segundos.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                llamadasRealizadas = false; // Restablecer la variable para permitir futuras llamadas
                button.addEventListener("click", buttonCarga_Cirugias);
            }
        });
    } else {

            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, verifique haber seleccionado el nombre de cirugía, fecha y adjuntar el archivo correspondiente.',
                showConfirmButton: true
            })
    
            button.addEventListener("click", buttonCarga);
    }
};

function getAutorizaciones(Action) {
    let nombre_contenedor = '';
    var nombre_pestana = '';
    var eliminar = '';

    switch (Action) {
        case 'getAutorizacionesEst':
          nombre_contenedor = 'container_autorizaciones_estudios';
          nombre_pestana = 'estudio';
          eliminar = 'deleteAutorizacionesEst';
          break;
        case 'getAutorizacionesCir':
          nombre_contenedor = 'container_autorizaciones_cirugias';
          nombre_pestana = 'cirugía';
          eliminar = 'deleteAutorizacionesCir';
          break;
        default:
          break;
    }

    var container = document.getElementById(nombre_contenedor);

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    // const Url = `functions_tree.php?token=${btoa("Action=" + Action + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const Url = `functions_tree.php?${"Action=" + Action + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(Url)
        .then(response => response.json())
        .then(data => {

            if (data.Result == 200) {
                console.log(data.Result);
                console.log(data.Documentos);

                // Ordenar los documentos por fecha de manera ascendente
                data.Documentos.sort(function(a, b) {
                    return new Date(a.Fecha_Autorizacion) - new Date(b.Fecha_Autorizacion);
                });

                container.innerHTML = '<a class="list-autorizaciones-header">' +
                                            '<span>Fecha programada</span>' +
                                            '<span>Nombre de '+nombre_pestana+'</span>' +
                                            '<span>Visto</span>' +
                                            '<span>Eliminar</span>' +
                                        '</a>';

                data.Documentos.forEach(function(documento) {
                    let fechaOriginal = documento.Fecha_Autorizacion+ 'T00:00:00';
                    let fechaFormateada = new Date(fechaOriginal).toLocaleDateString('es-ES');
                    let visto = '';

                    switch (documento.Visto) {
                        case '1':
                            visto = '<img src="./img/visto.png" style="width: 25px;">';
                            break;
                        case '0':
                            visto = '<img src="./img/no-visto.png" style="width: 25px;">';
                            break;
                        default:
                            visto = '';
                            break;
                    }

                    let item = '<span class="list-autorizaciones-item">' +
                                    '<span class="list-autorizaciones-item_date">'+fechaFormateada+'</span>' +
                                    '<a class="list-autorizaciones-item_title" href="'+documento.Root+'" target="_blank">'+documento.Nombre+'</a>' +
                                    '<span class="list-autorizaciones-item_viewed">'+visto+'</span>' +
                                    '<span class="list-autorizaciones-item_delete" id="'+eliminar+'_'+documento.Id+'"><img src="./img/Eliminar_item.png" style="width: 35px;"></span>' +
                                '</span>';

                    container.innerHTML += item;

                    });

                    // Obtén todos los elementos con la clase "list-autorizaciones-item_delete"
                    const elementos = document.querySelectorAll('.list-autorizaciones-item_delete');

                    // Agrega un event listener click a cada elemento
                    elementos.forEach(elemento => {
                    elemento.addEventListener('click', () => {

                        const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                              confirmButton: 'btn btn-success',
                              cancelButton: 'btn btn-danger'
                            },
                            buttonsStyling: false
                          })
                          
                          swalWithBootstrapButtons.fire({
                            title: 'Eliminar autorización',
                            text: "¿Confirma que desea eliminar la autorización?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Si, Eliminar',
                            cancelButtonText: 'Cancelar',
                            reverseButtons: true
                          }).then((result) => {
                            if (result.isConfirmed) {

                                // Obtén el id del elemento clickeado
                                const id = elemento.id;

                                elemento.innerHTML = '<div class="loader"></div>';

                                // Divide el id usando "_" como separador
                                const valores = id.split('_');

                                // Crea la variable "Action" y almacena el primer fragmento obtenido
                                const Action = valores[0];

                                // Crea la variable "Id" y almacena el segundo fragmento obtenido
                                const Id = valores[1];

                                // Haz lo que necesites con las variables "Action" y "Id"
                                console.log('Action:', Action);
                                console.log('Id:', Id);

                                // const Url = `functions_tree.php?token=${btoa("Action=" + Action + "&Documento_Id=" + Id + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
                                const Url = `functions_tree.php?${"Action=" + Action + "&Documento_Id=" + Id + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
                                fetch(Url)
                                .then(response => response.json())
                                .then(data => {

                                    if (data.Result == 200)
                                    {
                                        console.log(data.Result);
                                        swalWithBootstrapButtons.fire(
                                            'Proceso finalizado',
                                            'La autorización se ha eliminado correctamente.',
                                            'success'
                                          )
                                          setTimeout(function() {
                                            getAutorizaciones('getAutorizacionesEst');
                                            getAutorizaciones('getAutorizacionesCir');
                                            cargarAutorizaciones();
                                            cargarAutorizaciones_cirugias();
                                        }, 100);
                                    }
                                    else if (data.Result == 404)
                                    {
                                        console.log(data.Result);
                                        swalWithBootstrapButtons.fire(
                                            'Hubo un error.',
                                            'Paciente no encontrado. Verifique DNI.',
                                            'error'
                                          )
                                          setTimeout(function() {
                                            getAutorizaciones('getAutorizacionesEst');
                                            getAutorizaciones('getAutorizacionesCir');
                                            cargarAutorizaciones();
                                            cargarAutorizaciones_cirugias();
                                        }, 100);
                                    }
                                    else if (data.Result == 500) {
                                        console.log(data.Result);
                                        swalWithBootstrapButtons.fire(
                                            'Hubo un error.',
                                            'No se pudo eliminar la autorización. Intente de nuevo en unos segundos.',
                                            'error'
                                          )
                                          setTimeout(function() {
                                            getAutorizaciones('getAutorizacionesEst');
                                            getAutorizaciones('getAutorizacionesCir');
                                            cargarAutorizaciones();
                                            cargarAutorizaciones_cirugias();
                                        }, 100);
                                    }
                                });
                            } else if (
                              /* Read more about handling dismissals below */
                              result.dismiss === Swal.DismissReason.cancel
                            ) {
                              return;
                            }
                          })
                            
                        

                    });
                    });
                } else if (data.Result == 404) {

                    let mensajeImportante = '<span class="autorizaciones-container_message">' +
                                                '<h4>Importante</h4>' +
                                                '<p>Para garantizar que el formulario se envíe de manera adecuada, asegúrese de proporcionar toda la información necesaria completando todos los campos obligatorios.</p>' +
                                            '</span>';
            
                    container.innerHTML = mensajeImportante;
            
                }
        });
}
