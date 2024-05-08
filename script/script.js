"use strict";

const quesDiv = document.querySelector(".ques-div");
const quesIdText = document.querySelector(".ques-serial");
const questionText = document.querySelector(".ques");
const quesRow = document.querySelector(".ques-row");
const nextQues = document.querySelectorAll(".next-ques");
const prevQues = document.querySelectorAll(".prev-ques");
const quesOpt1Text = document.querySelector("#label-1");
const quesOpt2Text = document.querySelector("#label-2");
const quesOpt3Text = document.querySelector("#label-3");
const quesOpt4Text = document.querySelector("#label-4");
const quesOpt1Value = document.querySelector("#opt-1");
const quesOpt2Value = document.querySelector("#opt-2");
const quesOpt3Value = document.querySelector("#opt-3");
const quesOpt4Value = document.querySelector("#opt-4");
const startQuizBtn = document.querySelector(".start-quiz-btn");
const startQuizTitle = document.querySelector(".logo");
const endQuizBtn = document.querySelector(".end-quiz-btn");
const endBackBtn = document.querySelector(".end-back-btn");
const endTestDiv = document.querySelector(".end-test");
const TestDoneAlert = document.querySelector(".test-done-alert");
const quesFooterDisplay = document.querySelector(".result-div");
const quesDoneStatusDiv = document.querySelector(".ques-done-status-div");
const quesDoneStatus = document.querySelector(".ques-done-status");
const quesStatusBtn = document.querySelectorAll(".ques-status-btn");
const instructionsDiv = document.querySelector(".instructions-div");
const optBtn = document.querySelectorAll(".opt-btn");
const timerDiv = document.querySelector(".timer-div");
const hourText = document.querySelector(".hour");
const minuteText = document.querySelector(".minute");
const secondText = document.querySelector(".second");
const selections = new Map();
const selectionOptions = new Map();
const correctAnswers = [];
let currentSerialNum = 0;
const results = [];
let questionsAnswered = 0;
let questionsUnanswered = 0;
let testTime = 120;
let timerId;

const questionsData = [
  {
    quesId: 1,
    question: "Javascript is an _______ language?",
    options: [
      "object-oriented",
      "procedural",
      "object-BaseAudioContext",
      "none of the above",
    ],
    correctAnswer: "object-oriented",
  },
  {
    quesId: 2,
    question:
      "Which of the following keywords is used to define a variable in Javascript? ",
    options: ["var", "let", "both a and b", "none of the above"],
    correctAnswer: "both a and b",
  },
  {
    quesId: 3,
    question:
      "Which of the following methods is used to access HTML elements using Javascript?",
    options: [
      "getElementById()",
      "getElementByClassName()",
      "both a and b",
      "none of the above",
    ],
    correctAnswer: "both a and b",
  },
  {
    quesId: 4,
    question:
      "Upon encountering empty statements, what does the Javascript Interpreter do?",
    options: [
      "throws an error",
      "ignore the statement",
      "gives a warning",
      "none of the above",
    ],
    correctAnswer: "ignore the statement",
  },
  {
    quesId: 5,
    question:
      "Which of the following methods can be used to display data in some form using Javascript?",
    options: [
      "document.write()",
      "console.log()",
      "window.alert()",
      "all of the above",
    ],
    correctAnswer: "all of the above",
  },
  {
    quesId: 6,
    question: "How can a datatype be declared to be a constant type?",
    options: ["const", "var", "let", "constant"],
    correctAnswer: "const",
  },
];

const increaseSerialNum = function () {
  if (currentSerialNum < questionsData.length) currentSerialNum++;
  // console.log(
  //   "after ++ , now question is : " + questionsData[currentSerialNum].question
  // );
};

const decreaseSerialNum = function () {
  if (currentSerialNum >= 1) currentSerialNum--;
  // console.log(
  //   "after --, now question is : " + questionsData[currentSerialNum].question
  // );
};

//set attempted and not attempted questions status color
const updateQuesDoneStatus = function () {
  quesStatusBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(btn.id);
      console.log("hello");
    });
  });
  selections.forEach((value, key) => {
    //set current question status color
    if (key === currentSerialNum + 1) {
      document.getElementById(key).style.backgroundColor = "darkorchid";
      document.getElementById(key).style.color = "white";
      // console.log(`current ${currentSerialNum + 1} updated!`);
    }

    //set attempted status of other than current question
    if (key > currentSerialNum + 1 || key < currentSerialNum + 1) {
      // console.log(
      //   `key is : ${key} and value is : ${value} and current serial number is : ${
      //     currentSerialNum + 1
      //   } `
      // );
      // console.log(selections);
      if (value === "") {
        document.getElementById(key).style.backgroundColor = "white";
        document.getElementById(key).style.color = "black";
      } else if (value === "Not attempted") {
        // console.log(`non attempt ${key} updated!`);
        document.getElementById(key).style.backgroundColor = "darkorange";
        document.getElementById(key).style.color = "white";
      } else if (value !== "" && value !== "Not attempted") {
        // console.log(`attempted ${key} updated!`);
        document.getElementById(key).style.backgroundColor = "yellowgreen";
        document.getElementById(key).style.color = "white";
      }
    }
  });
};

