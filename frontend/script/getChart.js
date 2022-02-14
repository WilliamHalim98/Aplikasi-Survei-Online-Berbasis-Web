var url = "http://localhost:3000";

var svgNS = "http://www.w3.org/2000/svg";

var xValues = [];
var yValues = [];
var barColors = [];

async function createRowChart(i,questionnaireTitle,questionnaireDescription,questionnaireId){
	let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionnaireTitleCell = document.createElement('td');

  	textQuestionnaireTitle = document.createTextNode(questionnaireTitle);

	let questionnaireDescriptionCell = document.createElement('td');
	questionnaireDescriptionCell.innerText = questionnaireDescription;

	let chartCell = document.createElement('td');
	chartCell.setAttribute('style','cursor:pointer');
	chartCell.innerHTML = `<button class="btn btn-info" >See Chart</button>`

	questionnaireTitleCell.appendChild(textQuestionnaireTitle);

	chartCell.addEventListener('click', () => getDetailsChart(questionnaireId));

	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionnaireTitleCell);
	row.appendChild(questionnaireDescriptionCell);
	row.appendChild(chartCell);

	let table = document.getElementById('questionnaireChart');
	table.appendChild(row);
};

async function createRowQuestions(questionDescription,questionId){
  let questionCell = document.createElement('div');
  questionCell.setAttribute("style","cursor:pointer");

  let questionText = document.createElement('p');
	questionText.setAttribute('style','text-decoration:underline');

  let textQuestion = document.createTextNode(questionDescription);
  questionText.appendChild(textQuestion);

  questionCell.appendChild(questionText);

  let row = document.createElement('div');
  row.appendChild(questionCell);
  row.addEventListener('click', () => acquireDataQuestions(questionId));

  let container = document.getElementById('listQuestions');
  container.appendChild(row);
}

async function getDetailsChart(questionnaireID){
  window.localStorage.setItem('questionnaireId',questionnaireID);
  loadChartQuestions();
  modalGetQuestions.style.display="block";
};

async function loadChartQuestions(){
  let questionnaireId = localStorage.getItem('questionnaireId');

  let response = await fetch(`${url}/getQuestions`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":questionnaireId,
    }),
  });
  let data = await response.json();
  console.log(data);
  let item = data.message;
  for(let i=0;i<item.length;i++){
		if(item[i].question_type!="text"){
			createRowQuestions(item[i].question_description,item[i].question_id);
		}
  }
};

async function loadQuestionnairesChart(){
	let email = localStorage.getItem('email');

	let response = await fetch(`${url}/getQuestionnaires`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "email":email,
    }),
  });
  let data = await response.json();
  console.log(data);
  let i=1;
  for ( let item of data.message) {
  	createRowChart(i,item.questionnaire_title,item.questionnaire_description,item.questionnaire_id);
  	i++;
  }
};

async function getChart(){
  let tests = localStorage.getItem("question_id");
  console.log(tests);
	let testing = localStorage.getItem('questionnaireId');
	console.log(testing);
	let response = await fetch(`${url}/getChart`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":testing,
        "question_id":parseInt(tests)
    }),
  });
  let hasilnya = await response.json();
  console.log(hasilnya);
  return hasilnya;
};

 async function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (let i=0; i<6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

async function renderChart(){
  let response = await getChart();
  console.log(response);
  let results = response.message;
  xValues = [];
  yValues = [];

  for(let i=0;i<results.length;i++){
    xValues.push(results[i].x);
    yValues.push(results[i].value);
  }

  let colour = await getRandomColor(results.length);
  console.log(colour);

  for(let i=0;i<results.length;i++){
    let colour = await getRandomColor(results.length);
    console.log(colour);
    barColors.push(colour);
  };

  console.log(barColors);

  new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: response.keterangan[0].question_description
    }
  }
});
};

async function acquireDataQuestions(questionId){
	let questionnaireIdElem = localStorage.getItem('questionnaireId');
	console.log(questionnaireIdElem);
	let questionIdElem = questionId;
	console.log(questionIdElem);
	let response = await fetch(`${url}/checkChartValidity`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id": questionnaireIdElem,
      "question_id": parseInt(questionIdElem)
    }),
  });
  let hasil = await response.json();
  console.log(hasil.message);
	if(hasil.message.length == 0){
		alert("Belum ada responden yang menjawab");
	}
	else{
		window.localStorage.setItem("question_id",questionId);
	  let urlPart1 = window.location.href.split("/");
	  window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/chart.html";
	}
};
