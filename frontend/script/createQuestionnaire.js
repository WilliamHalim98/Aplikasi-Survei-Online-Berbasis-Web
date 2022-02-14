var url = "http://localhost:3000";
var questionsList = [];
var idNomor = 0;
let idOptionsList = []; //list of max option id for each question
let idOptionsListIterator = 0;
var idOptions;
var idCek = 0;
var idCheck = 0;
var isRequiredValue;


async function createQuestions(){
  let testing_email = localStorage.getItem('email');
  console.log(testing_email);
  let questionnaireTitleElem = document.getElementById("questionnaireTitle");
  let questionnaireDescriptionElem = document.getElementById("questionnaireDescription");
  console.log(questionnaireTitleElem.value);
  console.log(questionnaireDescriptionElem.value);


  let responses = await fetch(`${url}/questionnaire`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "email": localStorage.getItem('email'),
      "questionnaire_title": questionnaireTitleElem.value,
      "questionnaire_description": questionnaireDescriptionElem.value,
    }),
  });
  let resps = await responses.json();
  window.localStorage.setItem('questionnaireID',resps.message);

  let idNo = localStorage.getItem('idNumber');
  console.log(idNo);
  let iteratorToAccessOptionList = 0;
  for(let i=1;i<=idNo;i++){
    let radioList = [];
    let checkboxList = []
    console.log(i);

    let questionDescriptionElem = document.getElementById('question_description'+[i]);
    let questionTypeElem = document.getElementById('question_type'+[i]);
    let isRequiredElem = document.getElementById('question_isRequired'+[i]);
    if(isRequiredElem.checked==true){
      isRequiredValue = "true";
    }
    else{
      isRequiredValue = "false";
    }

    if(questionTypeElem.value === "text"){
      const daftarPertanyaanText = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredValue,
      }
      questionsList.push(daftarPertanyaanText);
    }
    if(questionTypeElem.value === "radio"){
      const daftarPertanyaanRadio = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredValue,
        options: radioList,
      }
      iteratorToAccessOptionList += 1;
      for(let j=1;j<=idOptionsList[iteratorToAccessOptionList];j++){
        let optionDescriptionElem = document.getElementById('description'+[i]+[j]);
        let optionScoreElem = document.getElementById('score'+[i]+[j]);
        const listsOfRadio = {
          "description":optionDescriptionElem.value,
          "score":parseInt(optionScoreElem.value),
        }
        radioList.push(listsOfRadio);
      }
      questionsList.push(daftarPertanyaanRadio);
    }
    if(questionTypeElem.value === "checkbox"){
      const daftarPertanyaanCheckbox = {
        question_description: questionDescriptionElem.value,
        type: questionTypeElem.value,
        isrequired: isRequiredValue,
        options: checkboxList,
      }
      iteratorToAccessOptionList += 1;
      for(let j=1;j<=idOptionsList[iteratorToAccessOptionList];j++){
        let optionDescriptionElem = document.getElementById('descriptionCheckbox'+[i]+[j]);
        let optionScoreElem = document.getElementById('scoreCheckbox'+[i]+[j]);
        const listsOfCheckbox = {
          "description":optionDescriptionElem.value,
          "score":parseInt(optionScoreElem.value),
        }
        checkboxList.push(listsOfCheckbox);
      }
      questionsList.push(daftarPertanyaanCheckbox);
    }
  };
  console.log(idOptionsList)
  console.log(questionsList);
  console.log(JSON.stringify(questionsList));
  let questionnaireId = localStorage.getItem('questionnaireID');
    let response = await fetch(`${url}/questions`,{
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode:"cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        "questionnaire_id": questionnaireId,
        "questions": questionsList,
      }),
    });
    let result = await response.json();
    console.log(result);
    let urlPart1 = window.location.href.split("/");
    window.location =
      urlPart1.splice(0, urlPart1.length - 1).join("/") + "/questionnaire.html";
};

async function createDivQuestions(){
  idNomor = idNomor + 1;

}

