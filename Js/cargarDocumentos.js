import { cookies } from "./cFunctions.js";

export function cargarDocumentos() {

    // Cargar todas los documentos del paciente.
    getDocumentos('getDocumentos');

    console.log('cargarDocumentosJs');

    const select = document.getElementById('select_cargarDocumentos');
    const button = document.getElementById('enviar_formulario_cargarDocumentos');

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    select.innerHTML = '<option selected disabled>Listado de nombres de documento...</option>';

    // Cargar Nombres de documentos
    // const UrlCargarNombres = `functions_tree.php?token=${btoa("Action=getListaDocumentos&Cliente_Id=" + clinicaId)}`;
    const UrlCargarNombres = `functions_tree.php?${"Action=getListaDocumentos&Cliente_Id=" + clinicaId}`;
    fetch(UrlCargarNombres)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            data.forEach(item => {
                let option = '<option value="'+item.Id+'">'+item.Nombre+'</option>';
                select.innerHTML += option;
            });

        });

    button.addEventListener("click", buttonCarga);

}

function buttonCarga() {

    const select = document.getElementById('select_cargarDocumentos');
    const inputFile = document.getElementById('input_cargarDocumentos');
    const button = document.getElementById('enviar_formulario_cargarDocumentos');
    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    button.removeEventListener("click", buttonCarga);

    console.log('button clicked');

    if (inputFile.files.length > 0 && select.selectedIndex !== 0) {

        button.innerHTML = '<div class="loader"></div>';

        const valor = select.value;
        const archivo = inputFile.files[0];
        const Action = 'setDocumento';

        const formData = new FormData();
        formData.append('Action', Action);
        formData.append('Cliente_Id', clinicaId);
        formData.append('Paciente_DNI', pacienteDNI);
        formData.append('Nombre', valor);
        formData.append('Documento', archivo);

        // let UrlCargarDocumento = 'functions_tree.php?token=' + btoa(formData.toString());
        let UrlCargarDocumento = 'functions_tree.php?' + formData.toString();

        fetch(UrlCargarDocumento, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {

            if (data.Result == 200) {
                console.log(data.Result);
                console.log(data.Tipo);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Proceso finalizado.',
                    text: 'El documento ha sido cargado correctamente.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                cargarDocumentos();
                // Cargar todas los documentos del paciente.
                getDocumentos('getDocumentos');

                inputFile.value = "";
                select.selectedIndex = 0;
                var newInputFile = inputFile.cloneNode(true);
                inputFile.parentNode.replaceChild(newInputFile, inputFile);

                button.addEventListener("click", buttonCarga);
            } else if (data.Result == 404) {
                console.log('paciente no encontrado');
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error.',
                    text: 'Paciente no encontrado, verifique DNI.',
                    showConfirmButton: false,
                    timer: 2000
                })
                button.innerHTML = 'Enviar';
                cargarDocumentos();
                button.addEventListener("click", buttonCarga);
            } else if (data.Result == 500) {
                console.log('Hubo un error');
                button.innerHTML = 'Enviar';
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Hubo un error.',
                    text: 'No se pudo cargar el documento: ' + data.Error + '.',
                    showConfirmButton: false,
                    timer: 2000
                })
                cargarDocumentos();
                button.addEventListener("click", buttonCarga);
            }
        });
    } else {

        Swal.fire(
            'Campos Incompletos',
            'Por favor, verifique haber seleccionado el nombre del documento y adjuntar el archivo correspondiente.',
            'warning'
        )

        button.addEventListener("click", buttonCarga);
    }
}

