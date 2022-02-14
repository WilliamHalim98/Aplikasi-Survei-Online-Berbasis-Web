const Pool = require('pg').Pool;
const hashService = require('./hashService.js');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

async function getAllScores(request, response){
  let questionnaireIdElem = request.body.questionnaire_id;

  var resultScores = await pool.query("SELECT respondent_email, total_score FROM score WHERE questionnaire_id=$1", [questionnaireIdElem]);
  console.log(resultScores);
  response.send({sucess:true, message:resultScores.rows});
};

module.exports = {
  getAllScores
};
