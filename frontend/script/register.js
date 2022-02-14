var url = "http://localhost:3000";

async function signUp() {
  let emailElem = document.getElementById("email");
  let passwordElem = document.getElementById("password");
  let verifyPasswordElem = document.getElementById("verifyPassword");
  let companyElem = document.getElementById("company");
  let nameElem = document.getElementById("name");
  let testingEmail = emailElem.value;
  let testingPassword = passwordElem.value;
  let testingKonfirmasi = verifyPasswordElem.value;
  let regularExpression  = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  let emailExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(testingKonfirmasi != testingPassword){
      alert("Password and confirmation don't match");
    }
  else{
    if((testingPassword.length<6) || (testingPassword.length>16)){
      alert("Paswword must be between 6-16 characters");
  	}
  else{
    if(!regularExpression.test(testingPassword)){
      alert("Password should contain at least one special character");
    }
    else{
      if(!emailExpression.test(testingEmail)){
        alert("Invalid Email Address");
      }
      else{
       let response = await fetch(`${url}/register`, {
       method: "POST", // *GET, POST, PUT, DELETE, etc.
       mode: "cors", // no-cors, *cors, same-origin
       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
       headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: JSON.stringify({
        email: emailElem.value,
        password: passwordElem.value,
        company: companyElem.value,
        name: nameElem.value
       }),
      });
       const resp = await response.json();
       console.log(resp);
       console.log(resp.message);
          if (resp.message == "Congratulations, you have sucessfully signed up") {
            let urlPart1 = window.location.href.split("/");
            window.location =
              urlPart1.splice(0, urlPart1.length - 1).join("/") + "/verification.html";
          }
          else {
            alert("Sign up failed, please try again");
          }
      }
    }
    }
  }
};
