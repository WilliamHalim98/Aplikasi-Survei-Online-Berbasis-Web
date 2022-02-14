const Pool = require('pg').Pool;
const hashService = require('./hashService.js');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

var daftarResults;
var daftarResponden = [];
var respondentScore;


async function getQuestionsCronbachAlpha(request,response){
  let idElem = request.body.questionnaire_id;

  let hasilSearching = await pool.query("SELECT * FROM questions WHERE questionnaire_id=$1", [idElem]);
  console.log(hasilSearching);
  response.json({message:hasilSearching.rows});
};

async function getDetailsCronbachAlpha(request, response){
  let idElem = request.body.questionnaire_id;
  let questionsElem = request.body.pilihan_questions;
  console.log(idElem);
  console.log(questionsElem);
  daftarResults = [];
  for(let i=0;i<questionsElem.length;i++){
    daftarResponden = [];
    let results = await pool.query("SELECT * FROM answers WHERE questionnaire_id=$1 AND question_id=$2", [idElem,questionsElem[i]]);
    let hasil = results.rows;
    console.log(hasil);
    for(let j=0;j<hasil.length;j++){
      respondentScore = 0;
      let iterateOptions = hasil[j].option_id;
      for(let z=0;z<iterateOptions.length;z++){
        console.log(iterateOptions[z]);
        let cekSkor = await pool.query("SELECT option_score FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3", [idElem,questionsElem[i],iterateOptions[z]]);
        let aggregate = cekSkor.rows;
        let skillGetScore = aggregate.map(obj => parseInt(obj.option_score));
        console.log(skillGetScore[0]);
        respondentScore += skillGetScore[0];
      }
      const listOfRespondents = {
        Respondent: hasil[j].answerer_name,
        Skor: respondentScore
      }
      daftarResponden.push(listOfRespondents);
    }
    const listOfJawaban = {
      Id_Pertanyaan: questionsElem[i],
      Jawaban: daftarResponden
    }
    console.log(listOfJawaban);
    daftarResults.push(listOfJawaban);
  }
  let cekTotalSkor = await pool.query("SELECT total_score FROM score WHERE questionnaire_id=$1", [idElem]);
  console.log(cekTotalSkor.rows);
  let skillGetTotalScore = cekTotalSkor.rows.map(obj => parseInt(obj.total_score));
  console.log(skillGetTotalScore);
  response.json({success:true , data: skillGetTotalScore ,message:daftarResults});
};

module.exports = {
  getQuestionsCronbachAlpha,
  getDetailsCronbachAlpha
};
