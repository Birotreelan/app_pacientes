<?php
header('Content-Type: application/json; charset=utf-8');

//###############################################################################################################################
//########################################### Funciones generales ################################################################
//###############################################################################################################################
// Envia data al servidor
function getAPIdata($url, $fields) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, TRUE);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $fields);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-type: multipart/form-data'));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true );
     
    $data = curl_exec($curl);
    curl_close($curl);
    return $data;
}

// Extrae la URL del Cliente
function getUrlCliente($Cliente_Id) {
    // $SQL = "SELECT URL FROM clientes WHERE Id_Cliente='$Cliente_Id'";
    // $Query = mysqli_query($_conn, $SQL);
    // $Data = mysqli_fetch_array($Query);
    $Data_Url = "https://www.treelancloud.com.ar/biro/treelan";
    $Url = $Data_Url."/treelan_app/";
    // $Url = $Data['URL']."/treelan_app/";
    return $Url;
}

//Chequea que se haya enviado toda la información requerida
function checkReqData($Array) {
    foreach ($Array as $Data) {
        if (!isset($Data)) {
           return false;
        }
    }
    return true;
}

/*###############################################################################################################################
//##################### Funciones de envío ######################################################################################
//###############################################################################################################################*/

// Funciones de Login ------------------------------------------------------------------
function getCData($Url, $Cliente_Id) {
    $Params = array(
        "Action" => "getCData",
        "Cliente_Id" => $Cliente_Id
    );
    $Result = json_decode(getAPIdata($Url, $Params));
    $Result->Logo = 'logo/'.$Cliente_Id.'.png';
    return json_encode($Result);
}

function loginPassword($Url, $Paciente_DNI, $Paciente_Password) {
    $Params = array(
        "Action" => "loginPassword",
        "Paciente_DNI" => $Paciente_DNI,
        "Paciente_Pass" => $Paciente_Password
    );
    return getAPIdata($Url, $Params);
}

function fullLogin($Url, $Paciente_Id) {
    $Params = array(
        "Action" => "fullLogin",
        "Paciente_Id" => $Paciente_Id
    );
    return getAPIdata($Url, $Params);
}

