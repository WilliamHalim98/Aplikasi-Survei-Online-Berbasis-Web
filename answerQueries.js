const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

var questionsList = [];
var optionsList = [];
var superFinal;
var questionsFinal;
var value =[];
var totalScore = 0;
var finalizeOptions;
var answers = [];
var listOfAnswers =[];
var jumlahScore = 0;

async function getQuestionnaireById(request,response){
  let questionnaireIdElem = request.body.questionnaire_id;
  pool.query("SELECT email, questionnaire_title, questionnaire_description FROM questionnaire WHERE questionnaire_id=$1", [questionnaireIdElem], function(error,results){
    if(error){
      console.log(error);
    }
    else{
      response.json(
        {success:true, message:results.rows}
        // {message:results}
      );
      console.log(results);
    };
  });
};


async function getAllOptions(options){
  let questionnaireIdOptionsElem = request.body.questionnaire_id;
  pool.query("SELECT * FROM options where questionnaire_id=$1", [questionnaireIdOptionsElem], function(error,results){
    if(error){
      console.log(error);
    }
    else{
      response.json(
        {success:true, message:results.rows}
        // {message:results}
      );
      console.log(results);
      let options = optionsList;
      optionsList.push(results.rows);
    };
  });
};

async function getAllQuestions(questions){
  let questionnaireIdQuestionsElem = request.body.questionnaire_id;
  pool.query("SELECT * FROM questions where questionnaire_id=$1", [questionnaireIdQuestionsElem], function(error,results){
    if(error){
      console.log(error);
    }
    else{
      response.json(
        {success:true, message:results.rows}
        // {message:results}
      );
      console.log(results);
      let questions = questionsList;
      questions.push(results.rows);
    };
  });
};

async function getOptions(questionnaireID,listOfQuestions){
  let questionnaireIdOptionsElem = questionnaireID;
  questionsList = listOfQuestions;

  const testing = await pool.query("SELECT * FROM options where questionnaire_id=$1", [questionnaireIdOptionsElem]);
  console.log(testing);
  let optionDetails = testing.rows;
  let optionsLength = testing.rows.length;
  for(let j=0;j<optionsLength;j++){
    const daftarQuestionsOptions = {
      option_id: optionDetails[j].option_id,
      option_description: optionDetails[j].description,
      option_score: optionDetails[j].option_score
    };
    optionsList.push(daftarQuestionsOptions);
  };
    console.log(optionsList);
    listOfQuestions.push(testing);
};

async function getQuestions(request,response){
  questionsList = [];
  var questionnaireIdElem = request.body.questionnaire_id;
  const hasil = await pool.query("SELECT * FROM questions where questionnaire_id=$1", [questionnaireIdElem]);
  // console.log(results.rows.length);
  // console.log(results.rows);
  let questionDetails = hasil.rows;
  let questionsLength = hasil.rows.length;
    for(let i=0;i<questionsLength;i++){
      if ( questionDetails[i].question_type === "text" ){
        const daftarQuestionsText = {
          question_id: questionDetails[i].question_id,
          question_description: questionDetails[i].question_description,
          question_type: questionDetails[i].question_type,
          isrequired: questionDetails[i].isrequired
        };
        questionsList.push(daftarQuestionsText);
      }
      else{
        optionsList = [];
        const testing2 = await pool.query("SELECT * FROM options where questionnaire_id=$1 AND question_id=$2", [questionnaireIdElem, questionDetails[i].question_id]);
        console.log(testing2);
        let optionDetails = testing2.rows;
        let optionsLength = testing2.rows.length;
        for(let j=0;j<optionsLength;j++){
          const daftarQuestionsOptions = {
            option_id: optionDetails[j].option_id,
            option_description: optionDetails[j].option_description,
            option_score: optionDetails[j].option_score
          };
          optionsList.push(daftarQuestionsOptions);
        };
        const daftarQuestionsOptionsFinal = {
          question_id: questionDetails[i].question_id,
          question_description: questionDetails[i].question_description,
          question_type: questionDetails[i].question_type,
          isrequired: questionDetails[i].isrequired,
          options: optionsList
        };
        // console.log(daftarQuestionsOptionsFinal);
        questionsList.push(daftarQuestionsOptionsFinal);
      }
    }
    response.json({success:true, message:questionsList});
};

async function cekScore(questionnaire_id,option_id){
  let questionnaireIdElem = questionnaire_id;
  let optionIdElem = option_id;
  let result = pool.query("SELECT option_score FROM options WHERE questionnaire_id=$1 AND option_id=$2", [questionnaireIdElem, optionIdElem]);
};

async function answerQuestionsText(questionnaire_id,answerer_name,answerer_email,answerer_company,question_id,text_answer){
  let questionnaireIdElem = questionnaire_id;
  let answererNameElem = answerer_name;
  let answererEmailElem = answerer_email;
  let answererCompanyElem = answerer_company;
  let questionIdElem = question_id;
  let textAnswerElem = text_answer;

  let results = pool.query("INSERT INTO answers(questionnaire_id, respondent_name, respondent_email, respondent_company, question_id, text_answer) VALUES($1,$2,$3,$4,$5,$6)", [questionnaireIdElem, answererNameElem, answererEmailElem, answererCompanyElem, questionIdElem, textAnswerElem], (error, results) =>{
    if(error){
      console.log(error);
      throw error;
    }

  });
};

