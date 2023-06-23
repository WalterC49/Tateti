//Selecciono los elemento a utilizar
const tablero = document.querySelector("#tablero");
const info = document.querySelector("#info");
const puntajeEquis = document.querySelector(".puntosEquis");
const puntajeCirculo = document.querySelector(".puntosCirculo");
const puntajeEmpates = document.querySelector(".puntosEmpate");
const boton = document.querySelector("#btn");

const celdas = ["", "", "", "", "", "", "", "", ""]; //A este array lo utilizo como plano para el tablero
let turno = "equis"; //Indica de quien es el turno actual
const puntajes = [0, 0, 0]; //Puntajes: EQUIS - CIRCULO - EMPATE

info.textContent = "Equis va primero";

const crearTablero = () => {
  celdas.forEach((cell_, index) => {
    //_: Indica que no voy a utilizar esa variable, que no la tenga en cuenta
    const celdaElemento = document.createElement("div");

    celdaElemento.id = index;
    celdaElemento.classList.add("celda"); //Le agrego la clase celda a cada casilla
    celdaElemento.addEventListener("click", agregarSigno); //agrego el evento para poder poner los signos

    tablero.append(celdaElemento); //Agrego las casillas al tablero
  });
};

crearTablero();

function agregarSigno(e) {
  const signo = document.createElement("div"); //Creo el elemento que estará en la celda X o O

  signo.classList.add(turno); //Le agrego el valor de turno, que puede ser circulo o equis
  e.target.classList.add("desactivado"); //Desactivado es para que las celdas no resalten con :HOVER
  e.target.append(signo); //Le anexo el signo (X o O) a la celda donde se lo llamó

  turno = turno === "equis" ? "circulo" : "equis"; //Intercambio de valor de turno entre circulo y equis
  info.textContent = "Ahora es el turno de " + turno; //Muestro de quien es el turno en pantalla

  e.target.removeEventListener("click", agregarSigno); //Quito el eventListener para que no se vuelva a llamar en la misma celda

  quienGano(); //Verifico si hay un ganador en cada jugada
}

/* Siendo los indices de cada celda del tablero
0 1 2
3 4 5
6 7 8 respectivamente, comboGanadores guarda las posibles jugadas ganadoras*/
function quienGano() {
  const combosGanadores = [
    //Posibles combinaciones ganadoras
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const celdasTodas = document.querySelectorAll(".celda"); //Guardo en una lista todas las celdas del tablero

  combosGanadores.forEach((array) => {
    //Reviso si "Equis" ganó
    //every: Retorna true o false dependiendo si la condición se cumple en cada elemento del arreglo "array"
    const equisGano = array.every(
      (celda) =>
        //?: Es un operator que le dice a js que no tire un error si se produce uno al querer llamar una función o una varible en una varible que no está definida
        celdasTodas[celda].firstChild?.classList.contains("equis") //Esta condición compara si todas las celdas de una condición ganadora tiene la clase "equis"
    );

    if (equisGano) {
      info.textContent = "¡Equis gano!"; //Muestro al ganador si fue "equis"
      //replaceWith: reemplaza los hijos del elemento con otro/s
      //cloneNode(true): devuelve una copia del elemento llamado, pero no incluye los eventos agregados con eventListener
      celdasTodas.forEach((celda) => celda.replaceWith(celda.cloneNode(true)));
      puntajes[0]++; //Aumento el puntaje actual de equis y lo muestro
      puntajeEquis.textContent = puntajes[0];
    }

    //Reviso si "circulo" ganó
    const circuloGano = array.every((celda) =>
      celdasTodas[celda].firstChild?.classList.contains("circulo")
    );

    if (circuloGano) {
      info.textContent = "¡Circulo gano!";
      celdasTodas.forEach((celda) => celda.replaceWith(celda.cloneNode(true)));
      puntajes[1]++; //Aumento el puntaje actual de circulo y lo muestro
      puntajeCirculo.textContent = puntajes[1];
    }
  });

  //Reviso si hubo un empate
  let celdasOcupadas = 0;
  celdasTodas.forEach((celda) => {
    if (celda.firstChild) {
      //Reviso si las celdas tienen anexado un elemento y las cuento
      celdasOcupadas++;
    }
  });

  if (
    celdasOcupadas == 9 &&
    info.textContent !== "¡Circulo gano!" &&
    info.textContent !== "¡Equis gano!"
  ) {
    info.textContent = "¡Hubo un empate!";
    puntajes[2]++; //Aumento y muestro el contador de empates
    puntajeEmpates.textContent = puntajes[2];
  }
}

//REINICIAR JUEGO
boton.addEventListener("click", () => {
  const celdas = document.querySelectorAll(".celda"); //Selecciono todas las celdas del tablero

  celdas.forEach((celda) => {
    if (celda.firstElementChild) {
      celda.removeChild(celda.firstElementChild); //Eliminos los elementos en las celdas (X o O)
    }
  });

  celdas.forEach((celda) => {
    celda.classList.remove("desactivado");
    celda.addEventListener("click", agregarSigno); //Vuelvo a agregar el eventListener para el juego
  });

  if (turno === "equis")
    info.textContent = "Equis va Primero"; //Muestro quien está por jugar
  else info.textContent = "Circulo va primero";
});