const saveAndUpdateSelection = function () {
  let selectedValue = "";
  let selectedOption = "";
  let flag;
  optBtn.forEach((btn) => {
    flag = 0;
    btn.addEventListener("click", () => {
      flag = 1;
      // console.log(btn.textContent);
      selectedValue = btn.textContent;
      selectedOption = btn.id;
      saveSelection(selectedValue, selectedOption);
    });
  });
  if (flag === 0) {
    pushSelectedAnswer("Not attempted");
  }
};

const pushSelectedAnswer = function (selectedValue, selectedOption) {
  if (selectedValue === undefined) {
    selectedValue = "Not attempted";
    selectedOption = "0";
  }
  selections.set(currentSerialNum + 1, selectedValue);
  selectionOptions.set(currentSerialNum + 1, selectedOption);
};

const finalSubmission = function (selections) {
  console.log(selections);
  calcResults(selections);
  displayResults();
  endBackBtn.classList.add("hidden");
  endQuizBtn.classList.add("hidden");
  TestDoneAlert.textContent = "Test Submitted! Check your results below";
  timerDiv.classList.add("opacity-zero");
};

const readyToSubmit = function () {
  testCompleted();
  endBackBtn.addEventListener("click", function () {
    console.log(`results : ${results}`);
    quesRow.classList.remove("hidden");
    endTestDiv.classList.add("hidden");
    currentSerialNum = questionsData.length;
    displayPrevQuestion();
  });

  endQuizBtn.addEventListener("click", () => {
    finalSubmission(selections);
  });
};

const testCompleted = function () {
  endTestDiv.classList.remove("hidden");
  quesRow.classList.add("hidden");
};

const displayQuestion = function () {
  if (currentSerialNum > 0 && selections.get(currentSerialNum) === "") {
    selections.set(currentSerialNum, "Not attempted");
  }
  //update the status color in question attempt display
  updateQuesDoneStatus();

  //display previousQuestion button only after question 1
  if (currentSerialNum > 0) {
    //show button after question 1
    prevQues.forEach((btn) => btn.classList.remove("disabled"));
  } else if (currentSerialNum <= 0) {
    //hide button on question 1
    prevQues.forEach((btn) => btn.classList.add("disabled"));
  }

  //display the question
  if (currentSerialNum >= 0 && currentSerialNum < questionsData.length) {
    //update and display question header
    quesIdText.textContent = `Question no. ${questionsData[currentSerialNum].quesId} of ${questionsData.length}`;

    //update question
    questionText.textContent = questionsData[currentSerialNum].question;

    //update options values
    quesOpt1Value.value = questionsData[currentSerialNum].options[0];
    quesOpt2Value.value = questionsData[currentSerialNum].options[1];
    quesOpt3Value.value = questionsData[currentSerialNum].options[2];
    quesOpt4Value.value = questionsData[currentSerialNum].options[3];

    //update options display text
    quesOpt1Text.textContent = questionsData[currentSerialNum].options[0];
    quesOpt2Text.textContent = questionsData[currentSerialNum].options[1];
    quesOpt3Text.textContent = questionsData[currentSerialNum].options[2];
    quesOpt4Text.textContent = questionsData[currentSerialNum].options[3];
  }

  //display already selected answers, if any
  displaySelectedAnswers();
};

//display next question
const displayNextQuestion = () => {
  increaseSerialNum();
  displayQuestion();
  // before final submission
  if (currentSerialNum >= questionsData.length) {
    readyToSubmit();
  }
};

//display previous question
const displayPrevQuestion = () => {
  decreaseSerialNum();
  displayQuestion();
};

const saveSelection = function (selectedValue, selectedOption) {
  pushSelectedAnswer(selectedValue, selectedOption);
  displayNextQuestion();
  displaySelectedAnswers();
};

//reset selected answers
const resetSelections = () => {
  optBtn.forEach((btn) => {
    btn.style.backgroundColor = "white";
    btn.style.color = "black";
  });
};

