var url = "http://localhost:3000";

async function getAverage(){
	let responses = await fetch(`${url}/getAverage`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id": localStorage.getItem('id_kuesioner'),
    }),
  });
  let resps = await responses.json();
  console.log(resps);
  let test = localStorage.getItem('id_kuesioner');
  console.log(test);
  let meanElem = document.getElementById('mean');
  meanElem.innerHTML = resps.message;
};

async function getStandardDeviation(){
let responses = await fetch(`${url}/getStandardDeviation`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode:"cors",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      "questionnaire_id": localStorage.getItem('id_kuesioner'),
    }),
  });
  let resps = await responses.json();
  console.log(resps);
  let standardDeviationElem = document.getElementById('standardDeviation');
  standardDeviationElem.innerHTML = resps.message;
};