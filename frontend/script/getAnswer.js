var url = "http://localhost:3000";

async function getAnswer(){

	let response = await fetch(`${url}/getAnswer`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem("showQuestionnaireId"),
      "respondent_email":localStorage.getItem("showAnswererEmail")
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  console.log(item);
  window.localStorage.setItem('showAnswererName',item.respondent_name);
  window.localStorage.setItem('showAnswererCompany',item.respondent_company);
  getAnswererDetails();

  let component = item.answers;
  for(let i=0;i<component.length;i++){
  	createAnswerDetails(i,component[i].question_description);
  }
};

async function createAnswerDetails(num,description){
	let numCell = document.createElement('td');
	numCell.innerText = num;

  let descriptionCell = document.createElement('td');

  let textDescription = document.createElement('p');

  let descriptionText = document.createTextNode(description);
  textDescription.appendChild(descriptionText);

  descriptionCell.appendChild(textDescription);

  let answerCell = document.createElement('td');
	answerCell.setAttribute('style','cursor:pointer');
	answerCell.innerHTML = `<button class="btn btn-info" >See Answers</button>`

	answerCell.addEventListener('click', () => getListAnswers(num));

	let row = document.createElement('tr');
	row.appendChild(numCell);
  row.appendChild(descriptionCell);
	row.appendChild(answerCell);

	let table = document.getElementById('listAnswers');
	table.appendChild(row);
};

async function createListAnswersRadio(answers,score){
  let answerCell = document.createElement('div');
  answerCell.setAttribute('style','display:inline-block;width:50%');

  let scoreCell = document.createElement('div');
  scoreCell.setAttribute('style','display:inline-block');

  let answerText = document.createElement('p');

  let answerScore = document.createElement('p');

  let textAnswer = document.createTextNode(answers);
  answerText.appendChild(textAnswer);

  let textScore = document.createTextNode(score);
  answerScore.appendChild(textScore);

  answerCell.appendChild(answerText);
  scoreCell.appendChild(answerScore);

  let row = document.createElement('div');
  row.appendChild(answerCell);
  row.appendChild(scoreCell);

  let container = document.getElementById('showListOfAnswers');
  container.appendChild(row);
};

async function createListAnswersText(answers){
  let answerCell = document.createElement('div');

  let answerText = document.createElement('p');

  let textAnswer = document.createTextNode(answers);
  answerText.appendChild(textAnswer);

  answerCell.appendChild(answerText);

  let row = document.createElement('div');
  row.appendChild(answerCell);

  let container = document.getElementById('showListOfAnswers');
  container.appendChild(row);
};

async function getListAnswers(i){
	modalListAnswers.style.display = "block";

	let response = await fetch(`${url}/getAnswer`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":localStorage.getItem("showQuestionnaireId"),
      "respondent_email":localStorage.getItem("showAnswererEmail")
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  let component = item.answers;
  if((component[i].question_type==="radio")||(component[i].question_type==="checkbox")){
    fillTotalScore(component[i].Score);
    for(let j=0;j<component[i].answer.length;j++){
      console.log(component[i].question_type);
      fillQuestionsDescription(component[i].question_description);
    	createListAnswersRadio(component[i].answer[j].option_description,component[i].answer[j].option_score);
    }
  }
  else if(component[i].question_type==="text"){
    fillQuestionsDescription(component[i].question_description);
    createListAnswersText(component[i].answer[0].textAnswer);
  }
};


async function getAnswererDetails(){
	let nameElem = document.getElementById('getAnswererName');
	let companyElem = document.getElementById('getAnswererCompany');

	nameElem.innerText = localStorage.getItem('showAnswererName');
	companyElem.innerText = localStorage.getItem('showAnswererCompany');
};

async function fillQuestionsDescription(description){
  let titleElem = document.getElementById("showQuestionsTitle");
  titleElem.innerText = description;
};

async function fillTotalScore(score){
  let scoreElem = document.getElementById("totalScore");

  scoreElem.innerText = score;
}
