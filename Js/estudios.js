import { cookies } from "./cFunctions.js";

function convertirFecha(fecha) {
    // Divide la fecha en año, mes y día
    const partes = fecha.split("-");
    
    // Formatea la fecha en el nuevo formato
    const fechaFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    
    return fechaFormateada;
}

export function misEstudios() {
    console.log('misEstudiosJs');

    const misEstudiosContainer = document.getElementById('mis-estudios_container');
    misEstudiosContainer.innerHTML = '';

    // Obtener ClinicaId y pacienteDNI
    const ClinicaId = cookies.clinicaId;
    const pacienteDNI = cookies.pacienteDNI;

    // const UrlEstudios = `functions_tree.php?token=${btoa("Action=Estudios_Clinica&Cliente_Id=" + ClinicaId + "&Paciente_DNI=" + pacienteDNI)}`;
    const UrlEstudios = `functions_tree.php?${"Action=Estudios_Clinica&Cliente_Id=" + ClinicaId + "&Paciente_DNI=" + pacienteDNI}`;

    fetch(UrlEstudios)
        .then(response => response.json())
        .then(data => {

            if (data.Numero_Estudios === 0) {

                const estudio = `
                    <a class="mis-estudios-item" style="grid-template-columns: 10px 1fr;">
                        <span class="mis-estudios-item_title">No se encontró ningún estudio.</span>
                    </a>`;

                misEstudiosContainer.insertAdjacentHTML('beforeend', estudio);

            } else {

                data.Estudios.forEach(element => {

                    let fechaConvertida = convertirFecha(element.Fecha);

                    let estudio = `
                        <a class="mis-estudios-item" href="${element.Link}" target="_blank">
                            <span class="mis-estudios-item_date">${fechaConvertida}</span>
                            <span class="mis-estudios-item_title">${element.Titulo}</span>
                        </a>`;

                    misEstudiosContainer.insertAdjacentHTML('beforeend', estudio);
                });
            }
        })
}