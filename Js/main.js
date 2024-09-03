import { logOffCookies, checkLogIn, cookies } from "./cFunctions.js";
import { aside } from "./aside.js";
import { miPerfil } from './perfil.js';
import { misTurnos } from './turnos.js';
import { nuevoTurno } from './nuevoTurno.js';
import { misEstudios } from './estudios.js';
import { cargarDocumentos } from './cargarDocumentos.js';
import { cargarAutorizaciones } from './autorizaciones.js';
import { cargarAutorizaciones_cirugias } from './autorizaciones.js';
import { notificaciones } from './notificaciones.js';

// Verificar login cookies
checkLogIn();

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");

  // Función para obtener el valor de una cookie por su nombre
  function getCookie(name) {
      let cookieArr = document.cookie.split(";");
      
      for (let i = 0; i < cookieArr.length; i++) {
          let cookiePair = cookieArr[i].split("=");
          
          if (name == cookiePair[0].trim()) {
              return decodeURIComponent(cookiePair[1]);
          }
      }
      return null;
  }

  // Obtener la URL de la imagen de la cookie 'ClinicaImg'
  let clinicaImgUrl = getCookie("ClinicaImg");

  // Verificar si la URL de la imagen existe en la cookie y cambiar el logo
  if (clinicaImgUrl) {
      document.getElementById("logo").src = clinicaImgUrl;
  }

  // Almacenar las pestañas disponibles
  const pestanasDisponibles = [
    'inicio',
    'mi-perfil',
    'mis-turnos',
    'autorizacion-cirugias',
    'autorizacion-estudios',
    'mis-estudios',
    'cargar-documentos'
  ];

  // Obtén la URL base inicial (antes de las pestañas)
  const urlBase = window.location.pathname;

  // Event Listener para el evento popstate
  window.addEventListener("popstate", function (event) {
    console.log(event);
    // Obtener la URL actual
    const nuevaURL = window.location.pathname;
    console.log(nuevaURL);

    var nombrePestana = nuevaURL.substring(nuevaURL.lastIndexOf('/') + 1);

    console.log(nombrePestana);

    // Realizar acciones específicas en función del nombre de la pestaña
    switch (nombrePestana) {
      case 'inicio':
        open_inicio();
        break;
      case 'mi-perfil':
        open_miPerfil();
        break;
      case 'mis-turnos':
        open_misTurnos();
        break;
      case 'autorizacion-cirugias':
        open_misCirugias();
        break;
      case 'autorizacion-estudios':
        open_misAutorizaciones();
        break;
      case 'mis-estudios':
        open_misEstudios();
        break;
      case 'mis-tramites-recetas':
        open_misTramitesyRecetas();
        break;
      case 'cargar-documentos':
        open_cargarDocumentos();
        break;
      // Agrega más casos para las demás pestañas si es necesario
      default:
        // Acción por defecto si la URL no coincide con ninguna pestaña conocida
        break;
    }
  });

  // Función para abrir una pestaña y modificar la URL
  function abrirPestanaYModificarURL(nombrePestana) {
    // Verificar si la pestaña es válida
    if (pestanasDisponibles.includes(nombrePestana)) {
      // Modifica la URL agregando el nombre de la pestaña detrás de la URL base
      const nuevaURL = urlBase + nombrePestana;
      history.pushState({}, '', nuevaURL);
    }
  }

  abrirPestanaYModificarURL('inicio');

  // Función para retroceder a la pestaña anterior
  function retrocederAPestanaAnterior() {
    if (currentIndex > 0) {
      currentIndex--;
      const pestañaAnterior = historialPestanas[currentIndex];
      abrirPestanaYModificarURL(pestañaAnterior);
    }
  }

  // Función para avanzar a la siguiente pestaña
  function avanzarAPestanaSiguiente() {
    if (currentIndex < historialPestanas.length - 1) {
      currentIndex++;
      const pestañaSiguiente = historialPestanas[currentIndex];
      abrirPestanaYModificarURL(pestañaSiguiente);
    }
  }

  // Asigna las funciones de retroceso y avance a los botones del navegador si es necesario
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      retrocederAPestanaAnterior();
    } else if (event.key === "ArrowRight") {
      avanzarAPestanaSiguiente();
    }
  });

    // Nombre de paciente en pagina de inicio
    // let UrlNombre = "functions_tree.php?token=" + btoa("Action=Paciente_Clinica&Cliente_Id=" + cookies.clinicaId + "&Paciente_DNI=" + cookies.pacienteDNI);
    let UrlNombre = "functions_tree.php?" + "Action=Paciente_Clinica&Cliente_Id=" + cookies.clinicaId + "&Paciente_DNI=" + cookies.pacienteDNI;
    fetch(UrlNombre)
    .then(response => response.json())
    .then(data => {

        document.getElementById('welcome_name').innerHTML = 'Hola, '+data.Nombres+'!<br>Bienvenido a Tu Portal.';
        
    });

    // Test preAdmision
    let UrlAdmision = "functions_tree.php?" + "Action=getSalaEsperaAdmision&Cliente_Id=" + cookies.clinicaId + "&Paciente_DNI=" + cookies.pacienteDNI;
    fetch(UrlAdmision)
    .then(response => response.json())
    .then(data => {

        console.log(data);
        
    });

    // Cargar todas las pestañas
    aside();
    miPerfil();
    misTurnos();
    nuevoTurno();
    cargarAutorizaciones();
    cargarAutorizaciones_cirugias();
    misEstudios();
    cargarDocumentos();
    notificaciones();

    // Pestañas
    const inicio = document.getElementById('inicio');
    const miPerfilElement = document.getElementById('miPerfil');
    const misTurnosElement = document.getElementById('misTurnos');
    const misCirugias = document.getElementById('misCirugias');
    const misAutorizaciones = document.getElementById('misAutorizaciones');
    const misEstudiosElement = document.getElementById('misEstudios');
    const misTramitesyRecetas = document.getElementById('misTramitesyRecetas');
    // const cargarDocumentosElement = document.getElementById('cargarDocumentos');
    const mobileVideo = document.getElementById('mobile_video');

    // Botones Aside
    const inicio_button = document.getElementById('aside-menu-option_inicio');
    const miPerfil_button = document.getElementById('aside-menu-option_miPerfil');
    const misTurnos_button = document.getElementById('aside-menu-option_misTurnos');
    const misCirugias_button = document.getElementById('aside-menu-option_misCirugias');
    const misAutorizaciones_button = document.getElementById('aside-menu-option_misAutorizaciones');
    const misEstudios_button = document.getElementById('aside-menu-option_misEstudios');
    const misTramitesyRecetas_button = document.getElementById('aside-menu-option_misTramitesyRecetas');
    // const cargarDocumentos_button = document.getElementById('aside-menu-option_cargarDocumentos');
    const autorizaciones_ul = document.getElementById('ul-autorizaciones');
    const autorizaciones_submenu =  document.getElementById('submenu-angle-autorizaciones');
    const autorizacion_cirugias = document.getElementById('autorizaciones_cirugias');
    const autorizacion_estudios = document.getElementById('autorizaciones_estudios');

    // Botones Inicio
    const inicio_perfil_button = document.getElementById('inicio_perfil_button');
    const inicio_turnos_button = document.getElementById('inicio_turnos_button');
    const inicio_cirugias_button = document.getElementById('inicio_cirugias_button');
    const inicio_autorizaciones_button = document.getElementById('inicio_autorizaciones_button');
    const inicio_estudios_button = document.getElementById('inicio_estudios_button');
    // const inicio_cargarDocumentos_button = document.getElementById('inicio_cargarDocumentos_button');

    // Menu header
    const header_menu_inicio = document.getElementById('header_menu_inicio');
    const header_menu_misTurnos = document.getElementById('header_menu_misTurnos');
    const header_menu_miPerfil = document.getElementById('header_menu_miPerfil');
    const header_menu_misEstudios = document.getElementById('header_menu_misEstudios');
    const header_menu_misCirugias = document.getElementById('header_menu_misCirugias');
    const header_menu_misAutorizaciones = document.getElementById('header_menu_misAutorizaciones');
    const header_menu_misTramitesyRecetas = document.getElementById('header_menu_misTramitesyRecetas');
    // const header_menu_cargarDocumentos = document.getElementById('header_menu_cargarDocumentos');
    const header_menu_icon = document.getElementById('header_icon');
    var checkbox = document.getElementById('btn-menu');


    // Cerrar Sesion
    let logOffBtn = document.getElementById('header_menu_cerrarSesion');
    logOffBtn.addEventListener("click", function () {
        logOffCookies(cookies.token)
    });

    // Logo
    const logo = document.getElementById('logo');

    // Titulo pestaña en header
    const headerTitle = document.getElementById('header_title');

    // Funciones Open / Close
    function open_inicio()
    {
        console.log('open_inicio');
        inicio.style.display = '';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        header_menu_icon.src = './img/inicio-icon.png';
        headerTitle.innerText = 'Inicio';
        checkbox.checked = false;
        mobileVideo.style.display = 'flex';
        abrirPestanaYModificarURL('inicio');
    }
    function open_miPerfil()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = '';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        header_menu_icon.src = './img/miPerfil-icon.png';
        headerTitle.innerText = 'Mi Perfil';
        checkbox.checked = false; 
        controlClick = true;
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('mi-perfil');
    }
    function open_misTurnos()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = '';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        header_menu_icon.src = './img/misTurnos-icon.png';
        headerTitle.innerText = 'Mis Turnos';
        checkbox.checked = false;
        controlClick = true;
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('mis-turnos');
        
    }
    function open_misCirugias()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = '';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = '';
        autorizaciones_submenu.style.display = '';
        cargarDocumentosElement.style.display = 'none';
        checkbox.checked = false;
        headerTitle.innerText = 'Autorizaciones';
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('autorizacion-cirugias');
        document.getElementById('enviar_formulario_autorizacionesEstudios').value = '2';
        
        
    }
    function open_misAutorizaciones()
    {
        headerTitle.innerText = 'Autorizaciones';
        autorizaciones_ul.style.display = '';
        autorizaciones_submenu.style.display = '';
        misAutorizaciones.style.display = '';
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        header_menu_icon.src = './img/misAutorizaciones-icon.png';
        checkbox.checked = false;
        controlClick = true;
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('autorizacion-estudios');
        document.getElementById('enviar_formulario_autorizacionesEstudios').value = '1';
        
    }
    function open_misEstudios()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = '';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        checkbox.checked = false;
        header_menu_icon.src = './img/misEstudios-icon.png';
        headerTitle.innerText = 'Mis Estudios';
        controlClick = true;
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('mis-estudios');
    }
    function open_cargarDocumentos()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = 'none';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = '';
        header_menu_icon.src = './img/cargarDocumentos-icon.png';
        checkbox.checked = false;
        headerTitle.innerText = 'Autorizaciones y documentos';
        controlClick = true;
        mobileVideo.style.display = 'none';
        abrirPestanaYModificarURL('cargar-documentos');
    }
    function open_misTramitesyRecetas()
    {
        inicio.style.display = 'none';
        miPerfilElement.style.display = 'none';
        misTurnosElement.style.display = 'none';
        misCirugias.style.display = 'none';
        misAutorizaciones.style.display = 'none';
        misEstudiosElement.style.display = 'none';
        misTramitesyRecetas.style.display = '';
        autorizaciones_ul.style.display = 'none';
        autorizaciones_submenu.style.display = 'none';
        cargarDocumentosElement.style.display = 'none';
        checkbox.checked = false;
        headerTitle.innerText = 'Mis Tramites y Recetas';
        mobileVideo.style.display = 'none';
    }

    // Event Listeners Aside
    inicio_button.addEventListener("click", open_inicio)
    miPerfil_button.addEventListener("click", open_miPerfil);
    misTurnos_button.addEventListener("click", open_misTurnos);
    misCirugias_button.addEventListener("click", open_misCirugias);

    var controlClick = true;
    misAutorizaciones_button.addEventListener("click", function () {
        if (controlClick) {

          open_misAutorizaciones();
          controlClick = false;
        } else {

          open_inicio();
          controlClick = true;
        }
    });
    misEstudios_button.addEventListener("click", open_misEstudios);
    misTramitesyRecetas_button.addEventListener("click", open_misTramitesyRecetas);
    // cargarDocumentos_button.addEventListener("click", open_cargarDocumentos);
    autorizacion_cirugias.addEventListener("click", open_misCirugias);
    autorizacion_estudios.addEventListener("click", open_misAutorizaciones);

    // Event Listeners Inicio
    inicio_perfil_button.addEventListener("click", open_miPerfil);
    inicio_turnos_button.addEventListener("click", open_misTurnos);
    inicio_cirugias_button.addEventListener("click", open_misCirugias);
    inicio_autorizaciones_button.addEventListener("click", open_misAutorizaciones);
    inicio_estudios_button.addEventListener("click", open_misEstudios);
    // inicio_tramitesyrecetas_button.addEventListener("click", open_misTramitesyRecetas);
    // inicio_cargarDocumentos_button.addEventListener("click", open_cargarDocumentos);

    // Evenet Listeners Menu Header
    header_menu_inicio.addEventListener("click", open_inicio);
    header_menu_miPerfil.addEventListener("click", open_miPerfil);
    header_menu_misTurnos.addEventListener("click", open_misTurnos);
    header_menu_misCirugias.addEventListener("click", open_misCirugias);
    header_menu_misEstudios.addEventListener("click", open_misEstudios);
    header_menu_misAutorizaciones.addEventListener("click", open_misAutorizaciones);
    header_menu_misTramitesyRecetas.addEventListener("click", open_misTramitesyRecetas);
    // header_menu_cargarDocumentos.addEventListener("click", open_cargarDocumentos);
    // header_menu_cerrarSesion.addEventListener("click", cerrarSesion);

    // Event Listener Logo
    logo.addEventListener("click", open_inicio);

});
