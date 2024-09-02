import { logInCookies, checkLoggedIn } from "./cFunctions.js";
checkLoggedIn();

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");

    // Mostrar u ocultar contraseña en login
    const showHidePassword = document.getElementById('showhide_password');
    const input_password = document.getElementById('password');
    
    showHidePassword.setAttribute('src', './img/hide.png');

    showHidePassword.addEventListener('click', () => {
        if (showHidePassword.getAttribute('src') === './img/hide.png') {
            showHidePassword.setAttribute('src', './img/show.png');
            input_password.setAttribute('type', 'text');
        } else {
            showHidePassword.setAttribute('src', './img/hide.png');
            input_password.setAttribute('type', 'password');
        }
    });

    // Validar Dni en Login
    let loginDni = document.getElementById('dni');
    loginDni.addEventListener("focus", () => {
        document.getElementById('password-incorrecta').style.display = "none";
    });

    loginDni.addEventListener("blur", () =>
    {
        verifyDni(loginDni.value);
    });

    // Validar Dni en Recuperacion de Contraseña
    let recoveryDni = document.getElementById('input_recover_password');
    recoveryDni.addEventListener("focus", () => {
        //document.getElementById('password-incorrecta').style.display = "none";
    });

    recoveryDni.addEventListener("blur", () =>
    {
        verifyDni(recoveryDni.value);
    });
    
    // Preguntas en login
    const recuperarPassword = document.getElementById('recover_password');
    const crearCuenta = document.getElementById('create_account');
    const cambiarPassword = document.getElementById('change_password');

    // Elementos login
    const recuperarPassword_element = document.getElementById('login_recover');
    const crearCuenta_element = document.getElementById('login_create');
    const cambiarPassword_element = document.getElementById('login_changePassword');
    const loginInicio_element = document.getElementById('login_inicio');
    const volverInicio_button = document.getElementsByClassName('volver-inicio-button');

    // Boton Ingresar
    const botonIngresar = document.getElementById('login_button');
    botonIngresar.addEventListener('click', logIn);

    // Event listeners login
    recuperarPassword.addEventListener('click', recoverPassword);
    crearCuenta.addEventListener('click', createAccount);
    cambiarPassword.addEventListener('click', changePassword);
    // Agregar un event listener a cada boton Volver
    for (var i = 0; i < volverInicio_button.length; i++) {
        volverInicio_button[i].addEventListener('click', volverInicio);
    };

    function logIn() {
        botonIngresar.innerHTML = '<div class="loader"></div>';

        event.preventDefault();
        let gData = new URLSearchParams(location.search);
        let token = gData.get("token");
        if(token == undefined) {
            // Demo
            // token = "YTk0NTQyYmItODljMS0xMWUzLWE3NTEtMDgwMDI3M2NlNGZhJjE=";

            // Prod
            token = 'ODM5Y2JmM2UtZjk2Ni0xMWVkLThiNDMtZmExNmMwYTg0YzA0JjE=';
        }
        let loginId;
        let clienteId;
        let DNI;
        if(token != null) {
            let sToken = atob(token);
            sToken = sToken.split('&');
            sToken.forEach(element => {
                if(isNaN(element)) {
                    clienteId = element;
                } else if(element == 1 || element == 2 || element == 3) {
                    loginId = element;
                } else{
                    DNI = element;
                }
            })
        
        } else {
            loginId = 0;
        }

        let usuario;
        let password;
        let action;
        
        switch(loginId) {
            case "0":
            case "1":
                usuario = (document.getElementById("dni").value).replace(/[.]/g,'');
                password = document.getElementById("password").value;
                action = "loginPassword";
            break;
            case "2":
                usuario = (document.getElementById("dni").value).replace(/[.]/g,'');
                password = "";
                action = "loginDNI";
            break;
            case "3":
                usuario = DNI;
                password = "";
                action = "loginDNI";
        }
        
        let Url = 'functions_tree.php?';
        // let dataUrl = btoa('Action='+action+'&Cliente_Id='+clienteId+'&Paciente_DNI='+usuario+'&Paciente_Password='+password+'&log='+loginId);
        // Url += 'token='+dataUrl;
        let dataUrl = 'Action='+action+'&Cliente_Id='+clienteId+'&Paciente_DNI='+usuario+'&Paciente_Password='+password+'&log='+loginId;
        Url += dataUrl;
        const ajax_request = new XMLHttpRequest();
        ajax_request.onreadystatechange = function() {
            var response = JSON.parse(ajax_request.responseText);
            console.log(response.Result);
            if(response.Result == 200) {
                logInCookies(usuario, clienteId, response.clienteImg, token);
                location.href ="./";
                botonIngresar.innerHTML = 'Ingresar';
            }

            else if (document.getElementById('dni').value === "" || document.getElementById('password').value === "" ) {
                document.getElementById('password-incorrecta').style.display = "";
                document.getElementById('password-incorrecta').innerText = "Ingrese Usuario y Contraseña";
                botonIngresar.innerHTML = 'Ingresar';
            } else {
                document.getElementById('password-incorrecta').innerText = "Usuario o Contraseña incorrectos";
                document.getElementById("password-incorrecta").style.display = '';
                botonIngresar.innerHTML = 'Ingresar';
            }
        }
        
        ajax_request.open("GET", Url);
        ajax_request.send();
    }

    // Funcion boton Volver en pestañas login.
    function volverInicio()
    {
        loginInicio_element.style.display = 'flex';
        recuperarPassword_element.style.display = 'none';
        crearCuenta_element.style.display = 'none';
        cambiarPassword_element.style.display = 'none';
    }

    function recoverPassword()
    {
        console.log("Recovering password");

        loginInicio_element.style.display = 'none';
        recuperarPassword_element.style.display = 'flex';
        
        let continuarButton = document.getElementById('recover_password_button');

        continuarButton.addEventListener('click', () => {
            continuarButton.innerHTML = '<div class="loader"></div>';
            let inputDNI = document.getElementById('input_recover_password').value;
            console.log('fetching');

            //Obtener Cliente_Id de URL
            let gData = new URLSearchParams(location.search);
            let token = gData.get("token");
            if(token != null) {
                let sToken = atob(token);
                sToken = sToken.split('&');
                let Cliente_Id = sToken[0];
                // let UrlRecuperarPassword = 'functions_tree.php?token='+btoa('Action=recoverPassword&Cliente_Id='+Cliente_Id+'&DNI='+inputDNI);
                let UrlRecuperarPassword = 'functions_tree.php?'+'Action=recoverPassword&Cliente_Id='+Cliente_Id+'&DNI='+inputDNI;
                fetch(UrlRecuperarPassword)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.Result == 200) {
                        document.getElementById('login_recover_p').innerHTML = "Solicitud procesada correctamente. Hemos enviado un email de recuperación con información de tu cuenta a "+data.Mail;
                        document.getElementById('input_recover_password').style.display = "none";
                        document.getElementById('recover_password_button').style.display = "none";
                    }
                });
            }
        });
    }

    function createAccount() {
        console.log("Creating account");

        loginInicio_element.style.display = 'none';
        crearCuenta_element.style.display = 'flex';

        const registroNombre = document.querySelector('#login_create input[placeholder="Nombre..."]');
        const registroApellido = document.querySelector('#login_create input[placeholder="Apellido..."]');
        const registroDni = document.querySelector('#login_create input[placeholder="DNI..."]');
        const fechaNacimiento = document.querySelector('#login_create input[type="date"]');
        const inputEmail = document.querySelector('#login_create input[placeholder="Mail..."]');
        const registroPassword = document.querySelector('#input_password_createAccount');
        const verifyPassword = document.querySelector('#verify_password_createAccount');
        const botonRegistrarme = document.getElementById('registrarme');

        botonRegistrarme.addEventListener('click', () => {
            if (registroPassword.value !== verifyPassword.value) {
                alert("Las contraseñas no coinciden");
                return;
            }

            botonRegistrarme.innerHTML = '<div class="loader"></div>';

            let gData = new URLSearchParams(location.search);
            let token = gData.get("token");
            let Cliente_Id = "";
            if (token != null) {
                let sToken = atob(token);
                sToken = sToken.split('&');
                Cliente_Id = sToken[0];
            }

            // let url = 'functions_tree.php?token=' + btoa('Action=createUserClinica&Cliente_Id=' + Cliente_Id +
            //     '&Nombre=' + registroNombre.value + '&Apellido=' + registroApellido.value +
            //     '&DNI=' + registroDni.value.replace(/[.]/g,'') + '&Fecha_Nacimiento=' + fechaNacimiento.value +
            //     '&Mail=' + inputEmail.value + '&Password=' + registroPassword.value);

            let url = 'functions_tree.php?' + 'Action=createUserClinica&Cliente_Id=' + Cliente_Id +
                '&Nombre=' + registroNombre.value + '&Apellido=' + registroApellido.value +
                '&DNI=' + registroDni.value.replace(/[.]/g,'') + '&Fecha_Nacimiento=' + fechaNacimiento.value +
                '&Mail=' + inputEmail.value + '&Password=' + registroPassword.value;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.Result == 200) {
                        alert("Cuenta creada con éxito");
                        volverInicio();
                    } else {
                        alert("Error al crear la cuenta. Intente nuevamente.");
                    }
                    botonRegistrarme.innerHTML = 'Registrarme';
                });
        });
    }

    function changePassword() {
        loginInicio_element.style.display = 'none';
        cambiarPassword_element.style.display = 'flex';

        const input_dni_changePassword = document.getElementById('input_dni_changePassword');
        const input_oldpassword_changePassword = document.getElementById('input_oldpassword_changePassword');
        const new_password_changePassword = document.getElementById('new_password_changePassword');
        const verify_password_changePassword = document.getElementById('verify_password_changePassword');
        const change_password_button = document.getElementById('change_password_button');
        const showhide_inputPassword_changePassword = document.getElementById('showhide_inputPassword_changePassword');
        const showhide_newPassword_changePassword = document.getElementById('showhide_newPassword_changePassword');
        const showhide_verifyPassword_changePassword = document.getElementById('showhide_verifyPassword_changePassword');

        showhide_inputPassword_changePassword.setAttribute('src', './img/hide.png');
        showhide_newPassword_changePassword.setAttribute('src', './img/hide.png');
        showhide_verifyPassword_changePassword.setAttribute('src', './img/hide.png');

        showhide_inputPassword_changePassword.addEventListener('click', togglePasswordVisibility);
        showhide_newPassword_changePassword.addEventListener('click', togglePasswordVisibility);
        showhide_verifyPassword_changePassword.addEventListener('click', togglePasswordVisibility);

        function togglePasswordVisibility() {
            if (input_oldpassword_changePassword.getAttribute('type') === 'password') {
                input_oldpassword_changePassword.setAttribute('type', 'text');
                new_password_changePassword.setAttribute('type', 'text');
                verify_password_changePassword.setAttribute('type', 'text');
                showhide_inputPassword_changePassword.setAttribute('src', './img/show.png');
                showhide_newPassword_changePassword.setAttribute('src', './img/show.png');
                showhide_verifyPassword_changePassword.setAttribute('src', './img/show.png');
            } else {
                input_oldpassword_changePassword.setAttribute('type', 'password');
                new_password_changePassword.setAttribute('type', 'password');
                verify_password_changePassword.setAttribute('type', 'password');
                showhide_inputPassword_changePassword.setAttribute('src', './img/hide.png');
                showhide_newPassword_changePassword.setAttribute('src', './img/hide.png');
                showhide_verifyPassword_changePassword.setAttribute('src', './img/hide.png');
            }
        }

        change_password_button.addEventListener('click', () => {
            change_password_button.innerHTML = '<div class="loader"></div>';
            let new_password = new_password_changePassword.value;
            let verify_password = verify_password_changePassword.value;
        
            if (new_password != verify_password) {
                console.log('no coinciden los valores');
                change_password_button.innerHTML = 'Change Password'; // Restablecer el botón en caso de error
            } else {
                // Obtener Cliente_Id de URL
                let gData = new URLSearchParams(location.search);
                let token = gData.get("token");
                if (token != null) {
                    let sToken = atob(token);
                    sToken = sToken.split('&');
                    let Cliente_Id = sToken[0];
        
                    // Crear la URL codificada correctamente
                    let params = {
                        Action: 'Mdf_Password',
                        Cliente_Id: Cliente_Id,
                        Paciente_DNI: input_dni_changePassword.value,
                        Old_Password: input_oldpassword_changePassword.value,
                        New_Password: new_password_changePassword.value
                    };
                    // let encodedParams = btoa(Object.entries(params).map(e => e.join('=')).join('&'));
                    let encodedParams = Object.entries(params).map(e => e.join('=')).join('&');
                    let UrlCambiarPassword = 'functions_tree.php?' + encodedParams;
        
                    // Enviar Petición
                    fetch(UrlCambiarPassword)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                            if (data.Result == 200) {
                                console.log('contraseña cambiada');
                                document.getElementById('login_changePassword_p').innerHTML = "Solicitud procesada correctamente.<br>Ya puede ingresar al sistema con su nueva contraseña.";
                                document.getElementById('login_container_inputs_changePassword').style.display = "none";
                                document.getElementById('change_password_button').style.display = "none";
                            } else if (data.Result == 404) {
                                console.log('no se encontró ninguna cuenta con ese dni');
                                document.getElementById('login_changePassword_p').innerHTML = "No se encontró ningún usuario que coincida con el DNI ingresado. Intente nuevamente con un DNI válido.";
                                document.getElementById('login_container_inputs_changePassword').style.display = "none";
                                document.getElementById('change_password_button').style.display = "none";
                            } else {
                                console.log('Ha ocurrido un error. Intente de nuevo más tarde');
                                document.getElementById('login_changePassword_p').innerHTML = "Ha ocurrido un error. Intente nuevamente más tarde.";
                                document.getElementById('login_container_inputs_changePassword').style.display = "none";
                                document.getElementById('change_password_button').style.display = "none";
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            document.getElementById('login_changePassword_p').innerHTML = "Ha ocurrido un error. Intente nuevamente más tarde.";
                            document.getElementById('login_container_inputs_changePassword').style.display = "none";
                            document.getElementById('change_password_button').style.display = "none";
                        })
                        .finally(() => {
                            change_password_button.innerHTML = 'Change Password'; // Restablecer el botón después de la solicitud
                        });
                }
            }
        });        
    }

    // Verifica que el numero de DNI este dentro de los parametros. Agrega puntos y cambia el color segun estado.
    function verifyDni(value) {
        let valorDni = value.replace(/[.]/g,'');
        let primerCaracter = valorDni.charAt(0);

        if ((primerCaracter.toUpperCase() === 'M' || primerCaracter.toUpperCase() === 'F' || primerCaracter.toUpperCase() === 'X') && !isNaN(valorDni.substr(1,7)) && (valorDni.substr(1,7)).length === 7) {
            let valorNumerico= valorDni.substr(1,7);
            let agregarPuntos = new Intl.NumberFormat('es-AR').format(valorNumerico);
            loginDni.value = primerCaracter.toUpperCase() + agregarPuntos;
            loginDni.style.color = '#033058';
        } else if (!isNaN(valorDni) && valorDni.length === 8) {
            let agregarPuntos = new Intl.NumberFormat('es-AR').format(valorDni);
            loginDni.value = agregarPuntos;
            loginDni.style.color = '#033058';
        } else {
            loginDni.style.color = 'red';
        }
    }
});
