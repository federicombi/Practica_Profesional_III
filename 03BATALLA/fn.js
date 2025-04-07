const 
tiempo_de_juego_en_ms = 40000,
tipos_de_buques = ["nodriza", "submarino", "barco", "lancha", "bote"];

const 
BOTON_JUGAR = document.getElementById("boton_jugar"),
CAMPO_DE_BATALLA = document.getElementById("campo_de_batalla"),
OVERLAY = document.getElementById("overlay");

let 
clicBloqueado = false,
buquesHundidos = 0,
temporizador = null;


class Celda{
    constructor(id){
        this.ocupado = 0;
        this.golpeado = 0;
        this.id = id;
    }
}

class Tablero{

    constructor(){
        this.dimension = 10;
        this.buques = [];
        this.areas = [];
        this.celdas_ocupadas = [];
    }

    async crear(){
        let 
        largo = this.dimension,
        tabla = document.createElement("table");
        tabla.id="tablero";
        tabla.classList.add("field");
        CAMPO_DE_BATALLA.appendChild(tabla);

        for(let f=1;f<=largo;f++){
            let 
            fila = document.createElement("tr"),
            id_fila = "f"+f;
            fila.id = id_fila;
            document.getElementById("tablero").appendChild(fila);
            for(let c=1;c<=largo;c++){
                let celda = document.createElement("td"),
                id_celda = id_fila+"c"+c;
                celda.id = id_celda;
                celda.disabled = false;
                celda.onclick = ()=>{
                    this.eventoCelda(f, c, id_celda);
                }
                document.getElementById("f"+f).appendChild(celda);
            }

        }
        return 1;
    }

    asignarBuque(Buque){
        if(this.buques.length == 5){
            return false
        }else{
            let area_del_buque = this.asignarArea(Buque);
            let estaOcupado = this.verSiHayAlgoEn(area_del_buque);
    
            while(estaOcupado){
                area_del_buque = this.asignarArea(Buque);
                estaOcupado = this.verSiHayAlgoEn(area_del_buque);
                console.log("Ocupado: se asigna una nueva area.")
            }
            area_del_buque.forEach(celda=>{this.celdas_ocupadas.push(celda)})
            this.buques.push(Buque);
            this.areas.push(area_del_buque);
            return true;
        }
    }

    asignarArea(Buque){
        let 
        largo = Buque.salud,
        inicio_columna = Math.floor((Math.random() * 10 +1)),
        inicio_fila = Math.floor((Math.random() * 10 +1)),
        darOrientacion = Math.floor((Math.random() * 2)),
        orientacion;

        if(darOrientacion == 0){
            orientacion = "H";
            if(inicio_columna > largo){
                inicio_columna = largo;
            }; 
        }else{
            orientacion = "V";
            if(inicio_fila > largo){
                inicio_fila = largo;
            }; 
        }
        let celdas_de_un_buque = obtener_celdas_que_ocupa(orientacion, largo, inicio_fila, inicio_columna);
        return celdas_de_un_buque;
    }

    verSiHayAlgoEn(celdas_de_un_buque) {
        for (let celda = 0; celda < celdas_de_un_buque.length; celda++) {
            /*
                for (let c = 0; c < this.celdas_ocupadas.length; c++) {
                    if (celdas_de_un_buque[celda][0] == this.celdas_ocupadas[c][0] && celdas_de_un_buque[celda][1] == this.celdas_ocupadas[c][1]) {
                        return celda;  
                    }
                }
            */
            if(this.checkCelda(celdas_de_un_buque[celda])){
                return celdas_de_un_buque[celda];
            };
        }
        return false;
    }

    checkCelda(celda){
        for (let c = 0; c < this.celdas_ocupadas.length; c++) {
            if (celda[0] == this.celdas_ocupadas[c][0] && celda[1] == this.celdas_ocupadas[c][1]) {
                return this.celdas_ocupadas[c];  
            }
        }
        return false;
    }

    celdaPerteneceA(celda){
        for(let a=0;a<this.areas.length;a++){
            for(let c=0; c<this.areas[a].length; c++){
                if (this.areas[a][c][0] == celda[0] && this.areas[a][c][1] == celda[1]){
                    return a;
                }
            }
        }
        return false;
    }
    hundir_buque(){

    }
    async eventoCelda(f, c, id_celda){
        if (clicBloqueado) {return};
        clicBloqueado = true;
        setTimeout(() => {
            clicBloqueado = false;
        }, 500);
        let ocupado = this.checkCelda([f,c]);
        if(ocupado){ /// Si la celda está ocupada
            let canionazo = new Audio("/sounds/canionazo.mp3");
            canionazo.play();
            const img_explosion = document.createElement("img");
            img_explosion.src="/images/explosion.gif";
            img_explosion.alt = "BOOM!";
            img_explosion.width = 48;
            img_explosion.height = 48;
            document.getElementById(id_celda).appendChild(img_explosion);
            setTimeout(() => {img_explosion.remove();}, 550);
            document.getElementById(id_celda).style.backgroundImage = "url('/images/boom.png')";
            let indice_area = this.celdaPerteneceA(ocupado),
            ship = this.buques[indice_area];
            ship.golpe();
            
            if(ship.salud == 0){
                await esperar(500);
                ship.hundir();          
                buquesHundidos++;
                if(buquesHundidos == 5){
                    if(temporizador){
                        Swal.close();
                        temporizador = null;
                    }
                }
            }else{
                document.getElementById(ship.tipo+"_salud").src = "/images/"+ship.salud+".png";
            };
        }else{ ////Si la celda NO está ocupada
            const img_nada = document.createElement("img");
            img_nada.src="/images/aguita.png";
            img_nada.alt = "nada...";
            img_nada.classList.add("check");
            img_nada.width = 48;
            img_nada.height = 48;
            document.getElementById(id_celda).appendChild(img_nada);
            setTimeout(() => {img_nada.remove();}, 500);
            document.getElementById(id_celda).style.backgroundImage = "url('/images/no_boom.png')";
        } 
        document.getElementById(id_celda).style.pointerEvents = "none";
        document.getElementById(id_celda).disabled = true;   
    }
    
}

