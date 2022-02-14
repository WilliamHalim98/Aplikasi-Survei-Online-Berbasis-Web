const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

var totalScore;
var sigma;
var totalScoreStdev;

async function calculateAverage(request,response){
  totalScore = 0;
  let questionnaireIdElem = request.body.questionnaire_id;
  let allScore = await pool.query("SELECT total_score FROM score WHERE questionnaire_id=$1", [questionnaireIdElem]);
  console.log(allScore.rows);
  let listScore = allScore.rows;
  let skills = listScore.map(obj => parseInt(obj.total_score));
  console.log(skills);
  let n = skills.length;
  console.log(n);
  for(let i=0;i<n;i++){
    totalScore = totalScore + Number(skills[i]);
  }
  console.log(totalScore);
  let average = totalScore / n;
  response.json({message:average});
};

async function calculateStandardDeviation(request,response){
  totalScoreStdev = 0;
  sigma = 0;
  let questionnaireIdElem = request.body.questionnaire_id;
  let allScore = await pool.query("SELECT total_score FROM score WHERE questionnaire_id=$1", [questionnaireIdElem]);
  console.log(allScore.rows);
  let listScore = allScore.rows;
  let skills = listScore.map(obj => parseInt(obj.total_score))
  let n = skills.length;
  for(let i=0;i<n;i++){
    totalScoreStdev = totalScoreStdev + Number(skills[i]);
  }
  console.log(totalScoreStdev);
  let averageStdev = totalScoreStdev / n;
  for(let i=0;i<n;i++){
    let substraction = skills[i]-averageStdev;
    console.log(substraction)
    sigma = sigma + Math.pow(substraction,2);
  }
  console.log(sigma);
  let divisionResult = sigma / n;
  let standardDeviation = Math.sqrt(divisionResult);
  response.json({message:standardDeviation});
};

module.exports = {
  calculateAverage,
  calculateStandardDeviation
};