async function createDivQuestionsText(){
  createDivQuestions();

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);
  questionDescription.setAttribute('placeholder', "enter question description");

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);
  type.setAttribute('placeholder','enter question type');
  type.value = "text";
  type.setAttribute('style','display:none')

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);
  isRequired.setAttribute('type','checkbox');
  isRequired.setAttribute('placeholder','is the question required (true or false)');

  let labelRequired = document.createElement('label');
  labelRequired.setAttribute('for','question_isRequired'+[idNomor]);
  labelRequired.setAttribute('style','margin-left:1.3%');
  labelRequired.innerHTML = "required";

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);
  isRequiredCell.appendChild(labelRequired);

  let container = document.createElement('div');
  container.setAttribute('class','card');

  let cardHeader = document.createElement('div');
  cardHeader.setAttribute('class','card-header');
  cardHeader.innerHTML = 'Pertanyaan Text';

  let cardBody = document.createElement('div');
  cardBody.setAttribute('class','card-body');
  cardBody.appendChild(questionDescriptionCell);
  cardBody.appendChild(typeCell);
  cardBody.appendChild(isRequiredCell);

  container.appendChild(cardHeader);
  container.appendChild(cardBody);

  container.setAttribute('style','margin-bottom:2%');

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function createDivQuestionsRadio(){
  idOptions = 0;

  idCheck += 1;
  window.localStorage.setItem('idChecks',idCheck);

  createDivQuestions();

  idOptionsListIterator += 1;

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let tombolAddOptionCell = document.createElement('div');

  let listsOptionsCell = document.createElement('div');
  listsOptionsCell.setAttribute('id','listsOptions'+[idCheck]);

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);
  questionDescription.setAttribute('placeholder', "enter question description");

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);
  type.setAttribute('placeholder', "enter question type");
  type.setAttribute('style',"display:none");
  type.value = "radio";

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);
  isRequired.setAttribute('type','checkbox');
  isRequired.setAttribute('placeholder', "Is the question required (true or false)");

  let labelRequired = document.createElement('label');
  labelRequired.setAttribute('for','question_isRequired'+[idNomor]);
  labelRequired.setAttribute('style','margin-left:1.3%');
  labelRequired.innerHTML = "required";

  let tombolAddOption = document.createElement('button');
  tombolAddOption.setAttribute('onclick','addOptionsRadio()');
  tombolAddOption.innerHTML = 'Add Option';

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);
  isRequiredCell.appendChild(labelRequired);

  tombolAddOptionCell.appendChild(tombolAddOption);

  let container = document.createElement('div');
  container.setAttribute('class','card');

  let cardHeader = document.createElement('div');
  cardHeader.setAttribute('class','card-header');
  cardHeader.innerHTML = 'Pertanyaan Radio';

  let cardBody = document.createElement('div');
  cardBody.setAttribute('class','card-body');
  cardBody.appendChild(questionDescriptionCell);
  cardBody.appendChild(typeCell);
  cardBody.appendChild(isRequiredCell);
  cardBody.appendChild(tombolAddOptionCell);
  cardBody.appendChild(listsOptionsCell);

  container.appendChild(cardHeader);
  container.appendChild(cardBody);

  container.setAttribute('style','margin-bottom:2%');

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};

