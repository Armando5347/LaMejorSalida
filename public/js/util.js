let opciones = 0;

function agregar_opcion() {
    opciones ++;
    let contenedor = document.getElementById("contenedor_opciones");
    let opcion = document.createElement("div");
    opcion.setAttribute("id","opcion"+opciones);
    let nombre = document.createElement("input");
    nombre.setAttribute("placeholder","Nombre opción");
    nombre.setAttribute("type","text");
    nombre.setAttribute("id","nombre_opcion_"+opciones);
    nombre.setAttribute("name","nombre_opcion_"+opciones);
    nombre.setAttribute("class","input nombre_opcion");
    opcion.appendChild(nombre);

    //elementos de precio
    let label_precio = document.createElement("label");
    label_precio.setAttribute("class","label");
    label_precio.setAttribute("for","precio_opcion_"+opciones);
    label_precio.appendChild(document.createTextNode("Precio"));
    opcion.appendChild(label_precio);
    let precio = document.createElement("input");
    precio.setAttribute("placeholder","Precio");
    precio.setAttribute("type","number");
    precio.setAttribute("id","precio_opcion_"+opciones);
    precio.setAttribute("name","precio_opcion_"+opciones);
    precio.setAttribute("class","input precio_opcion");
    opcion.appendChild(precio);

    //elementos de preferencia
    let label_preferencia = document.createElement("label");
    label_preferencia.setAttribute("class","label");
    label_preferencia.setAttribute("for","preferencia_opcion_"+opciones);
    label_preferencia.appendChild(document.createTextNode("Preferencia"));
    opcion.appendChild(label_preferencia);
    let preferencia = document.createElement("input");
    preferencia.setAttribute("placeholder","Preferencia");
    preferencia.setAttribute("type","number");
    preferencia.setAttribute("id","preferencia_opcion_"+opciones);
    preferencia.setAttribute("name","preferencia_opcion_"+opciones);
    preferencia.setAttribute("class","input preferencia_opcion");
    opcion.appendChild(preferencia);

    contenedor.appendChild(opcion);
}

function eliminar_opcion(){
    let eliminado = document.getElementById("opcion"+opciones);
    eliminado.remove();
    opciones -- ;
}

//variables a usar (estaticas de momento, en la implementación se obtienen en base a lo ingresado por el usuario)
let presupuesto ; //presupuesto a considerar
let nombres = []; //el nombre de nuestras opciones
let preferencias = []; //la preferencia asignada por el usuario de cada opción
//tomando preferencia como la prioridad que le da el usuario de comprar una comida con respecto a otra
let costos = []; //el costo monetario conocido de cada opcion a considerar
let numero_elementos; //total de lementos a considerar
let dp ; //donde se lamacenan los problemas superpuestos

let contador_opciones_resultantes = [] ; //va a contener el resultado de nuestras opciones

function calcular(){
    //vaciar los valores almacenados
    let resultado = document.getElementById("opciones_resultantes");
    resultado.innerHTML = "";
    contador_opciones_resultantes = [];
    dp = null;
    nombres = [];
    preferencias = [];
    costos = [];
    presupuesto = 0;
    //llenar los valores ingresados
    presupuesto = document.getElementById("presupuesto").value;
    let lista_nombre = document.getElementsByClassName("nombre_opcion");
    let lista_preferencias = document.getElementsByClassName("preferencia_opcion");
    let lista_costos = document.getElementsByClassName("precio_opcion");
    let indice = 0
    for (indice = 0; indice < lista_nombre.length; indice++) {
        nombres.push(lista_nombre[indice].value);
        preferencias.push(lista_preferencias[indice].value);
        costos.push(lista_costos[indice].value);
    }

    //ultimos parámetros calculados
    numero_elementos = costos.length;
    contador_opciones_resultantes = Array(numero_elementos).fill(0);
    dp = Array(numero_elementos)  //matriz que almacena las subestucturas optimas
        .fill() 
        .map(() => Array(presupuesto + 1).fill(-1));
    //calculos
    unboundedKnapsack(presupuesto, costos, preferencias, numero_elementos - 1, dp); //se obtiene el optimo
    buscar_elementos(presupuesto, costos, preferencias, numero_elementos - 1, dp, nombres); //se hace el recorrido inverso

    //imprimir resultados
    for (indice = 0; indice < numero_elementos; indice++) {
        console.log(indice + " " + nombres[indice]+ " " + contador_opciones_resultantes[indice]);
        if(contador_opciones_resultantes[indice] > 0){ //si es mayor a cero, entonses es por que se requiere
            let ingreso = document.createElement("li");
            ingreso.appendChild(document.createTextNode("Se piden " + contador_opciones_resultantes[indice] + " de "+ nombres[indice]));
            resultado.appendChild(ingreso);
        }
    }
}
	
// Busca obtener el maximo valor de "preferencia", cubirendo el presupuesto dado; aunque este a el usuario final no le interesa tanto
function unboundedKnapsack(presupuesto, costos, preferencias, indice_elemento, dp) { 
    // Si nos encontramos en el ultimo elemento a considerar, cuando ya no ahy otros por evaluar
    if (indice_elemento == 0) {
      return Math.floor(presupuesto / costos[0]) * preferencias[0]; 
    } 
    // Si el valor ya ha sido calculado, se retorna en vez de volver a calcular
    if (dp[indice_elemento][presupuesto] != -1) return dp[indice_elemento][presupuesto]; 
    
    // Si ninguna de las dos opciones anteriores sucede
    // Entonces se tiene que considerar si se pide un elemento o no se íde, y se continua con el que sigue
    // Si no se toma, entonces solo se reduce el indice dle elemento
    let no_tomado = 0 + unboundedKnapsack(presupuesto, costos, preferencias, indice_elemento - 1, dp); 

    // Si se toma, se considera la preferencia del elemento y se le suma la solución con el presupuesto reducido
    let tomado = Number.MIN_VALUE; 
    if (costos[indice_elemento] <= presupuesto) { 
      tomado = preferencias[indice_elemento] + unboundedKnapsack(presupuesto - costos[indice_elemento], costos, preferencias, indice_elemento, dp); 
    }

    dp[indice_elemento][presupuesto] = Math.max(tomado, no_tomado); //comparación para ver cual es mayor
    return (dp[indice_elemento][presupuesto]); 
  } 
   
//funcion recursiva que nos ayuda a conocer los elementos optimos seleccionados usados para llegar a nuestra respuesta
function buscar_elementos(presupuesto, costos, preferencias, indice_elemento, dp, nombres){
    if(indice_elemento == 0){
        for (let indice = 0; indice < Math.floor(presupuesto / costos[0]) * preferencias[0] ; indice++) {
            contador_opciones_resultantes[indice_elemento] ++;
        }
        return;
    }
    let tomado, no_tomado;
    tomado = dp[indice_elemento][presupuesto - costos[indice_elemento] ] + preferencias[indice_elemento];
    no_tomado = dp[indice_elemento - 1][presupuesto];
    if(tomado > no_tomado){
        contador_opciones_resultantes[indice_elemento] ++; //se añade
        buscar_elementos(presupuesto - costos[indice_elemento], costos,preferencias, indice_elemento, dp, nombres);
    }else{
        buscar_elementos(presupuesto , costos,preferencias, indice_elemento - 1, dp, nombres);
    }
    return ;
}

//document.write(unboundedKnapsack(presupuesto, n, preferencias, costos)); 