async function answerQuestionsRadio(questionnaire_id,answerer_name,answerer_email,answerer_company,question_id,options){
  let questionnaireIdElem = questionnaire_id;
  let answererNameElem = answerer_name;
  let answererEmailElem = answerer_email;
  let answererCompanyElem = answerer_company;
  let questionIdElem = question_id;
  let optionsElem = options;

  pool.query("INSERT INTO answers(questionnaire_id, respondent_name, respondent_email, respondent_company, question_id, option_id) VALUES($1,$2,$3,$4,$5,$6)", [questionnaireIdElem, answererNameElem, answererEmailElem, answererCompanyElem, questionIdElem, optionsElem], (error, results) => {
    if(error){
      console.log(error);
      throw error;
    }
  });
};

async function answerQuestionsCheckbox(questionnaire_id,answerer_name,answerer_email,answerer_company,question_id,options){
  let questionnaireIdElem = questionnaire_id;
  let answererNameElem = answerer_name;
  let answererEmailElem = answerer_email;
  let answererCompanyElem = answerer_company;
  let questionIdElem = question_id;
  let optionsElem = options;

  pool.query("INSERT INTO answers(questionnaire_id, respondent_name, respondent_email, respondent_company, question_id, option_id) VALUES($1,$2,$3,$4,$5,$6)", [questionnaireIdElem, answererNameElem, answererEmailElem, answererCompanyElem, questionIdElem, optionsElem], (error, results) => {
    if(error){
      console.log(error);
      throw error;
    }
  });
};

async function insertScore(email,questionnaire_id,total_score){
  let emailElem = email;
  let questionnaireIdElem = questionnaire_id;
  let totalScoreElem = total_score;

  pool.query("INSERT INTO score (respondent_email,questionnaire_id,total_score) VALUES ($1,$2,$3)", [emailElem, questionnaireIdElem, totalScoreElem], (error,results) => {
    if(error){
      console.log(error);
      throw error;
    }
  });
};

async function answerQuestions(request,response){
  let questionnaireIdElem = request.body.questionnaire_id;
  let answererNameElem = request.body.respondent_name;
  let answererEmailElem = request.body.respondent_email;
  let answererCompanyElem = request.body.respondent_company;
  let answersElem = request.body.answers;
  // console.log(answersElem.length);
  totalScore = 0;
  for(let i=0;i<answersElem.length;i++){
    finalizeOptions=[];
    let detailsElem = answersElem[i].answer;
    // console.log(detailsElem[1])
    if(detailsElem.length == 1){
      for(let j=0;j<detailsElem.length;j++){
        // daftarRadio = [];
        if((typeof detailsElem[j]) === "string"){
          answerQuestionsText(questionnaireIdElem,answererNameElem,answererEmailElem,answererCompanyElem,answersElem[i].question_id,detailsElem[j]);
        }
        else{
          let finalizeOptionsRadio = detailsElem[j];
          finalizeOptions.push(finalizeOptionsRadio);
          console.log(finalizeOptionsRadio);
          const hasilScore = await pool.query("SELECT option_score FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3", [questionnaireIdElem, answersElem[i].question_id,finalizeOptionsRadio]);
          let agregat = hasilScore.rows;
          let skill = agregat.map(obj => parseInt(obj.option_score));
          console.log(skill);
          totalScore = totalScore + Number(skill);
          console.log(totalScore);
          answerQuestionsRadio(questionnaireIdElem,answererNameElem,answererEmailElem,answererCompanyElem,answersElem[i].question_id,finalizeOptions);
        }
      }
    }
    else{
      // daftarCheckbox = [];
      console.log(detailsElem.length);
      for(let j=0;j<detailsElem.length;j++){
        let finalizeOptionsCheckbox = detailsElem[j];
        console.log(finalizeOptionsCheckbox);
        finalizeOptions.push(finalizeOptionsCheckbox);
        console.log(finalizeOptions);
        const hasilScores = await pool.query("SELECT option_score FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3", [questionnaireIdElem, answersElem[i].question_id,finalizeOptionsCheckbox]);
        // let numbers = await hasilScores;
        // console.log(hasilScore.rows);
        let agregat = hasilScores.rows;
        let skill = agregat.map(obj => parseInt(obj.option_score));
        console.log(skill);
        totalScore = totalScore + Number(skill);
        console.log(totalScore);
      }
      answerQuestionsCheckbox(questionnaireIdElem,answererNameElem,answererEmailElem,answererCompanyElem,answersElem[i].question_id,finalizeOptions);
    }
  }
  insertScore(answererEmailElem, questionnaireIdElem, totalScore);
  response.json({message:"Answers have been submitted"});
};