function getDocumentos(Action) {
    var container = document.getElementById('container_documentos');

    // Obtener ClinicaId y pacienteDNI
    const { clinicaId, pacienteDNI } = cookies;

    // const Url = `functions_tree.php?token=${btoa("Action=" + Action + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const Url = `functions_tree.php?${"Action=" + Action + "&Cliente_Id=" + clinicaId + "&Paciente_DNI=" + pacienteDNI}`;
    fetch(Url)
        .then(response => response.text())  // Cambiar a text para poder ver el contenido
        .then(text => {
            console.log('Texto recibido:', text);  // Log del texto recibido
            let data;
            try {
                data = JSON.parse(cleanJSON(text));  // Intentar parsear el texto a JSON
            } catch (e) {
                console.error('Error al parsear JSON:', e.message);
                data = {};  // Tratar como objeto vacío si hay error
            }

            if (data.Result == 200) {
                console.log(data.Result);
                console.log(data.Documentos);

                // Colocar el último elemento cargado primero
                data.Documentos.reverse();

                container.innerHTML =   '<a class="list-autorizaciones-header">' +
                                            '<span>Fecha</span>' +
                                            '<span>Nombre</span>' +
                                            '<span>Visto</span>' +
                                            '<span>Eliminar</span>' +
                                        '</a>';

                data.Documentos.forEach(function(documento) {
                    let fechaOriginal = documento.Fecha_Carga + 'T00:00:00';
                    let fechaFormateada = new Date(fechaOriginal).toLocaleDateString('es-ES');
                    let visto = '';
                    let eliminar = '';

                    switch (documento.Visto) {
                        case '1':
                            visto = '<span class="list-autorizaciones-item_viewed_"><img src="./img/visto.png" style="width: 25px;"></span>';
                            eliminar = '<img src="./img/Eliminar_item_notAllowed.png" style="width: 35px; cursor: not-allowed;"></img>';
                            break;
                        case '0':
                            visto = '<span class="list-autorizaciones-item_viewed"><img src="./img/no-visto.png" style="width: 25px;"></span>';
                            eliminar = '<img src="./img/Eliminar_item.png" style="width: 35px;"></img>';
                            break;
                        default:
                            visto = '<span class="list-autorizaciones-item_viewed"></span>';
                            break;
                    }

                    let item = '<span class="list-documentos-item">' +
                                    '<span class="list-autorizaciones-item_date">' + fechaFormateada + '</span>' +
                                    // incluir href
                                    '<a class="list-autorizaciones-item_title" href="' + documento.Root + '" target="_blank">' + documento.Nombre + '</a>' +
                                    // no incluir href
                                    // '<a class="list-autorizaciones-item_title">' + documento.Nombre + '</a>' +
                                    '<span class="list-autorizaciones-item_viewed">' + visto + '</span>' +
                                    '<a class="list-autorizaciones-item_delete" id="deleteDocumentos_' + documento.Id + '">' + eliminar + '</a>' +
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
                        });

                        swalWithBootstrapButtons.fire({
                            title: 'Eliminar documento',
                            text: "¿Confirma que desea eliminar el documento?",
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
                                    .then(response => response.text())
                                    .then(text => {
                                        let data;
                                        try {
                                            data = JSON.parse(cleanJSON(text));
                                        } catch (e) {
                                            console.error('Error al parsear JSON:', e.message);
                                            data = {};
                                        }

                                        if (data.Result == 200) {
                                            console.log(data.Result);
                                            swalWithBootstrapButtons.fire(
                                                'Proceso finalizado',
                                                'El documento se ha eliminado correctamente.',
                                                'success'
                                            );
                                            setTimeout(function() {
                                                getDocumentos('getDocumentos');
                                            }, 100);
                                        } else if (data.Result == 404) {
                                            console.log(data.Result);
                                            swalWithBootstrapButtons.fire(
                                                'Hubo un error.',
                                                'Paciente no encontrado. Verifique DNI.',
                                                'error'
                                            );
                                            setTimeout(function() {
                                                getDocumentos('getDocumentos');
                                            }, 100);
                                        } else if (data.Result == 500) {
                                            console.log(data.Result);
                                            swalWithBootstrapButtons.fire(
                                                'Hubo un error.',
                                                'No se pudo eliminar el documento. Intente de nuevo en unos segundos.',
                                                'error'
                                            );
                                            setTimeout(function() {
                                                getDocumentos('getDocumentos');
                                            }, 100);
                                        }
                                    });
                            }
                        });
                    });
                });
            } else if (data.Result == 404) {
                let mensajeImportante = '<span class="autorizaciones-container_message">' +
                                            '<h4>Importante</h4>' +
                                            '<p>Para garantizar que la documentación se envíe de manera adecuada, asegúrese de proporcionar toda la información necesaria completando todos los campos obligatorios.</p>' +
                                        '</span>';

                container.innerHTML = mensajeImportante;
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud fetch:', error);
        });
}

function cleanJSON(text) {
    const firstCurly = text.indexOf('{');
    const lastCurly = text.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1) {
        return text.substring(firstCurly, lastCurly + 1);
    }
    return text;
}
