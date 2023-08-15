launch_notification = () =>{
    let notification = document.getElementById("toast")
    notification.className = "show";
    setTimeout(() => { notification.className = notification.className.replace("show", ""); }, 4000);
}