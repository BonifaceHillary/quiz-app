// console.log("hello");

const question = document.getElementById("question");

const choices = Array.from(document.getElementsByClassName("choice-text"));

const progressText = document.getElementById("progressText");

const scoreText = document.getElementById("score");

const progressBarFull = document.getElementById("progressBarFull");

const loader = document.getElementById("loader");

const game = document.getElementById("game");

let currentQuestion = {};

let acceptingAnswers = false;

let score = 0;

let availableQuesions = [];

let questions = [];
  // {
  //   question: "Inside which HTML element do we put the javascript ??",
  //   choice1: "<script>",
  //   choice2: "<javascript>",
  //   choice3: "<js>",
  //   choice4: "<scripting>",
  //   answer: 1,
  // },

  // {
  //   question:
  //     "what is the correct syntax for refering to an external script called 'xxx.js'?",
  //   choice1: "<script href='xxx.js'>",
  //   choice2: "<script name='xxx.js'>",
  //   choice3: "<script src='xxx.js'>",
  //   choice4: "<script file='xxx.js'>",
  //   answer: 3,
  // },

  // {
  //   question: " how do you write 'Hello wolrd' in an alert box",
  //   choice1: "msgBox('Hello World');",
  //   choice2: "alertBox('Hello 
  
  // },  

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);

    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    //   game.classList.remove("hidden");

    //  loader.classList.add("loader");

   
    startGame();
  })

  .catch((err) => {
    console.error(err);
  });


// CONSTANS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];

  getNewQuestion();
    loader.classList.remove("hidden");
    
    game.classList.add("hidden");

};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // go to the end of page
    return window.location.assign("/end.html");
  }

     questionCounter++;
     progressText.innerText = `Question${questionCounter}/${MAX_QUESTIONS}`;

    //  update the progress bar

    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;



  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
 

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    // const classToApply = 'incorrect';
    // if (selectedAnswer == currentQuestion.answer) {
    //   classToApply = 'correct';
    // }

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

      if(classToApply === "correct") {
        incrementScore(CORRECT_BONUS)
      }

    // console.log(selectedAnswer == currentQuestion.answer);

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);

      getNewQuestion();
    }, 1000);        
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

startGame();