function loginDNI($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "loginDNI",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function createUserClinica($Url, $Nombre, $Apellido, $DNI, $Mail, $Password, $Fecha_Nacimiento) {
    $Params = array(
        "Action" => "createUserClinica",
        "Nombre" => $Nombre,
        "Apellido" => $Apellido,
        "DNI" => $DNI,
        "Mail" => $Mail,
        "Password" => $Password,
        "Fecha_Nacimiento" => $Fecha_Nacimiento
    );
    return getAPIdata($Url, $Params);
}

function getLastLog($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getLastLog",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Index ----------------------------------------------------------------------
function misDatosClinica($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getPaciente",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Mi cuenta ----------------------------------------------------------------
function mdfPaciente($Url, $Paciente_DNI, $Telefono, $Celular, $E_Mail, $Domicilio, $Password, $Genero, $Deudor_Id, $Nro_Afiliado) {
    $params = array(
        "Action" => "mdfPaciente",
        "Paciente_DNI" => $Paciente_DNI,
        "Telefono" => $Telefono,
        "Celular" => $Celular,
        "E_Mail" => $E_Mail,
        "Domicilio" => $Domicilio,
        "Password" => $Password,
        "Sexo" => $Genero,
        "Deudor_Id" => $Deudor_Id,
        "Nro_Afiliado" => $Nro_Afiliado
    );
    return getAPIdata($Url, $params);
}

function getPlanes($Url, $Deudor_Id) {
    $Params = array(
        "Action" => "getPlanes",
        "Deudor_Id" => $Deudor_Id
    );
    return getAPIdata($Url, $Params);
}

function formRegister($Url, $Nombres, $Apellido, $DNI, $Mail, $Telefono, $Celular, $Deudor_Id, $Nro_Afiliado, $Plan_Id) {
    $Params = array(
        "Action" => "formRegister",
        "Nombres" => $Nombres,
        "Apellido" => $Apellido,
        "DNI" => $DNI,
        "Mail" => $Mail,
        "Telefono" => $Telefono,
        "Celular" => $Celular,
        "Deudor_Id" => $Deudor_Id,
        "Nro_Afiliado" => $Nro_Afiliado,
        "Plan_Id" => $Plan_Id
    );
    return getAPIdata($Url, $Params);
}

function recoverPassword($Url, $DNI) {
    $Params = array(
        "Action" => "recoverPassword",
        "DNI" => $DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Turnos ----------------------------------------------------------------
function misTurnosClinica($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getTurnos",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function cancelarTurno($Url, $Agenda_Id, $Paciente_DNI) {
    $Params = array(
        "Action" => "cancelTurno",
        "Agenda_Id" => $Agenda_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function confirmarTurno($Url, $Agenda_Id, $Paciente_DNI) {
    $params = array(
        "Action" => "confirmTurno",
        "Agenda_Id" => $Agenda_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $params);
}

function getSedes($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getSedes",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getProfesionalesTO($Url, $Sede_Id, $Paciente_DNI) {
    $Params = array(
        "Action" => "getProfesionalesTO",
        "Sede_Id" => $Sede_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getTurnosDisponibles($Url, $Sede_Id, $Profesional_Id, $Paciente_DNI) {
    $Params = array(
        "Action" => "getTurnosDisponibles",
        "Sede_Id" => $Sede_Id,
        "Profesional_Id" => $Profesional_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function setTurno($Url, $Turno_Id, $Paciente_DNI) {
    $Params = array(
        "Action" => "setTurno",
        "Turno_Id" => $Turno_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getDataTurnos($Url, $Turno_Id, $Paciente_DNI) {
    $Params = array(
        "Action" => "getDataTurnos",
        "Turno_Id" => $Turno_Id,
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Estudios ------------------------------------------------------------
function misEstudiosClinica($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getEstudios",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Notificaciones ------------------------------------------------------------
function getNotificaciones($Url, $Paciente_DNI, $Visto) {
    $Params = array(
        "Action" => "getNotificaciones",
        "Paciente_DNI" => $Paciente_DNI,
        "Visto" => $Visto
    );
    return getAPIdata($Url, $Params);
}

function setVisto($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "setVisto",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

// Funciones Recetas -------------------------------------------------------------------
function getRecetas($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getRecetas",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getReceta($Url, $Receta_Id, $Cliente_Id) {
    $Params = array(
        "Action" => "getReceta",
        "Receta_Id" => $Receta_Id
    );
    $Result = json_decode(getAPIdata($Url, $Params));
    $Result->Logo = 'logo/'.$Cliente_Id.'-2.png';
    return json_encode($Result);
}

// Funciones Sala de Espera -----------------------------------------------------------
function getCodigoTurno($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getCodigoTurno",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getSalaEsperaAdmision($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getSalaEsperaAdmision",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function mdfPassword($Url, $Paciente_DNI, $Old_Password, $New_Password) {
    $Params = array(
        "Action" => "mdfPassword",
        "Paciente_DNI" => $Paciente_DNI,
        "Password" => $New_Password,
        "Old_Password" => $Old_Password
    );
    return getAPIdata($Url, $Params);
}

function getListaDocumentos($Url) {
    $Params = array(
        "Action" => "getListaDocumentos"
    );
    return getAPIdata($Url, $Params);
}

function setDocumento($Url, $Paciente_DNI, $Nombre, $Documento, $Fecha, $Tipo) {
    $Params = array(
        "Action" => "setDocumento",
        "Nombre" => $Nombre,
        "Documento" => $Documento,
        "Paciente_DNI" => $Paciente_DNI,
        "Fecha" => $Fecha,
        "Tipo" => $Tipo
    );
    return getAPIdata($Url, $Params);
}

function getEstudiosConvenidos($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getEstudiosConvenidos",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getCirugiasConvenidas($Url, $Paciente_DNI) {
    $Params = array(
        "Action" => "getCirugiasConvenidas",
        "Paciente_DNI" => $Paciente_DNI
    );
    return getAPIdata($Url, $Params);
}

function getDocumentos($Url, $Paciente_DNI, $Tipo) {
    $Params = array(
        "Action" => "getDocumentos",
        "Paciente_DNI" => $Paciente_DNI,
        "Tipo" => $Tipo
    );
    return getAPIdata($Url, $Params);
}

function deleteDocumento($Url, $Documento_Id, $Paciente_DNI, $Tipo) {
    $Params = array(
        "Action" => "deleteDocumento",
        "Paciente_DNI" => $Paciente_DNI,
        "Documento_Id" => $Documento_Id,
        "Tipo" => $Tipo
    );
    return getAPIdata($Url, $Params);
}
?>
