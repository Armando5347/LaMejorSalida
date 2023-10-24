const express = require('express')
const { format } = require('express/lib/response')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Prueba de fe!')
  opciones = []; //vacia la lista
})

//variables a usar (estaticas de momento, en la implementación se obtienen en base a lo ingresado por el usuario)
let presupuesto = 1000; //presupuesto a considerar
let nombres = ["Alitas", "Pizzas"]; //el nombre de nuestras opciones
let preferencias = [1, 3]; //la preferencia asignada por el usuario de cada opción
//tomando preferencia como la prioridad que le da el usuario de comprar una comida con respecto a otra
let costos = [270, 364]; //el costo monetario conocido de cada opcion a considerar

let numero_elementos = costos.length; //total de lementos a considerar
let dp = Array(numero_elementos)  //matriz que almacena las subestucturas optimas
  .fill() 
  .map(() => Array(presupuesto + 1).fill(-1)); 

let opciones = [] ; //va a contener el resultado de nuestras opciones

//ejecucion
app.listen(port, () => {
  console.log(`Buenas ${port}`)
  //Esto no debería ir aquí, pero como son pruebas de la lógica, me voy a hacer pendejo
  console.log(unboundedKnapsack(presupuesto, costos, preferencias, numero_elementos - 1, dp));
  //con el valor optimo ya calculado, hace un recorrido inverso para obtener los elementos optimos
  buscar_elementos(presupuesto, costos, preferencias, numero_elementos - 1, dp, nombres);
  
  for (let iterador = 0; iterador < opciones.length; iterador++) {
    console.log(opciones[iterador]);
    
  }
})
	
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
            opciones.push(nombres[indice_elemento] );
        }
        return;
    }
    let tomado, no_tomado;
    tomado = dp[indice_elemento][presupuesto - costos[indice_elemento] ] + preferencias[indice_elemento];
    no_tomado = dp[indice_elemento - 1][presupuesto];
    if(tomado > no_tomado){
        opciones.push(nombres[indice_elemento] );
        buscar_elementos(presupuesto - costos[indice_elemento], costos,preferencias, indice_elemento, dp, nombres);
    }else{
        buscar_elementos(presupuesto , costos,preferencias, indice_elemento - 1, dp, nombres);
    }
    return ;
}

//document.write(unboundedKnapsack(presupuesto, n, preferencias, costos)); 