async function getAnswer(request, response){
  let questionnaireIdElem = request.body.questionnaire_id;
  console.log(questionnaireIdElem);
  let answererEmailElem = request.body.respondent_email;
  console.log(answererEmailElem);

  const hasilGetAnswer = await pool.query("SELECT * FROM answers WHERE questionnaire_id=$1 AND respondent_email=$2", [questionnaireIdElem, answererEmailElem]);
  console.log(hasilGetAnswer);
  let daftarQuestions = hasilGetAnswer.rows;
  answers = [];
  for(let i=0;i<daftarQuestions.length;i++){
    const detailType = await pool.query("SELECT question_type FROM questions where questionnaire_id=$1 AND question_id=$2 ORDER BY question_id", [questionnaireIdElem,daftarQuestions[i].question_id]);
    let tipe = detailType.rows;
    let skillTipe = tipe.map(obj => String(obj.question_type));
    console.log(skillTipe[0]);
    jumlahScore = 0;
    if(skillTipe[0] === "text"){
      listOfAnswers = [];
      const listOfTextAnswers = {
        textAnswer: daftarQuestions[i].text_answer
      };
      listOfAnswers.push(listOfTextAnswers);
    }
    else if(skillTipe[0] === "radio"){
      listOfAnswers = [];
      let cariOptionDescription = await pool.query("SELECT option_description FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3 ORDER BY option_id", [questionnaireIdElem,daftarQuestions[i].question_id,daftarQuestions[i].option_id[0]]);
      let hasilCariOptionDescription = cariOptionDescription.rows;
      console.log(hasilCariOptionDescription);
      let skillCariOption = hasilCariOptionDescription.map(obj => String(obj.option_description));
      console.log(skillCariOption);
      let cariScoreDescription = await pool.query("SELECT option_score FROM options where questionnaire_id=$1 AND question_id=$2 AND option_id=$3 ORDER BY option_id", [questionnaireIdElem,daftarQuestions[i].question_id,daftarQuestions[i].option_id[0]]);
      let hasilCariScoreDescription = cariScoreDescription.rows;
      console.log(hasilCariScoreDescription);
      let skillCariScore = hasilCariScoreDescription.map(obj => String(obj.option_score));
      console.log(skillCariOption);
      console.log(skillCariScore);
       const listOfRadioAnswers = {
         option_id: daftarQuestions[i].option_id[0],
         option_description: skillCariOption[0] ,
         option_score: skillCariScore[0]
       };
       jumlahScore = jumlahScore + Number(skillCariScore[0]);
       listOfAnswers.push(listOfRadioAnswers);
    }
    else{
      listOfAnswers = [];
      let mencoba = daftarQuestions[i].option_id;
      console.log(mencoba);
      for(let z=0;z<mencoba.length;z++){
        let cariOptionDescription = await pool.query("SELECT option_description FROM options WHERE questionnaire_id=$1 AND question_id=$2 AND option_id=$3 ORDER BY option_id", [questionnaireIdElem,daftarQuestions[i].question_id,mencoba[z]]);
        let hasilCariOptionDescription = cariOptionDescription.rows;
        let abilities = hasilCariOptionDescription.map(obj => String(obj.option_description));
        let cariScoreCheckboxDescription = await pool.query("SELECT option_score FROM options where questionnaire_id=$1 AND question_id=$2 AND option_id=$3 ORDER BY option_id", [questionnaireIdElem,daftarQuestions[i].question_id,mencoba[z]]);
        let hasilCariScoreCheckboxDescription = cariScoreCheckboxDescription.rows;
        console.log(hasilCariScoreCheckboxDescription);
        let skillCariScoreCheckbox = hasilCariScoreCheckboxDescription.map(obj => String(obj.option_score));
        console.log(abilities);
        console.log(skillCariScoreCheckbox);
        let kejelasan = {
          option_id: mencoba[z],
          option_description: abilities,
          option_score: skillCariScoreCheckbox
        }
        listOfAnswers.push(kejelasan);
        jumlahScore = jumlahScore + Number(skillCariScoreCheckbox);
      }
    }
    const detailQuestionDescription = await pool.query("SELECT question_description FROM questions where questionnaire_id=$1 AND question_id=$2 ORDER BY question_id", [questionnaireIdElem,daftarQuestions[i].question_id]);
    console.log(detailQuestionDescription.rows);
    let agregat = detailQuestionDescription.rows;
    let skill = agregat.map(obj => String(obj.question_description));
    const detailAnswers = {
       question_id: daftarQuestions[i].question_id,
       question_type: skillTipe[0],
       question_description: skill[0],
       answer:listOfAnswers,
       Score: jumlahScore
    };
    answers.push(detailAnswers);
  }
  console.log(answers);
  const detailKuesioner = {
    questionnaire_id: questionnaireIdElem,
    respondent_name: daftarQuestions[0].respondent_name,
    respondent_email: daftarQuestions[0].respondent_email,
    respondent_company: daftarQuestions[0].respondent_company,
    answers:answers
  }
  response.json({success:true , message:detailKuesioner});
};

module.exports = {
  getQuestionnaireById,
  getQuestions,
  answerQuestions,
  getAnswer
};
