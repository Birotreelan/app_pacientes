function ajaxUrl(obj){
    let Url = "functions_tree.php?token=";
    let UrlData = "";
    for (const key in obj) {
        if (key != "Action") {
            UrlData += "&";
        }
        UrlData += key + "=" + obj[key];
    }
    let encUrlData = btoa(UrlData);
    return Url + encUrlData;
}
export function ajaxCall(obj, func){
    let Url = ajaxUrl(obj);

    const ajax_request = new XMLHttpRequest();
      ajax_request.onreadystatechange = function() {
      var response = JSON.parse(ajax_request.responseText);
        func(response);
    }
  
    ajax_request.open("GET", Url);
    ajax_request.send();
}