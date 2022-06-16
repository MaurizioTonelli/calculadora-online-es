// Seleccionar de elementos del DOM y agregar event listeners
const display = document.querySelector(".display");

const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", escribirEnDisplay);
});

window.addEventListener("keydown", escribirEnDisplay);

// Un Token es un símbolo completo de una expresión, puede ser un número, un operador, o un símbolo como '(' o ')'
class Token {
  constructor(valor, tipo) {
    this.valor = valor;
    this.tipo = tipo;
  }
}

// Una cadena de tokens es un texto que simboliza una posible expresión matemática.
// Ejemplo: (4.33+2) * 5, donde los tokens son '(', '4.33', '+', '2', ')', '*' y '5'
class CadenaDeTokens {
  constructor(valor) {
    this.valor = valor;
  }

  get tokenActual() {
    return this.valor[0];
  }

  estaVacia() {
    return this.valor == "";
  }

  irAlSiguiente() {
    this.valor = this.valor.slice(1);
  }

  agregarAlPrincipio(ch) {
    this.valor = ch + this.valor;
  }

  obtenerNumero() {
    let valorToken = "";
    while (caracterPerteneceANumero(this.tokenActual)) {
      valorToken += this.tokenActual;
      this.irAlSiguiente();
    }
    return valorToken;
  }

  obtenerSiguienteToken() {
    if (this.estaVacia()) return false;

    if (caracterPerteneceANumero(this.tokenActual)) {
      return new Token(this.obtenerNumero(), "numero");
    } else {
      let valorToken = this.tokenActual;
      this.irAlSiguiente();
      return new Token(valorToken, "operador");
    }
  }
}

function caracterPerteneceANumero(caracter) {
  return (caracter >= "0" && caracter <= "9") || caracter == ".";
}

function obtenerPrimario(cadenaDeTokens) {
  let token = cadenaDeTokens.obtenerSiguienteToken();
  switch (token.tipo) {
    case "numero":
      return token.valor;
    case "operador":
      if (token.valor == "(") {
        let izquierda = obtenerResultadoDeExpresion(cadenaDeTokens);
        token = cadenaDeTokens.obtenerSiguienteToken();
        if (token.valor != ")") {
          return "error";
        }
        return izquierda;
      } else if (token.valor == "-") {
        let izquierda = obtenerPrimario(cadenaDeTokens);
        console.log(-izquierda);
        return -Number(izquierda);
      } else if (token.valor == "+") {
        let izquierda = obtenerPrimario(cadenaDeTokens);
        return -Number(izquierda);
      } else {
        return "error";
      }
  }
}

function obtenerResultadoDeTermino(cadenaDeTokens) {
  let izquierda = obtenerPrimario(cadenaDeTokens);
  let token = cadenaDeTokens.obtenerSiguienteToken();
  while (true) {
    switch (token.valor) {
      case "*":
        izquierda *= obtenerPrimario(cadenaDeTokens);
        token = cadenaDeTokens.obtenerSiguienteToken();
        break;
      case "/":
        izquierda /= obtenerPrimario(cadenaDeTokens);
        token = cadenaDeTokens.obtenerSiguienteToken();
        break;
      case "(":
        let d = obtenerPrimario(cadenaDeTokens);
        izquierda *= d;
        token = cadenaDeTokens.obtenerSiguienteToken();
        if (token.valor != ")") {
          return "error";
        }
        token = cadenaDeTokens.obtenerSiguienteToken();
        break;
      default:
        if (isNaN(izquierda) || izquierda[0] == "e") {
          return "Error";
        }
        let ch = token.valor;
        cadenaDeTokens.agregarAlPrincipio(ch);
        return izquierda;
    }
  }
}

function obtenerResultadoDeExpresion(cadenaDeTokens) {
  let izquierda = obtenerResultadoDeTermino(cadenaDeTokens);
  let token = cadenaDeTokens.obtenerSiguienteToken();
  while (true) {
    switch (token.valor) {
      case "+":
        izquierda =
          Number(izquierda) + Number(obtenerResultadoDeTermino(cadenaDeTokens));
        token = cadenaDeTokens.obtenerSiguienteToken();
        break;
      case "-":
        izquierda =
          Number(izquierda) - Number(obtenerResultadoDeTermino(cadenaDeTokens));
        token = cadenaDeTokens.obtenerSiguienteToken();
        break;
      default:
        if (isNaN(izquierda) || izquierda[0] == "e") {
          return "Error";
        }
        let ch = token.valor;
        cadenaDeTokens.agregarAlPrincipio(ch);
        return izquierda;
    }
  }
}

function calcular(obtenerResultadoDeExpresionTexto) {
  return obtenerResultadoDeExpresion(
    new CadenaDeTokens(obtenerResultadoDeExpresionTexto)
  );
}

function escribirSimboloEnDisplay(simbolo) {
  if (display.textContent == "0" || display.textContent == "Error") {
    display.textContent = simbolo;
  } else {
    display.textContent += simbolo;
  }
}

function borrarSimbolo() {
  if (display.textContent.length > 1) {
    display.textContent = display.textContent.slice(0, -1);
  } else {
    display.textContent = "0";
  }
}

function escribirEnDisplay(e) {
  if (e.type == "click") {
    if (this.id == "c") {
      display.textContent = "0";
      return;
    }
    if (this.id == "=") {
      display.textContent = calcular(display.textContent);
      return;
    }
    escribirSimboloEnDisplay(this.id);
  } else if (e.type == "keydown") {
    if (e.key == "=" || e.key == "Enter") {
      display.textContent = calcular(display.textContent);
      return;
    }
    if (e.key == "c") {
      display.textContent = "0";
      return;
    }
    if (e.key == "Backspace") {
      borrarSimbolo();
    }
    //Evitar efecto de teclas que no tengan botón en el HTML
    const key = document.querySelector(`button[data-key="${e.key}"]`);
    if (!key) return;

    escribirSimboloEnDisplay(e.key);
  }
}
