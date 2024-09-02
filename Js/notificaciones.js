export function notificaciones() {
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

    const Cliente_Id = getCookie('ClinicaId');
    const Paciente_DNI = getCookie('PacienteDNI');
    let showingAllNotifications = false; // Estado para verificar si se están mostrando todas las notificaciones
    let menuAbierto = false; // Variable para rastrear si el menú está abierto

    function loadNotifications(url, showAll = false) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);

                // Actualiza las notificaciones en la interfaz
                const notificationCount = document.getElementById('notification-count');
                const notificationMenu = document.getElementById('notification-menu');

                // Limpiar las notificaciones existentes pero mantener el enlace "Ver todas las notificaciones"
                notificationMenu.innerHTML = '';

                if (data.Result === 404 && !showAll) {
                    // No hay nuevas notificaciones
                    notificationCount.textContent = '0';
                    notificationMenu.innerHTML += '<li><p class="dropdown-item text-center text-muted"><strong>No hay nuevas notificaciones</strong></p></li>';
                } else {
                    const notifications = data.Notificaciones || [];
                    notificationCount.textContent = notifications.length;

                    notifications.reverse().forEach(notificacion => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <a class="dropdown-item" href="#">
                                <strong>${notificacion.Texto}</strong><br>
                                <small class="text-muted">${notificacion.Fecha} - ${notificacion.Hora}</small>
                            </a>`;
                        notificationMenu.appendChild(li);
                    });
                }

                // Agregar siempre el enlace "Ver todas las notificaciones" o "Ocultar todas las notificaciones"
                const viewAll = document.createElement('li');
                viewAll.innerHTML = `
                    <hr class="dropdown-divider">
                    <a class="dropdown-item text-center" href="#" id="view-all-notifications">
                        ${showAll ? 'Ocultar todas las notificaciones' : 'Ver todas las notificaciones'}
                    </a>`;
                notificationMenu.appendChild(viewAll);

                // Agregar evento al enlace "Ver todas las notificaciones" u "Ocultar todas las notificaciones"
                document.getElementById('view-all-notifications').addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation(); // Evita que el menú se cierre
                    if (showAll) {
                        loadNotifications('functions_tree.php?Action=getNotificaciones&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI);
                        showingAllNotifications = false;
                    } else {
                        loadAllNotifications();
                        showingAllNotifications = true;
                    }
                });
            })
            .catch(error => {
                console.error('Error al hacer el fetch:', error);
            });
    }

    function loadAllNotifications() {
        let allNotificationsUrl = 'functions_tree.php?Action=getNotificacionesVistas&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI;
        loadNotifications(allNotificationsUrl, true); // Cargar todas las notificaciones con el flag `showAll` en true
    }

    function setVistoAndReload() {
        let setVistoUrl = 'functions_tree.php?Action=setVisto&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI;
        fetch(setVistoUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error en la solicitud: ' + res.status);
                }
                return res.json();
            })
            .then(datos => {
                console.log('Notificaciones marcadas como vistas:', datos);
                // Después de marcar como vistas, recargar las notificaciones
                let notificationUrl = 'functions_tree.php?Action=getNotificaciones&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI;
                loadNotifications(notificationUrl);
            })
            .catch(error => {
                console.error('Error al marcar las notificaciones como vistas:', error);
            });
    }

    // Cargar notificaciones al cargar la página
    if (Cliente_Id && Paciente_DNI) {
        let notificationUrl = 'functions_tree.php?Action=getNotificaciones&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI;
        loadNotifications(notificationUrl);
    } else {
        console.error('No se encontraron las cookies necesarias.');
    }

    // Agregar evento de clic al ícono de notificaciones
    const notificationIcon = document.getElementById('dropdownNotifications');
    notificationIcon.addEventListener('click', function(event) {
        menuAbierto = !menuAbierto; // Alternar el estado del menú
        if (!menuAbierto) {
            // Si el menú se ha cerrado, marcar como vistas y recargar notificaciones
            setVistoAndReload();
        }
    });

    // Detectar clics fuera del menú para cerrarlo
    document.addEventListener('click', function(event) {
        if (menuAbierto && !notificationIcon.contains(event.target) && !document.getElementById('notification-menu').contains(event.target)) {
            // Si el menú está abierto y se hace clic fuera de él, marcar como vistas y recargar notificaciones
            menuAbierto = false;
            setVistoAndReload();
        }
    });
}