class Buque{
    constructor(salud){
        this.salud = salud;
        switch(salud){
            case 5:
                this.tipo = "nodriza"
                break;
            case 4:
                this.tipo = "submarino"
                break;
            case 3:
                this.tipo = "barco"
                break;
            case 2:
                this.tipo = "lancha"
                break;
            case 1:
                this.tipo = "bote"
                break;
        }
    }

    golpe(){
        this.salud--;
        return true;
    }

    hundir(){
        document.getElementById(this.tipo).style.backgroundImage = "url('/images/"+this.tipo+"_hundido.png')";
        document.getElementById(this.tipo+"_salud").src = "/images/muerte.png";
        let hundido = new Audio("/sounds/hundido.mp3");
        hundido.play();
    }
}

function obtener_celdas_que_ocupa(orientacion, largo, inicio_fila, inicio_columna){
    let celdas_de_un_buque = [];

    if(orientacion == "H"){
        for(let c=inicio_columna; c<(inicio_columna+largo); c++){
            celdas_de_un_buque.push([c, inicio_fila]);
        }
    }else if(orientacion == "V"){
        for(let f=inicio_fila; f<(inicio_fila+largo); f++){
            celdas_de_un_buque.push([inicio_columna, f]);
        }
    }
    return celdas_de_un_buque;
}

async function jugar(){
    CAMPO_DE_BATALLA.innerHTML = "";
    reiniciar_imagenes();
    buquesHundidos = 0;
    await lanzar_RSG();
    const campoDeBatalla = new Tablero();
    campoDeBatalla.crear();
    lanzar_tiempo(tiempo_de_juego_en_ms);
    for(let i=5;i>0;i--){
        let barco = new Buque(i);
        agregado = campoDeBatalla.asignarBuque(barco);
        if(!agregado){
            console.log("ya se agregaron 5 buques.");
        }
    }
    console.log(campoDeBatalla.buques);
    console.log(campoDeBatalla.areas);
    BOTON_JUGAR.disabled = true;
    
}

function reiniciar_imagenes(){
    let s = 5;
    tipos_de_buques.forEach(tipo=>{
        document.getElementById(tipo).style.backgroundImage = "url('/images/"+tipo+".png')";
        document.getElementById(tipo+"_salud").src = "/images/"+s+".png";
        s--;
    });
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function lanzar_RSG(){
    const result = await Swal.fire({
        title: "<h2 id='a321'> 3 </h2>",
        backdrop: false,
        showConfirmButton: false,
        timer: 3000,
        background: "#1f1e1e",
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass:{
            popup:'RSG'
        },
        didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                document.getElementById("a321").innerHTML = Math.round(Swal.getTimerLeft()/1000);
            }, 1000); 
            OVERLAY.style.display = 'block';
        },
        willClose: () => {
            OVERLAY.style.display = 'none';
          clearInterval(timerInterval);
        }
    })
    console.log(result);
    return true;
    
}

function lanzar_tiempo(tiempo){
    temporizador = Swal.mixin({
        toast: true,
        showConfirmButton: false,
        position: "top-end",
        background: "#1f1e1e",
        timer: tiempo,
        timerProgressBar: true,
        allowEscapeKey: false,
        customClass: {
            popup: 'tiempo'
        },
        willClose: ()=>{
            if(buquesHundidos == 5){
                lanzar_resultado("&#10024  GANASTES! &#10024", "gana", "Felicidades!")
            }else{
                lanzar_resultado("Perdistes!! &#128511;", "pierde", "Que Mal!!");
            }
        }
    });
    temporizador.fire({
        icon: "warning",
        title: "Destruye los enemigos!!"
    });
}

function lanzar_resultado(titulo, imagen, alt){
    Swal.fire({
        title: titulo,
        showConfirmButton: true,
        backdrop: false,
        allowOutsideClick: false,
        imageUrl:"/images/"+imagen+".gif",
        imageWidth:200,
        imageAlt: alt,
        allowEscapeKey: false,
        confirmButtonText: "Reiniciar",
        didOpen: ()=>{
            OVERLAY.style.display = 'block';
        },
        willClose: ()=>{
            OVERLAY.style.display = 'none';
        }
    }).then((result)=>{
        if(result.isConfirmed){
            jugar();
        }
    })
}