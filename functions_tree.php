<?php
include("functions.php");

// if (isset($_GET['token'])) {
//     $token = $_GET['token'];
//     $token = base64_decode($token);
//     $Data = explode('&', $token);
    
//     foreach($Data as $string) {
//         $substring = explode("=", $string);
        
//         if(count($substring) == 2) {
//             $key = $substring[0];
//             $value = $substring[1];
//             ${$key} = $value;
//         } else {
//             echo json_encode(array("Error" => "Error en la decodificación de la cadena."));
//             exit;
//         }
//     }
// } else {
//     echo json_encode(array("Error" => "Token no presente en la URL"));
//     exit;
// }

// if (!isset($Action)) {<
//     echo json_encode(array("Error" => "Action no definida"));
//     exit;
// }

// Nueva logica para evitar el token y usar las urls sin base64
if (isset($_GET['Action'])) {
    $Action = $_GET['Action'];

    // Verifica si hay otros parámetros en la URL
    foreach($_GET as $key => $value) {
        if ($key !== 'Action') {
            ${$key} = $value;
        }
    }
} else {
    echo json_encode(array("Error" => "Action no definida"));
    exit;
}

$Response = 0;
$Function = null;

switch($Action) {
    case "getLastLog":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getLastLog($Url, $Paciente_DNI);
        break;
    case "getCData":
        $Data = array($Cliente_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getCData($Url, $Cliente_Id);
        break;
    case "fullLogin":
        $Data = array($Cliente_Id, $Paciente_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = fullLogin($Url, $Paciente_Id);
        break;
    case "loginPassword":
        $Data = array($Cliente_Id, $Paciente_DNI, $Paciente_Password);
        $Url = getUrlCliente($Cliente_Id);
        $Function = loginPassword($Url, $Paciente_DNI, $Paciente_Password);
        break;
    case "loginDNI":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = loginDNI($Url, $Paciente_DNI);
        break;
    case "Turnos_Clinica":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = misTurnosClinica($Url, $Paciente_DNI);
        break;
    case "Estudios_Clinica":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = misEstudiosClinica($Url, $Paciente_DNI);
        break;
    case "Paciente_Clinica":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = misDatosClinica($Url, $Paciente_DNI);
        break;
    case "Mdf_Paciente":
        $Data = array($Cliente_Id, $Paciente_DNI, $Telefono, $Celular, $E_Mail, $Domicilio, $Password, $Genero, $Cobertura_Medica, $Nro_Afiliado);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = mdfPaciente($Url, $Paciente_DNI, $Telefono, $Celular, $E_Mail, $Domicilio, $Password, $Genero, $Cobertura_Medica, $Nro_Afiliado);
        break;
    case "Mdf_Password":
        $Data = array($Cliente_Id, $Paciente_DNI, $Old_Password, $New_Password);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = mdfPassword($Url, $Paciente_DNI, $Old_Password, $New_Password);
        break;
    case "Cancelar_Turno":
        $Data = array($Cliente_Id, $Agenda_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = cancelarTurno($Url, $Agenda_Id, $Paciente_DNI);
        break;
    case "Confirmar_Turno":
        $Data = array($Cliente_Id, $Agenda_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = confirmarTurno($Url, $Agenda_Id, $Paciente_DNI);
        break;
    case "getSedes":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getSedes($Url, $Paciente_DNI);
        break;
    case "profesionalesTurno":
        $Data = array($Cliente_Id, $Sede_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getProfesionalesTO($Url, $Sede_Id, $Paciente_DNI);
        break;
    case "getTurnosDisponibles":
        $Data = array($Cliente_Id, $Sede_Id, $Profesional_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getTurnosDisponibles($Url, $Sede_Id, $Profesional_Id, $Paciente_DNI);
        break;
    case "setTurno":
        $Data = array($Cliente_Id, $Turno_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = setTurno($Url, $Turno_Id, $Paciente_DNI);
        $Response = 1;
        break;
    case "createUserClinica":
        $Data = array($Cliente_Id, $Nombre, $Apellido, $DNI, $Mail, $Password, $Fecha_Nacimiento);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = createUserClinica($Url, $Nombre, $Apellido, $DNI, $Mail, $Password, $Fecha_Nacimiento);
        break;
    case "getPlanes":
        $Data = array($Cliente_Id, $Deudor_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getPlanes($Url, $Deudor_Id);
        if(isset($Function['Result'])) {
            $Response = 1;
        }
        break;
    case "formRegister":
        $Data = array($Cliente_Id, $Nombres, $Apellido, $DNI, $Mail, $Telefono, $Celular, $Deudor_Id, $Nro_Afiliado, $Plan_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = formRegister($Url, $Nombres, $Apellido, $DNI, $Mail, $Telefono, $Celular, $Deudor_Id, $Nro_Afiliado, $Plan_Id);
        $Response = 1;
        break;
    case "recoverPassword":
        $Data = array($Cliente_Id, $DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = recoverPassword($Url, $DNI);
        $Response = 1;
        break;
    case "getNotificaciones":
        $Data = array($Cliente_Id, $DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getNotificaciones($Url, $DNI, 0);
        $Response = 1;
        break;
    case "getNotificacionesVistas":
        $Data = array($Cliente_Id, $DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getNotificaciones($Url, $DNI, 1);
        $Response = 1;
        break;
    case "setVisto":
        $Data = array($Cliente_Id, $DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = setVisto($Url, $DNI);
        $Response = 1;
        break;
    case "getRecetas":
        $Data = array($Cliente_Id, $DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getRecetas($Url, $DNI);
        $Response = 1;
        break;
    case "getReceta":
        $Data = array($Cliente_Id, $Receta_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getReceta($Url, $Receta_Id, $Cliente_Id);
        $Response = 1;
        break;
    case "getCodigoTurno":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getCodigoTurno($Url, $Paciente_DNI);
        $Response = 1;
        break;
    case "getSalaEsperaAdmision":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getSalaEsperaAdmision($Url, $Paciente_DNI);
        $Response = 1;
        break;
    case "getDataTurnos":
        $Data = array($Cliente_Id, $Turno_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getDataTurnos($Url, $Turno_Id, $Paciente_DNI);
        $Response = 1;
        break;
    case "getListaDocumentos":
        $Data = array($Cliente_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getListaDocumentos($Url);
        $Response = 1;
        break;
    case "setDocumento":
        $Doc = new CURLFile($_FILES['Documento']['tmp_name'], 'mime', $_FILES['Documento']['name']);
        $Data = array($Cliente_Id, $Paciente_DNI, $Nombre, $_FILES['Documento']);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = setDocumento($Url, $Paciente_DNI, $Nombre, $Doc, "", '3');
        $Response = 1;
        break;
    case "getEstudiosConvenidos":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getEstudiosConvenidos($Url, $Paciente_DNI);
        $Response = 1;
        break;
    case "getCirugiasConvenidas":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getCirugiasConvenidas($Url, $Paciente_DNI);
        $Response = 1;
        break;
    case "setAutorizacion":
        $Doc = new CURLFile($_FILES['Documento']['tmp_name'], 'mime', $_FILES['Documento']['name']);
        $Data = array($Cliente_Id, $Paciente_DNI, $Nombre, $Fecha, $_FILES['Documento'], $Tipo);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = setDocumento($Url, $Paciente_DNI, $Nombre, $Doc, $Fecha, $Tipo);
        $Response = 1;
        break;
    case "getDocumentos":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getDocumentos($Url, $Paciente_DNI, "3");
        $Response = 1;
        break;
    case "getAutorizacionesEst":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getDocumentos($Url, $Paciente_DNI, "1");
        $Response = 1;
        break;
    case "getAutorizacionesCir":
        $Data = array($Cliente_Id, $Paciente_DNI);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = getDocumentos($Url, $Paciente_DNI, "2");
        $Response = 1;
        break;
    case "deleteDocumentos":
        $Data = array($Cliente_Id, $Paciente_DNI, $Documento_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = deleteDocumento($Url, $Documento_Id, $Paciente_DNI, "3");
        $Response = 1;
        break;
    case "deleteAutorizacionesEst":
        $Data = array($Cliente_Id, $Paciente_DNI, $Documento_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = deleteDocumento($Url, $Documento_Id, $Paciente_DNI, "1");
        $Response = 1;
        break;
    case "deleteAutorizacionesCir":
        $Data = array($Cliente_Id, $Paciente_DNI, $Documento_Id);
        $Url = getUrlCliente($_conn, $Cliente_Id);
        $Function = deleteDocumento($Url, $Documento_Id, $Paciente_DNI, "2");
        $Response = 1;
        break;
}

if (checkReqData($Data)) {
    echo $Function;
    if (isset($File)) {
        unlink("files/".$_FILES['Documento']['name']);
    }
} else {
    echo json_encode(array("Error" => "Faltan datos, o no estan declarados correctamente."));
}
?>
