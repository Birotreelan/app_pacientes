function createCookie(name,value,days) {
    var expires = "";
    if (days) {
       var date = new Date();
       date.setTime(date.getTime()+(days*24*60*60*1000));
       expires = "; expires="+date.toGMTString();
    }
    document.cookie = name+"="+value+expires+"; path=/";
}

export function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
}
export function checkLogIn() {
    let logIn = readCookie("TreeLogged");
    if (logIn != 1) {
        window.location.replace("login.html?token=YTk0NTQyYmItODljMS0xMWUzLWE3NTEtMDgwMDI3M2NlNGZhJjE=");
    }else{
        return true;
    }
}
export function checkLoggedIn() {
    let logIn = readCookie("TreeLogged");
    if (logIn == 1) {
        window.location.replace("./");
    }
}
function eraseCookie(name) {
    createCookie(name,"",-1);
}
export function logInCookies(pacienteDNI, clinicaId, clinicaImg, token) {
    createCookie("TreeLogged", 1, 1);
    createCookie("PacienteDNI", pacienteDNI, 1);
    createCookie("ClinicaId", clinicaId, 1);
    createCookie("ClinicaImg", clinicaImg, 1);
    createCookie("token", token, 1);
}
export function logOffCookies(token) {
    eraseCookie("TreeLogged");
    eraseCookie("PacienteDNI");
    eraseCookie("ClinicaId");
    eraseCookie("ClinicaImg");
    let tToken = "";
    if(token != null) {
        tToken = "?token="+token;
    }
    window.location.replace("login.html"+tToken);
}
export const cookies = {
    pacienteDNI: readCookie("PacienteDNI"), 
    clinicaId: readCookie("ClinicaId"),
    clinicaImg: readCookie("ClinicaImg"),
    token: readCookie("token")
};
/*export const pacienteDNI = readCookie("PacienteDNI");
export const clinicaId = readCookie("ClinicaId");*/