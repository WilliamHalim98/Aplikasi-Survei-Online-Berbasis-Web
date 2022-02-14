const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'questionnaire',
  password: 'whmarinedivision98',
  port: 5432,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

async function postUsers(request, response){
  const { email, password, company, name } = request.body

  pool.query('INSERT INTO users (email, password, company, name) VALUES ($1, $2, $3, $4)', [email, password, company, name], (error, results) => {
    if (error) {
      console.log(error);
      throw error
    }
    response.json({message:`Congratulations, you have sucessfully signed up`});
    // response.json({message:`Congratulations, User added with email: ${email}`});
  })
};

async function login(request, response){
  var emailLogin = request.body.email;
  var passwordLogin = request.body.password;
  pool.query('SELECT * FROM users WHERE email=$1 AND password=$2', [emailLogin, passwordLogin], function(error, results, fields){
    if (results.rows.length > 0){
      console.log(emailLogin);
      response.json({success:true});
      response.end();
    }
    else{
      console.log(results.rows.length);
      console.log(emailLogin);
      console.log(passwordLogin);
      response.json({message:"Invalid Login"});
    }
  });
};

module.exports = {
  getUsers,
  postUsers,
  login
}
