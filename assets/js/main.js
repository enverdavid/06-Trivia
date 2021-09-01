// selectores
// const selectCategory = document.getElementById("trivia_category");
const form = document.getElementById("form");
const trivia_amount = document.getElementById("trivia_amount");
const trivia_category = document.getElementById("trivia_category");
const trivia_difficulty = document.getElementById("trivia_difficulty");
const trivia_type = document.getElementById("trivia_type");
const questionsContent = document.getElementById("questionsContent");

const btn1 = document.getElementById("1");
const btn2 = document.getElementById("2");
const btn3 = document.getElementById("3");
const btn4 = document.getElementById("4");
const btnConfirmar = document.getElementById("btn-confirmar");

const responseQuestion = document.getElementById("response-question");
const textResponse = document.getElementById("text-response");

// Final de la trivia
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const btnReboot = document.getElementById("btn-reboot");

// generales
const triviaState = {
  totalQuestions: null,
  currentQuestion: 0,
  correctAnswers: 0,
};

let arregloPreguntas = [];
let btnSubmit = true;

// funciones
const getCategories = async () => {
  const res = await fetch("https://opentdb.com/api_category.php");
  const { trivia_categories } = await res.json();
  const arrOptions = trivia_categories.map((e) => {
    const option = document.createElement("option");
    option.value = e.id;
    option.text = e.name;
    return option;
  });
  trivia_category.append(...arrOptions);
};

const comenzarJuego = async (params) => {
  var url = new URL("https://opentdb.com/api.php");
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const res = await fetch(url);
  const data = await res.json();

  triviaState.totalQuestions = data.results.length;
  mostrarSeccionPreguntas(data);
};

const mostrarSeccionPreguntas = ({ results }) => {
  form.style.display = "none";
  questionsContent.style.display = "flex";

  arregloPreguntas = results;
  iniciaPregunta();
};

const iniciaPregunta = () => {
  if (triviaState.totalQuestions <= triviaState.currentQuestion) {
    questionsContent.style.display = "none";
    resultContainer.style.display = "block";
    resultText.textContent = `Hiciste ${triviaState.correctAnswers} de ${triviaState.totalQuestions} preguntas!`;

    console.log("finalizó!");
    return null;
  }

  const objPregunta = arregloPreguntas[triviaState.currentQuestion];
  document.getElementById("questionName").innerText = atob(objPregunta.question);
  limpiarOpcionSeleccionada();

  if (atob(objPregunta.type) === "boolean") {
    btn1.innerText = "True";
    btn2.innerText = "False";
    btn3.style.display = "none";
    btn4.style.display = "none";
  } else {
    btn3.style.display = "inline";
    btn4.style.display = "inline";

    idIdex = Math.floor(Math.random() * 4) + 1;
    document.getElementById(idIdex).innerText = atob(objPregunta.correct_answer);

    let j = 0;
    for (let i = 1; i <= 4; i++) {
      if (i === idIdex) continue;
      document.getElementById(i).innerText = atob(objPregunta.incorrect_answers[j]);
      j++;
    }
  }
};

const limpiarOpcionSeleccionada = () => {
  btn1.classList.remove("btn-activo");
  btn2.classList.remove("btn-activo");
  btn3.classList.remove("btn-activo");
  btn4.classList.remove("btn-activo");
};

// listeners
btn1.addEventListener("click", () => {
  if (!btnSubmit) return
  btnConfirmar.classList.add("btnConfirmOn")
  limpiarOpcionSeleccionada();
  btn1.classList.add("btn-activo");
  arregloPreguntas[triviaState.currentQuestion].currentOption =
    btn1.textContent;
});
btn2.addEventListener("click", () => {
  if (!btnSubmit) return
  btnConfirmar.classList.add("btnConfirmOn")
  limpiarOpcionSeleccionada();
  btn2.classList.add("btn-activo");
  arregloPreguntas[triviaState.currentQuestion].currentOption =
    btn2.textContent;
});
btn3.addEventListener("click", () => {
  if (!btnSubmit) return
  btnConfirmar.classList.add("btnConfirmOn")
  limpiarOpcionSeleccionada();
  btn3.classList.add("btn-activo");
  arregloPreguntas[triviaState.currentQuestion].currentOption =
    btn3.textContent;
});
btn4.addEventListener("click", () => {
  if (!btnSubmit) return
  btnConfirmar.classList.add("btnConfirmOn")
  limpiarOpcionSeleccionada();
  btn4.classList.add("btn-activo");
  arregloPreguntas[triviaState.currentQuestion].currentOption =
    btn4.textContent;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const params = {};
  params.amount = trivia_amount.value;
  if (trivia_category.value !== "any") params.category = trivia_category.value;
  if (trivia_difficulty.value !== "any")
    params.difficulty = trivia_difficulty.value;
  if (trivia_type.value !== "any") params.type = trivia_type.value;
  params.encode = "base64";
  form.reset();

  comenzarJuego(params);
});

btnConfirmar.addEventListener("click", () => {
  // No mandar a la siguiente prengunata hasta que esté seleccionada una opción.

  const optionSelected =
    arregloPreguntas[triviaState.currentQuestion].currentOption;
  const correctAnswer =
    arregloPreguntas[triviaState.currentQuestion].correct_answer;

  if (!optionSelected) {
    return null;
  } else {
    if (btnSubmit) {
      const responseTrueFalse = optionSelected === atob(correctAnswer);
      responseQuestion.style.display = "block";
      responseTrueFalse ? triviaState.correctAnswers++ : null;
      responseTrueFalse
        ? (responseQuestion.style.background = "#AAFAC8")
        : (responseQuestion.style.background = "#FDC5F5");
      responseTrueFalse
        ? (textResponse.style.color = "#286341")
        : (textResponse.style.color = "#AB2178");
      responseTrueFalse
        ? (textResponse.textContent = "Correcto!!")
        : (textResponse.textContent = "Incorrecto!!");
      btnConfirmar.textContent = "Continuar";
      btnSubmit = false;
    } else {
      responseQuestion.style.display = "none";
      btnConfirmar.textContent = "Comprobar";
      btnConfirmar.classList.remove("btnConfirmOn");
      btnSubmit = true;
      triviaState.currentQuestion++;
      iniciaPregunta();
    }
  }
});

btnReboot.addEventListener('click', () => {
  resultContainer.style.display = "none";
  form.style.display = "block";
  triviaState.totalQuestions = null;
  triviaState.correctAnswers = 0;
  triviaState.currentQuestion = 0;
})

getCategories();