async function createDivQuestionsCheckbox(){
  idOptions = 0;

  idCek += 1;
  window.localStorage.setItem('idChecking',idCek);

  createDivQuestions();
  idOptionsListIterator += 1;

  let questionDescriptionCell = document.createElement('div');

  let typeCell = document.createElement('div');

  let isRequiredCell = document.createElement('div');

  let tombolAddOptionCell = document.createElement('div');

  let listsOptionsCell = document.createElement('div');
  listsOptionsCell.setAttribute('id','listsOptionsCheckbox'+[idCek]);

  let questionDescription = document.createElement('input');
  questionDescription.setAttribute('id','question_description'+[idNomor]);
  questionDescription.setAttribute('placeholder', "Enter question description");

  let type = document.createElement('input');
  type.setAttribute('id','question_type'+[idNomor]);
  type.setAttribute('placeholder', "Enter question type");
  type.setAttribute('style',"display:none");
  type.value = "checkbox";

  let isRequired = document.createElement('input');
  isRequired.setAttribute('id','question_isRequired'+[idNomor]);
  isRequired.setAttribute('type','checkbox');
  isRequired.setAttribute('placeholder', "Is the question required (true or false)");

  let labelRequired = document.createElement('label');
  labelRequired.setAttribute('for','question_isRequired'+[idNomor]);
  labelRequired.setAttribute('style','margin-left:1.3%');
  labelRequired.innerHTML = "required";

  let tombolAddOption = document.createElement('button');
  tombolAddOption.setAttribute('onclick','addOptionsCheckbox()');
  tombolAddOption.innerHTML = 'Add Option';

  questionDescriptionCell.appendChild(questionDescription);

  typeCell.appendChild(type);

  isRequiredCell.appendChild(isRequired);
  isRequiredCell.appendChild(labelRequired);

  tombolAddOptionCell.appendChild(tombolAddOption);

  let container = document.createElement('div');
  container.setAttribute('class','card');

  let cardHeader = document.createElement('div');
  cardHeader.setAttribute('class','card-header');
  cardHeader.innerHTML = 'Pertanyaan Checkbox';

  let cardBody = document.createElement('div');
  cardBody.setAttribute('class','card-body');
  cardBody.appendChild(questionDescriptionCell);
  cardBody.appendChild(typeCell);
  cardBody.appendChild(isRequiredCell);
  cardBody.appendChild(tombolAddOptionCell);
  cardBody.appendChild(listsOptionsCell);

  container.appendChild(cardHeader);
  container.appendChild(cardBody);

  container.setAttribute('style','margin-bottom:2%');

  let section = document.getElementById('listQuestions');
  section.appendChild(container);

  window.localStorage.setItem('idNumber',idNomor);
};


async function addOptionsRadio(){
  idOptions = idOptions + 1;
  idOptionsList[idOptionsListIterator] = idOptions;

  let idMengecek = localStorage.getItem('idChecks');

  let listOptions = document.createElement('div');
  listOptions.setAttribute('id','listsOptions');

  let optionDescriptionCell = document.createElement('div');

  let optionScoreCell = document.createElement('div');

  description = document.createElement('input');
  description.setAttribute('id','description'+[idNomor]+[idOptions]);
  description.setAttribute('placeholder', "enter option description");

  score = document.createElement('input');
  score.setAttribute('id','score'+[idNomor]+[idOptions]);
  score.setAttribute('placeholder', "enter score");


  optionDescriptionCell.appendChild(description);
  optionScoreCell.appendChild(score);

  let container = document.createElement('div');
  container.appendChild(optionDescriptionCell);
  container.appendChild(optionScoreCell);

  let section = document.getElementById('listsOptions'+[idMengecek]);
  section.appendChild(container);
};

async function addOptionsCheckbox(){
  idOptions = idOptions + 1;
  idOptionsList[idOptionsListIterator] = idOptions;
  let idMengecek = localStorage.getItem('idChecking');

  let listOptions = document.createElement('div');
  listOptions.setAttribute('id','listsOptions');

  let optionDescriptionCell = document.createElement('div');

  let optionScoreCell = document.createElement('div');

  description = document.createElement('input');
  description.setAttribute('id','descriptionCheckbox'+[idNomor]+[idOptions]);
  description.setAttribute('placeholder', "enter question description");


  score = document.createElement('input');
  score.setAttribute('id','scoreCheckbox'+[idNomor]+[idOptions]);
  score.setAttribute('placeholder', "enter score");

  optionDescriptionCell.appendChild(description);
  optionScoreCell.appendChild(score);

  let container = document.createElement('div');
  container.appendChild(optionDescriptionCell);
  container.appendChild(optionScoreCell);

  let section = document.getElementById('listsOptionsCheckbox'+[idMengecek]);
  section.appendChild(container);
};
