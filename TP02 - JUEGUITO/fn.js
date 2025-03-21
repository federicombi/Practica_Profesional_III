let 
cuenta = [],
resultado = 0,
contador = 0;

let intervalo;

const 
MOSTRADOR = document.getElementById("mostrador"),
BOTON_INICIAR = document.getElementById("boton_iniciar"),
BOTON_RESPONDER = document.getElementById("responder");



async function iniciar(){
    BOTON_INICIAR.disabled = true;
    cuenta = [];
    resultado = 0;

    for (i=0;i<10;i++){
        let numero = await obtener_numero();
        cuenta.push(numero);
        resultado += numero;
    }
    console.log("result: "+resultado);
    Swal.fire({
        html: "<h1>GET READY!!</h1>",
        timer: 2000,
        allowOutsideClick:false,
        backdrop: false,
        background: "rgb(255, 152, 152)",
        didOpen: () => {
            Swal.showLoading();
        }
    })

    intervalo = setInterval(()=> mostrar(cuenta), 2500); ////////////// CAMBIAR EL TIEMPO A 3K
}
/*
async function obtener_numero(){
    let numero = - Math.floor((Math.random() * 20) +1) + (Math.floor(Math.random() * 20));
    while (numero == 0){
        numero = - Math.floor((Math.random() * 20) +1) + (Math.floor(Math.random() * 20));
    }
    return numero;
}
*/

async function obtener_numero(){
    let numero = Math.floor((Math.random() * 20) +1);
    let variable = Math.floor((Math.random() * 2));
    if (variable == 0){
        numero-= numero*2
    }
    return numero;
}


async function mostrar(cuenta){
    let num_para_mostrar = cuenta[contador];
    if(contador == 10){
        clearInterval(intervalo);
        contador = 0;
        MOSTRADOR.innerHTML="";
        lanzarRespuesta();
        return;
    } else{
        let color = await cambiar_color();
        if(cuenta[contador]>0){
            num_para_mostrar = "+"+cuenta[contador];
        }
        MOSTRADOR.innerHTML = num_para_mostrar;
        MOSTRADOR.style.color = color;
        contador++;
    }
}

async function lanzarRespuesta(){
    let respuesta = 0;
    Swal.fire({
        title: "ESCRIBE TU RESPUESTA!",
        timer: 8000,
        allowOutsideClick:false,
        backdrop: false,
        html: '<input id="respuesta" type="number" class="swal2-input">',
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
            respuesta = document.getElementById("respuesta").value
            if(respuesta == resultado){
                lanzarGanaste();
            }else{
                lanzarPerdiste();
            }
        }
    });
}

function reiniciar(){
    cuenta = [],
    resultado = 0,
    contador = 0;
    BOTON_INICIAR.disabled = false;
}

function lanzarGanaste(){
    Swal.fire({
        title: "GANASTE!!",
        allowOutsideClick:false,
        backdrop: false,
        timerProgressBar: true,
        imageUrl: "https://media.tenor.com/DzPdxVbidaEAAAAM/you-get-a-you-get-a-win.gif",
        confirmButtonText: "Reiniciar",
        willClose: ()=>{
            reiniciar();
        }
    });
}

function lanzarPerdiste(){
    Swal.fire({
        title: "PERDISTESSSS!",
        allowOutsideClick:false,
        backdrop: false,
        timerProgressBar: true,
        imageUrl: "https://i.pinimg.com/originals/de/e9/7b/dee97bc62b1cebea8551a69b92b3bf4d.gif",
        confirmButtonText: "Reiniciar",
        willClose: ()=>{
            reiniciar();
        }
    });
}


async function cambiar_color(){
    let
    color = "",
    blue = calcularRGB(),
    red = calcularRGB(),
    green = calcularRGB();
    if(green == blue){
        green = calcularRGB();
    };
    if (red == blue){
        blue = calcularRGB();
    };
    if(red == green){
        red = calcularRGB();
    }
    color = "rgb("+red+" ,"+green+" ,"+blue+")";
    return color;
}

function calcularRGB(){
    let numero = Math.floor((Math.random() * 130) +25);
    return numero;
}