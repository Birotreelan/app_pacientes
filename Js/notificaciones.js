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

    function loadNotifications(url) {
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

                const notifications = data.Notificaciones;
                notificationCount.textContent = notifications.length;
                notificationMenu.innerHTML = '';

                if (notifications.length === 0) {
                    notificationMenu.innerHTML = '<li><p class="dropdown-item text-center text-muted">No hay nuevas notificaciones</p></li>';
                } else {
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

                // Agregar siempre el enlace "Ver todas las notificaciones"
                const viewAll = document.createElement('li');
                viewAll.innerHTML = '<hr class="dropdown-divider"><a class="dropdown-item text-center" href="#" id="view-all-notifications">Ver todas las notificaciones</a>';
                notificationMenu.appendChild(viewAll);

                // Agregar evento al enlace "Ver todas las notificaciones"
                document.getElementById('view-all-notifications').addEventListener('click', function(event) {
                    event.preventDefault();
                    loadAllNotifications();
                });
            })
            .catch(error => {
                console.error('Error al hacer el fetch:', error);
            });
    }

    function loadAllNotifications() {
        let allNotificationsUrl = 'functions_tree.php?Action=getNotificacionesVistas&Cliente_Id=' + Cliente_Id + '&DNI=' + Paciente_DNI;
        loadNotifications(allNotificationsUrl);
    }

    function setVisto() {
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
    notificationIcon.addEventListener('click', function() {
        setVisto(); // Marcar notificaciones como vistas
    });
}
