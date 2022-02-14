const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db1 = require('./userQueries');
const db2 = require('./questionnaireQueries');
const db3 = require('./questionQueries');
const db4 = require('./answerQueries');
const db5 = require('./scoreQueries');
const db8 = require('./statisticsQueries');
const db9 = require('./chartQueries');
const db10 = require('./cronbachAlphaQueries');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.get('/users', db1.getUsers);
app.post('/register',db1.postUsers);
app.post('/login', db1.login);
app.post('/questionnaire', db2.postQuestionnaire);
app.post('/checkRespondentValidity', db2.checkRespondentValidity);
app.post('/questions', db3.createQuestions);
app.post('/getQuestionnaireById', db4.getQuestionnaireById);
app.post('/getQuestions', db4.getQuestions);
app.post('/answer', db4.answerQuestions);
app.post('/getQuestionnaires', db2.getQuestionnaires);
app.put('/questionnaire', db2.updateQuestionnaire);
app.post('/getScores', db5.getAllScores);
app.post('/getAnswer', db4.getAnswer);
app.post('/getStandardDeviation', db8.calculateStandardDeviation);
app.post('/getAverage', db8.calculateAverage);
app.delete('/deleteQuestionnaire',db2.deleteQuestionnaireById);
app.post('/getChart',db9.getChart);
app.post('/checkChartValidity', db9.checkChartValidity);
app.post('/getQuestionsCronbachAlpha', db10.getQuestionsCronbachAlpha);
app.post('/getDetailsCronbachAlpha', db10.getDetailsCronbachAlpha);


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