const selectButton = (btnNumber) => {
  optBtn[btnNumber].style.backgroundColor = "yellowgreen";
  optBtn[btnNumber].style.color = "white";
};

//display already selected answers
const displaySelectedAnswers = function () {
  resetSelections();
  // console.log(selectionOptions.get(currentSerialNum + 1));
  if (
    currentSerialNum < questionsData.length &&
    selectionOptions.get(currentSerialNum + 1) != ""
  ) {
    let optionSelected = selectionOptions.get(currentSerialNum + 1);
    switch (optionSelected) {
      case "opt-1":
        selectButton(0);
        break;
      case "opt-2":
        selectButton(1);
        break;
      case "opt-3":
        selectButton(2);
        break;
      case "opt-4":
        selectButton(3);
        break;
      default:
        break;
    }
  } else {
    resetSelections();
  }
};

//set timer
const tick = function () {
  const hour = String(Math.trunc(testTime / 3600)).padStart(2, "0");
  const min = String(Math.trunc((testTime % 3600) / 60)).padStart(2, "0");
  const sec = String(testTime % 60).padStart(2, "0");
  hourText.textContent = hour;
  minuteText.textContent = min;
  secondText.textContent = sec;
  if (testTime === 0) {
    stopTimer();
    readyToSubmit();
    finalSubmission(selections);
  }
  testTime--;
};

//start timer function
const startTimer = () => {
  timerId = setInterval(tick, 1000);
};

//stop timer function
const stopTimer = () => clearInterval(timerId);

//function for starting the quiz
const startQuiz = function () {
  //when user click on start quiz button
  tick();
  startQuizBtn.addEventListener("click", () => {
    //add all question IDs to selection map with empty answers
    questionsData.forEach((row) => {
      selections.set(row.quesId, "");
      selectionOptions.set(row.quesId, "");
    });
    timerDiv.classList.remove("opacity-zero");
    quesRow.classList.remove("hidden");
    instructionsDiv.classList.remove("opacity-zero");
    quesFooterDisplay.classList.remove("hidden");
    quesDoneStatusDiv.classList.remove("hidden");

    //start timer
    startTimer();

    //display question
    displayQuestion();
    saveAndUpdateSelection();

    //hide the start quiz button
    startQuizBtn.classList.add("hidden");

    //hide the start quiz title
    startQuizTitle.classList.add("hidden");
  });

  //change the current displaying question to prev
  prevQues.forEach((btn) => {
    btn.addEventListener("click", function () {
      displayPrevQuestion();
      displaySelectedAnswers();
    });
  });

  //change the current displaying question to next
  nextQues.forEach((btn) => {
    btn.addEventListener("click", displayNextQuestion);
  });

  questionsData.forEach((row) => {
    correctAnswers.push(row.correctAnswer);
  });
};

const checkDuplicatesInResults = (quesId) => {
  results.forEach((row) => {
    if (row.quesId.includes(quesId)) {
      console.log("duplicates found");
      return false;
    }
  });
  return true;
};

const calcResults = function (selections) {
  let index = 0;
  selections.forEach((selectedAnswer, quesId) => {
    if (
      selectedAnswer === correctAnswers[index] &&
      checkDuplicatesInResults(quesId)
    ) {
      results.push({
        quesId: `${quesId}`,
        correctAnswer: `${correctAnswers[index]}`,
        selectedAnswer: `${selectedAnswer}`,
        status: "correct",
      });
    } else if (checkDuplicatesInResults(quesId)) {
      results.push({
        quesId: `${quesId}`,
        correctAnswer: `${correctAnswers[index]}`,
        selectedAnswer: `${selectedAnswer}`,
        status:
          selectedAnswer === "Not attempted"
            ? "Not attempted"
            : selectedAnswer === ""
            ? "Not visited"
            : "wrong",
      });
    }
    index++;
  });
};

const displayResults = function () {
  quesFooterDisplay.classList.remove("hidden");
  results.map((row) => {
    console.log("running");
    const html = `<div class="results-desc">
              <p class="status">${row.quesId} : ${row.status} : ${row.correctAnswer} : ${row.selectedAnswer}</p>
            </div>`;

    quesFooterDisplay.insertAdjacentHTML("beforeend", html);
  });
};

for (let i = 0; i < questionsData.length; i++) {
  const newDiv = document.createElement("div");
  newDiv.className = "ques-status";
  newDiv.innerHTML = `<button
  id= "${questionsData[i].quesId}" 
  class="ques-status-btn">
  ${questionsData[i].quesId}
  </button>`;

  // quesDoneStatus.insertAdjacentHTML("beforeend", html);
  quesDoneStatus.appendChild(newDiv);
}

// start the quiz
startQuiz();
