const Pool = require('pg').Pool;
const hashService = require('./hashService.js');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

async function postQuestionnaire(request, response) {
  const { email, questionnaire_title, questionnaire_description } = request.body;
  let hashEmail = request.body.email;
  let hashTitle = request.body.questionnaire_title;
  console.log(hashEmail);
  console.log(hashTitle);
  let questionnaireIdHash = await hashService.hashEmailTitle(hashEmail.concat(hashTitle));

  pool.query('INSERT INTO questionnaire (email, questionnaire_title, questionnaire_description, questionnaire_id) VALUES ($1, $2, $3, $4)', [email, questionnaire_title, questionnaire_description, questionnaireIdHash], (error, results) => {
    if (error) {
      console.log(error);
      throw error
    }
    response.json({message:questionnaireIdHash});
    // response.json({message:`Congratulations, User added with email: ${email}`});
  });
};

async function getQuestionnaires(request,response){
  let emailElem = request.body.email;

  let hasilKuesioner = await pool.query("SELECT * FROM questionnaire WHERE email =$1", [emailElem]);
  console.log(hasilKuesioner);
  response.json({message:hasilKuesioner.rows});
};

async function updateQuestionnaire(request,response){
  let questionnaireTitleElem = request.body.questionnaire_title;
  let questionnaireDescriptionElem = request.body.questionnaire_description;
  let questionnaireIdElem = request.body.questionnaire_id;

  pool.query("UPDATE questionnaire SET questionnaire_title=$1, questionnaire_description=$2 WHERE questionnaire_id=$3;", [questionnaireTitleElem, questionnaireDescriptionElem, questionnaireIdElem], (error) => {
    if(error){
      console.log(error);
      throw error;
    }
    else{
      response.json({success:true, message:"title and description has been updated"});
    }
  });
};

async function deleteScoreById(questionnaire_id){
  let questionnaireIdElem = questionnaire_id;
  let hasilGetScore = await pool.query("SELECT * FROM score");
  let resultHasilGetScore = hasilGetScore.rows;
  for(let i=0;i<resultHasilGetScore.length;i++){
    if(resultHasilGetScore[i].questionnaire_id===questionnaireIdElem){
      pool.query("DELETE FROM score WHERE questionnaire_id=$1", [questionnaireIdElem]);
    }
  }
};

async function deleteAnswersById(questionnaire_id){
  let questionnaireIdElem = questionnaire_id;
  let hasilGetScore = await pool.query("SELECT * FROM answers");
  let resultHasilGetScore = hasilGetScore.rows;
  for(let i=0;i<resultHasilGetScore.length;i++){
    if(resultHasilGetScore[i].questionnaire_id===questionnaireIdElem){
      pool.query("DELETE FROM answers WHERE questionnaire_id=$1", [questionnaireIdElem]);
    }
  }
};

async function deleteOptionsById(questionnaire_id){
  let questionnaireIdElem = questionnaire_id;
  let hasilGetScore = await pool.query("SELECT * FROM options");
  let resultHasilGetScore = hasilGetScore.rows;
  for(let i=0;i<resultHasilGetScore.length;i++){
    if(resultHasilGetScore[i].questionnaire_id===questionnaireIdElem){
      pool.query("DELETE FROM options WHERE questionnaire_id=$1", [questionnaireIdElem]);
    }
  }
};

async function deleteQuestionsById(questionnaire_id){
  let questionnaireIdElem = questionnaire_id;
  let hasilGetScore = await pool.query("SELECT * FROM questions");
  let resultHasilGetScore = hasilGetScore.rows;
  for(let i=0;i<resultHasilGetScore.length;i++){
    if(resultHasilGetScore[i].questionnaire_id===questionnaireIdElem){
      pool.query("DELETE FROM questions WHERE questionnaire_id=$1", [questionnaireIdElem]);
    }
  }
};

async function deleteSingleQuestionnaireById(questionnaire_id){
  let questionnaireIdElem = questionnaire_id;
  let hasilGetScore = await pool.query("SELECT * FROM questionnaire");
  let resultHasilGetScore = hasilGetScore.rows;
  for(let i=0;i<resultHasilGetScore.length;i++){
    if(resultHasilGetScore[i].questionnaire_id===questionnaireIdElem){
      pool.query("DELETE FROM questionnaire WHERE questionnaire_id=$1", [questionnaireIdElem]);
    }
  }
};

async function deleteQuestionnaireById(request, response){
  let questionnaireIdElem = request.body.questionnaire_id;
  deleteScoreById(questionnaireIdElem);
  deleteAnswersById(questionnaireIdElem);
  deleteOptionsById(questionnaireIdElem);
  deleteQuestionsById(questionnaireIdElem);
  deleteSingleQuestionnaireById(questionnaireIdElem);
  response.json({message:"Delete Successful"});
};

async function checkRespondentValidity(request, response){
  let answererEmailElem = request.body.respondent_email;
  let hasilSearching = await pool.query("SELECT * FROM answers WHERE respondent_email=$1", [answererEmailElem]);
  response.json({message: hasilSearching.rows});
}

module.exports = {
  postQuestionnaire,
  getQuestionnaires,
  updateQuestionnaire,
  deleteQuestionnaireById,
  checkRespondentValidity
};
