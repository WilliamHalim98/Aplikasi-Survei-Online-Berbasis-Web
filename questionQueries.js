const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

var questions = [];
var options = [];

function postQuestionText(questionnaireIdElem,questionIdElem,questionDescriptionElem,typeElem,isrequiredElem) {
  let questionnaireIdElemValue = questionnaireIdElem;
  let questionIdElemValue= questionIdElem;
  let questionDescriptionElemValue = questionDescriptionElem;
  let typeElemValue = typeElem;
  let isrequiredElemValue = isrequiredElem;

  pool.query('INSERT INTO questions (questionnaire_id, question_id, question_description, question_type, isrequired) VALUES ($1, $2, $3, $4, $5)', [questionnaireIdElemValue, questionIdElemValue, questionDescriptionElemValue, typeElemValue, isrequiredElemValue], (error, results) => {
    if (error) {
      console.log(error);
      throw error
    }
    // response.json({message:`Congratulations, User added with email: ${email}`});
  });
};

async function postQuestionRadio(questionnaireIdElem,questionIdElem,optionIdElem,descriptionElem,scoreElem) {
  let questionnaireIdElemValue = questionnaireIdElem;
  let questionIdElemValue= questionIdElem;
  let optionIdElemValue = optionIdElem;
  let descriptionElemValue = descriptionElem;
  let scoreElemValue = scoreElem;

  pool.query('INSERT INTO options (questionnaire_id, question_id, option_id, option_description, option_score) VALUES ($1, $2, $3, $4, $5)', [questionnaireIdElemValue, questionIdElemValue, optionIdElemValue, descriptionElemValue, scoreElemValue], (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
    // response.json({message:`Congratulations, User added with email: ${email}`});
  });
};

async function postQuestionCheckbox(questionnaireIdElem,questionIdElem,optionIdElem,descriptionElem,scoreElem) {
  let questionnaireIdElemValue = questionnaireIdElem;
  let questionIdElemValue= questionIdElem;
  let optionIdElemValue = optionIdElem;
  let descriptionElemValue = descriptionElem;
  let scoreElemValue = scoreElem;

  pool.query('INSERT INTO options (questionnaire_id, question_id, option_id, option_description, option_score) VALUES ($1, $2, $3, $4, $5)', [questionnaireIdElemValue, questionIdElemValue, optionIdElemValue, descriptionElemValue, scoreElemValue], (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
    // response.json({message:`Congratulations, User added with email: ${email}`});
  });
};


async function createQuestions(request,response){
  let questionnaireElem = request.body.questionnaire_id;
  console.log(questionnaireElem)
  let questionsElem = request.body.questions;
  console.log(questionsElem.length);
  for(let i=0;i<questionsElem.length;i++){
    postQuestionText(questionnaireElem, i, questionsElem[i].question_description, questionsElem[i].type, questionsElem[i].isrequired);
    if(questionsElem[i].type === "radio"){
      let testing = await pool.query("SELECT * FROM questions");
      console.log(testing);
      console.log(questionsElem[i].options[1]);
      let optionsRadioElem = questionsElem[i].options;
      for(let j=0;j<optionsRadioElem.length;j++){
        postQuestionRadio(questionnaireElem,i,j,optionsRadioElem[j].description,optionsRadioElem[j].score);
      }
    }
    else if(questionsElem[i].type === "checkbox"){
      let testings = await pool.query("SELECT * FROM questions");
      console.log(testings);
      let optionsCheckboxElem = questionsElem[i].options;
      console.log(optionsCheckboxElem.length);
      for(let j=0;j<optionsCheckboxElem.length;j++){
        postQuestionCheckbox(questionnaireElem,i,j,optionsCheckboxElem[j].description,optionsCheckboxElem[j].score);
      }
    }
    else{
      console.log("continue");
    }
  };
  response.json({message:"Questions have been added"})
};

module.exports = {
  createQuestions
};
