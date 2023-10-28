function validar_entero(valor_ingresado){
    const patron_entero = /^[0]*[1-9][0-9]*$/ //que solo sean enteros positivos
    const patron_punto = /\./ //que no tenga punto
    if(patron_punto.test(valor_ingresado.value) || !patron_entero.test(valor_ingresado.value)){ //si el valor ingresado no cumple la expresion regular (solo enteros)
        alerta(valor_ingresado.getAttribute("placeholder"));
        valor_ingresado.value = "";
    }
}

function alerta(elemento_ingresado){ //momentaneo, se va a mejorar
    alert("El valor ingresado en "+elemento_ingresado + " es incorrecto.");
}