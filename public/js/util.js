let opciones = 0;

function agregar_opcion() {
    opciones ++;
    let contenedor = document.getElementById("contenedor_opciones");
    let contenedor_auxiliar = document.createElement("li");
    contenedor_auxiliar.setAttribute("id","opcion_"+opciones);
    contenedor_auxiliar.setAttribute("class","row border border-secondary p-2 m-1");
    crear_label_input(contenedor_auxiliar,"Nombre", "text", opciones);
    crear_label_input(contenedor_auxiliar,"Precio","number", opciones);
    crear_label_input(contenedor_auxiliar,"Preferencia","number", opciones);
    contenedor.appendChild(contenedor_auxiliar);
}

//funcion que crea el campo de entrada de un dato y su respectivo label
//necesita el nombre del campo, el tipo de dato que es, el contendor en el cual se guardará
//y el numero de opción correspondiente
function crear_label_input(contenedor_opciones, nombre_descriptivo, tipo_ingreso, numero_opcion) {

    let label_elemento  = document.createElement("label");
    label_elemento.setAttribute("for",nombre_descriptivo+"_opcion_"+numero_opcion);
    label_elemento.innerHTML = nombre_descriptivo;
    label_elemento.setAttribute("id","label_"+nombre_descriptivo+"_opcion_"+numero_opcion);
    label_elemento.setAttribute("class","col-form-label ");
    empaquetar_columna_automatica(label_elemento, contenedor_opciones);

    let elemento = document.createElement("input");
    elemento.setAttribute("placeholder",nombre_descriptivo+" de la opción "+numero_opcion);
    elemento.setAttribute("type",tipo_ingreso);
    elemento.setAttribute("id",nombre_descriptivo+"_opcion_"+numero_opcion);
    elemento.setAttribute("name",nombre_descriptivo+"_opcion_"+numero_opcion);
    elemento.setAttribute("class","form-control "+nombre_descriptivo+"_opcion");
    if(tipo_ingreso == "number"){
        elemento.setAttribute("oninput","validar_entero(this)");
        elemento.setAttribute("ondrag","validar_entero(this)");
    }
    empaquetar_columna_automatica(elemento, contenedor_opciones);
    
}

//funcion que encierra a un elemento html en un div con class= col-auto, y lo coloca al final del elemento_padre
function empaquetar_columna_automatica(elemento_a_empaquetar, elemento_padre) {
    let columna = document.createElement("div");
    columna.setAttribute("class","col-auto");
    columna.appendChild(elemento_a_empaquetar);
    elemento_padre.appendChild(columna);
}

function eliminar_opcion(){
    let eliminado = document.getElementById("opcion_"+opciones);
    eliminado.remove();
    opciones -- ;
}

function calcular(){
    //variables a usar (estaticas de momento, en la implementación se obtienen en base a lo ingresado por el usuario)
    let presupuesto = 0; //presupuesto a considerar
    let nombres = []; //el nombre de nuestras opciones
    let preferencias = []; //la preferencia asignada por el usuario de cada opción
    //tomando preferencia como la prioridad que le da el usuario de comprar una comida con respecto a otra
    let costos = []; //el costo monetario conocido de cada opcion a considerar
    let numero_elementos; //total de lementos a considerar
    let dp ; //donde se lamacenan los problemas superpuestos

    let contador_opciones_resultantes = [] ; //va a contener el resultado de nuestras opciones

    //llenar los valores ingresados
    presupuesto = parseInt(document.getElementById("presupuesto").value);
    let lista_nombre = document.getElementsByClassName("Nombre_opcion");
    let lista_preferencias = document.getElementsByClassName("Preferencia_opcion");
    let lista_costos = document.getElementsByClassName("Precio_opcion");
    let indice = 0;
    for (indice = 0; indice < lista_nombre.length; indice++) {
        nombres.push(lista_nombre[indice].value);
        preferencias.push(parseInt(lista_preferencias[indice].value));
        costos.push(parseInt(lista_costos[indice].value));
    }

    //ultimos parámetros calculados
    numero_elementos = costos.length;
    contador_opciones_resultantes = Array(numero_elementos).fill(0);
    dp = Array(numero_elementos)  //matriz que almacena las subestucturas optimas
        .fill() 
        .map(() => Array(presupuesto + 1).fill(-1));
    
    //calculos
    let presupuesto_gastado = 
    unboundedKnapsack(presupuesto, costos, preferencias, numero_elementos - 1, dp); //se obtiene el optimo
     //se hace el recorrido inverso
    buscar_elementos(presupuesto, costos, preferencias, numero_elementos - 1, dp, nombres, contador_opciones_resultantes);
    
    //imprimir resultados
    //pero primero, se vacia lo que antes se tenía
    limpiar_salida();
    let resultado = document.getElementById("opciones_resultantes");

    for (indice = 0; indice < numero_elementos; indice++) {
        console.log(indice + " " + nombres[indice]+ " " + contador_opciones_resultantes[indice]);
        if(contador_opciones_resultantes[indice] > 0){ //si es mayor a cero, entonses es por que se requiere
            let ingreso = document.createElement("li");
            ingreso.setAttribute("class","list-group-item list-group-item-info align-items-center justify-content-between d-flex");
            ingreso.appendChild(document.createTextNode(nombres[indice]));
            let display_numero = document.createElement("span");
            display_numero.setAttribute("class","badge bg-primary ");
            display_numero.innerHTML = contador_opciones_resultantes[indice];
            ingreso.appendChild(display_numero);

            resultado.appendChild(ingreso);
        }
    }
    let btn_borrado = document.createElement("button");
    btn_borrado.innerHTML= "Eliminar salida";
    btn_borrado.setAttribute("class","list-group-item list-group-item-danger");
    btn_borrado.setAttribute("onclick","limpiar_salida()");
    resultado.appendChild(btn_borrado);
    return;
}
	
function limpiar_salida(){
    //vaciar las opciones
    document.getElementById("opciones_resultantes").innerHTML = "";
    return;
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
      tomado = preferencias[indice_elemento]
       + unboundedKnapsack(presupuesto - costos[indice_elemento], costos, preferencias, indice_elemento, dp); 
    }

    dp[indice_elemento][presupuesto] = Math.max(tomado, no_tomado); //comparación para ver cual es mayor
    return (dp[indice_elemento][presupuesto]); 
  } 
   
//funcion recursiva que nos ayuda a conocer los elementos optimos seleccionados usados para llegar a nuestra respuesta
function buscar_elementos(presupuesto, costos, preferencias, indice_elemento, dp, nombres, contador_opciones_resultantes){
    if(indice_elemento == 0){
        for (let indice = 0; indice < Math.floor(presupuesto / costos[0]) ; indice++) {
            contador_opciones_resultantes[indice_elemento] ++;
        }
        return;
    }
    let tomado, no_tomado;
    tomado = dp[indice_elemento][presupuesto - costos[indice_elemento] ] + preferencias[indice_elemento];
    no_tomado = dp[indice_elemento - 1][presupuesto];
    if(tomado > no_tomado){
        contador_opciones_resultantes[indice_elemento] ++; //se añade
        buscar_elementos(presupuesto - costos[indice_elemento], costos,preferencias, indice_elemento, dp, nombres, contador_opciones_resultantes);
    }else{
        buscar_elementos(presupuesto , costos,preferencias, indice_elemento - 1, dp, nombres, contador_opciones_resultantes);
    }
    return ;
}