function validar_entero(input_ingresado){
    const patron_entero = /^[0]*[1-9][0-9]*$/ //que solo sean enteros positivos
    const patron_punto = /\./ //que no tenga punto
    if(patron_punto.test(input_ingresado.value) || !patron_entero.test(input_ingresado.value)){ //si el valor ingresado no cumple la expresion regular (solo enteros)
        alerta(input_ingresado.getAttribute("placeholder"));
        input_ingresado.value = "";
    }
}

//función que valida la entrada de una cadena
//existe principalmente para que no metan cosas raras, aunque eso no debería ser problema
function validar_cadena(input_ingresado) {
    const patron_cadena = /^[A-Za-z0-9áéíóúäëïöüñÁÉÍÓÚ]*$/ //Solo acepta alfanumericos (y acentos)
    if(!patron_cadena.test(input_ingresado.value)){ //si el valor ingresado no cumple la expresion regular (solo enteros)
        alerta(input_ingresado.getAttribute("placeholder"));
        input_ingresado.value = "";
    }
}

function alerta(elemento_ingresado){ //momentaneo, se va a mejorar
    alert("El valor ingresado en "+elemento_ingresado + " es invalido.");
}