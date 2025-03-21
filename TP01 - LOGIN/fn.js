const 
EL_MENSAJE_FINAL = document.getElementById("mensaje_final"),
EL_MENSAJE_ERROR = document.getElementById("mensaje_error"),
EL_CUERPO_LOGIN = document.getElementById("cuerpo_login");
async function loguear(){
    console.log("LOGUEADO");
}

const 
PROCESAR_LOGIN = "/procesar_login.php";

async function loguearse(){
    const formulario = {
        email:  document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    console.log(formulario);
    

    fetch(PROCESAR_LOGIN,{
        method:"POST",
        body: JSON.stringify(formulario)
        }).then (response=>response.json()).then(data=>{
            
            if(data){
                EL_CUERPO_LOGIN.style.display = "none";
                EL_MENSAJE_ERROR.innerHTML ="";
                EL_MENSAJE_FINAL.innerHTML ="LOGUEADO CORRECTAMENTE :) <br>"
                const img = document.createElement("img");
                img.src = "https://cliply.co/wp-content/uploads/2021/03/372103860_CHECK_MARK_400px.gif";
                img.alt = "Logueo correcto";
                img.style.width = "200px";
                EL_MENSAJE_FINAL.appendChild(img);
                EL_MENSAJE_FINAL.appendChild(document.createElement("br"));
                const boton_salir = document.createElement("button");
                boton_salir.onclick = salir;
                boton_salir.innerHTML = "SALIR";
                EL_MENSAJE_FINAL.appendChild(boton_salir);
            }  else{
                document.getElementById("mensaje_error").innerHTML ="ERROR EN EL MAIL O LA CLAVE";
                EL_MENSAJE_FINAL.innerHTML = "";
            }

        })


}

function salir(){
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    EL_CUERPO_LOGIN.style.display = "block";
    EL_MENSAJE_FINAL.innerHTML = "";
}