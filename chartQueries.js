const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

var dataOptions = [];
var finalizeEnterOptions = [];
var countX = [];
var listOfCheckboxOptions = [];
var jumlahValues;
var parseOptions = [];

async function getChart(request,response){
  let questionnaireIdElem = request.body.questionnaire_id;
  let questionIdElem = request.body.question_id;
  let searchOptions = await pool.query("SELECT * FROM options WHERE questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem, questionIdElem]);
  let hasilSearchOptions = searchOptions.rows;
  let searchQuestionType = await pool.query("SELECT question_type FROM questions WHERE questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem, questionIdElem]);
  let agregatSearchQuestionType = searchQuestionType.rows;
  let skillCariType = agregatSearchQuestionType.map(obj => String(obj.question_type));
  dataOptions = [];
  keterangan = [];
  if(skillCariType[0]=="radio"){
    for(let i=0;i<hasilSearchOptions.length;i++){
      finalizeEnterOptions = [];
      console.log(hasilSearchOptions[i].option_id);
      finalizeEnterOptions.push(hasilSearchOptions[i].option_id);
      let searchAnswers = await pool.query("SELECT option_id FROM answers where questionnaire_id=$1 AND question_id=$2 AND option_id=$3", [questionnaireIdElem,questionIdElem,finalizeEnterOptions]);
      console.log(searchAnswers.rows);
      let hasilSearchAnswers = searchAnswers.rows;
      const data = {
        x: hasilSearchOptions[i].option_description,
        value: hasilSearchAnswers.length
      }
      dataOptions.push(data);
    };
  }
  else{
    console.log(hasilSearchOptions);
    console.log("Jumlah jawaban adalah "+hasilSearchOptions.length);
    finalizeEnterOptions = [];
    for(let i=0;i<hasilSearchOptions.length;i++){
      countX = [];
      finalizeEnterOptions.push(hasilSearchOptions[i].option_id);
      // const data = {
      //   x: hasilSearchOptions[i].description,
      //   value: hasilSearchAnswers.length
      // }
      // dataOptions.push(data);
    }
    console.log(questionIdElem);
    console.log(finalizeEnterOptions);


    let trying = await pool.query("SELECT option_id FROM answers where questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem,questionIdElem]);
    console.log(trying.rows);
    parseOptions = [];
    for(let b=0;b<trying.rows.length;b++){
      parseOptions.push(trying.rows[b].option_id);
    }
    console.log(parseOptions);
    console.log(parseOptions.length);
    console.log(parseOptions[0][0]);

    for(let i=0;i<finalizeEnterOptions.length;i++){
      let searchForOptionsDescription = await pool.query("SELECT * FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3", [questionnaireIdElem,questionIdElem,finalizeEnterOptions[i]])
      console.log(searchForOptionsDescription.rows[0].option_description);
      let hasilSearchForOptionsDescription = searchForOptionsDescription.rows[0].option_description;
      jumlahValues = 0;
      for(let j=0;j<parseOptions.length;j++){
        for(let z=0;z<parseOptions[j].length;z++){
          if(finalizeEnterOptions[i]==parseOptions[j][z]){
            jumlahValues = jumlahValues + 1;
          }
        }
      }
      var data = {
        x: hasilSearchForOptionsDescription,
        value: jumlahValues
      }
      dataOptions.push(data);
    }
    console.log(dataOptions);
  }
  let searchForKeterangan = await pool.query("SELECT question_description FROM questions WHERE questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem, questionIdElem]);
  let hasilSearchForKeterangan = searchForKeterangan.rows;
  console.log(hasilSearchForKeterangan);
  console.log(dataOptions);
  response.json({success:true, message:dataOptions, keterangan:hasilSearchForKeterangan});
};

async function checkChartValidity(request, response){
  let questionnaireIdElem = request.body.questionnaire_id;
  console.log(questionnaireIdElem);
  let questionIdElem = request.body.question_id;
  console.log(questionIdElem);
  let hasilSearching = await pool.query("SELECT * FROM answers WHERE questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem, questionIdElem]);
  response.json({message: hasilSearching.rows});
};

module.exports = {
  getChart,
  checkChartValidity
};
