var url = "http://localhost:3000";

var countQuestions;
var k;
var pilihanQuestions = [];
var daftarVariance = [];
var hasilVariance = [];
var listHasilPerhitungan = [];


async function createRow(i,questionnaireId,questionnaireTitle,questionnaireDescription){
	let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionnaireTitleCell = document.createElement('td');

  textQuestionnaireTitle = document.createTextNode(questionnaireTitle);

	let questionnaireDescriptionCell = document.createElement('td');
	questionnaireDescriptionCell.innerText = questionnaireDescription;

	let detailCell = document.createElement('td');
	detailCell.setAttribute('style','cursor:pointer');
	detailCell.innerHTML = `<button class="btn btn-success" >Pilih</button>`

	detailCell.addEventListener('click', () => getDetailsCronbachAlpha(questionnaireId));

  questionnaireTitleCell.appendChild(textQuestionnaireTitle);

	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionnaireTitleCell);
	row.appendChild(questionnaireDescriptionCell);
	row.appendChild(detailCell);

	let table = document.getElementById('daftarKuesioner');
	table.appendChild(row);
};

async function createRowCronbachAlpha(i,questionId,questionDescription){
  let numCell = document.createElement('td');
	numCell.innerText = i;

	let questionDescriptionCell = document.createElement('td');

  textQuestionDescription = document.createTextNode(questionDescription);

	let checkboxCell = document.createElement('td');
	checkboxCell.innerHTML = `<input style="cursor:pointer" type="checkbox" id="idCheckbox${questionId}"></input>`


  questionDescriptionCell.appendChild(textQuestionDescription);

	let row = document.createElement('tr');
	row.appendChild(numCell);
	row.appendChild(questionDescriptionCell);
	row.appendChild(checkboxCell);

	let table = document.getElementById('daftarPertanyaan');
	table.appendChild(row);
};

async function loadQuestionnaires(){
	let email = localStorage.getItem('email');

	let response = await fetch(`${url}/getQuestionnaires`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
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
  	createRow(i,item.questionnaire_id,item.questionnaire_title,item.questionnaire_description);
  	i++;
  }
};

async function getDetailsCronbachAlpha(questionnaireId){
  window.localStorage.setItem('showQuestionnaireIdAlpha',questionnaireId);
  let urlPart1 = window.location.href.split("/");
    window.location = urlPart1.splice(0, urlPart1.length - 1).join("/") + "/cronbachAlpha.html";
};

async function getAllQuestions(){
  let idElem = localStorage.getItem('showQuestionnaireIdAlpha');

  let response = await fetch(`${url}/getQuestionsCronbachAlpha`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id":idElem,
    }),
  });
  let data = await response.json();
  console.log(data);
	let item = data.message;
	countQuestions = 0;
  for (let i=0;i<item.length;i++) {
		countQuestions+=1;
		if(item[i].question_type != "text"){
			createRowCronbachAlpha(i,item[i].question_id,item[i].question_description);
		}
  }
};

async function cekCheckbox(){
	document.getElementById("cardCronbachAlpha").style.display="block";
	console.log(countQuestions);
	k = 0;
	for(let i=0;i<countQuestions;i++){
		let search = document.getElementById("idCheckbox"+i);
		console.log(search);
		if(search!=null){
			if(search.checked==true){
				k+=1;
				pilihanQuestions.push(i);
			}
		}
	}
	console.log(k);
	console.log(pilihanQuestions);
	let idQuestionnaireAlpha = localStorage.getItem("showQuestionnaireIdAlpha");
	let response = await fetch(`${url}/getDetailsCronbachAlpha`,{
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
			"questionnaire_id":idQuestionnaireAlpha,
			"pilihan_questions": pilihanQuestions
    }),
  });
  let data = await response.json();
  console.log(data);
	var hasilPerhitunganSkorVariance = await calculateTotalSkorVariance(data.data);
	let kelompokPertanyaan = data.message;
	listHasilPerhitungan = [];
	for(let a=0;a<kelompokPertanyaan.length;a++){
		daftarVariance = [];
		for(let b=0;b<kelompokPertanyaan[a].Jawaban.length;b++){
			daftarVariance.push(kelompokPertanyaan[a].Jawaban[b].Skor);
		}
		console.log(daftarVariance);
		var hasilPerhitungan = await calculateVariance(daftarVariance, idQuestionnaireAlpha);
	}
	listHasilPerhitungan.push(hasilPerhitungan);
	console.log(listHasilPerhitungan);
	console.log(hasilPerhitunganSkorVariance);
	calculateCronbachAlpha(k,listHasilPerhitungan,hasilPerhitunganSkorVariance);
	let finalPerhitungan = await calculateCronbachAlpha(k,listHasilPerhitungan,hasilPerhitunganSkorVariance);
	kesimpulan(finalPerhitungan);
};

async function calculateVariance(daftarVariance,questionnaireId){
	let output = d3.variance(daftarVariance);
	hasilVariance.push(output);
	console.log(hasilVariance);
	return hasilVariance;
};

async function calculateTotalSkorVariance(totalSkorVariance){
	let outputTotalSkor = d3.variance(totalSkorVariance);
	console.log(outputTotalSkor);
	return outputTotalSkor;
};

async function calculateCronbachAlpha(k,daftarVariance,totalSkorVariance){
	let kalkulasiDaftarVariance = 0;
	let grup = k/(k-1);
	console.log(grup);
	console.log(daftarVariance[0]);
	let resultsOfVariance = daftarVariance[0];
	for(i=0;i<resultsOfVariance.length;i++){
		kalkulasiDaftarVariance += resultsOfVariance[i];
	}
	console.log(kalkulasiDaftarVariance);
	console.log(totalSkorVariance);
	let perhitunganVariance = (totalSkorVariance-kalkulasiDaftarVariance)/totalSkorVariance;
	console.log(perhitunganVariance);
	let hasil = grup * perhitunganVariance;
	console.log(hasil);
	return hasil;
};

async function kesimpulan(hasil){
	document.getElementById("consistencyValue").innerHTML = hasil;
	if(hasil>=0.90){
		document.getElementById("kesimpulan").innerHTML = "Kesimpulan: Hasil uji konsistensi internal tergolong dalam kategori baik(Excellent)";
	}
	else if(hasil>=0.80 && hasil<0.90){
		document.getElementById("kesimpulan").innerHTML = "Kesimpulan: Hasil uji konsistensi internal tergolong dalam kategori memenuhi syarat(Adequate)";
	}
	else if(hasil>=0.70 && hasil<0.80){
		document.getElementById("kesimpulan").innerHTML = "Kesimpulan: Hasil uji konsistensi internal tergolong dalam kategori tipis(Marginal)";
	}
	else if(hasil>=0.60 && hasil<0.70){
		document.getElementById("kesimpulan").innerHTML = "Kesimpulan: Hasil uji konsistensi internal tergolong dalam kategori mencurigakan(Suspect)";
	}
	else{
		document.getElementById("kesimpulan").innerHTML = "Kesimpulan: Hasil uji konsistensi internal tergolong dalam kategori tidak dapat diterima(Unacceptable)";
	}
}
