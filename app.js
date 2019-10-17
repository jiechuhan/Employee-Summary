const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const inquirer = require("inquirer");
const Employee = require("./lib/Employee.js");
const Manager = require("./lib/Manager.js");
const Engineer = require("./lib/Engineer.js");
const Intern = require("./lib/Intern.js");

const questionMa = [{
    type: "input",
    message: "What's your manager's name?",
    name: "name"
},
{
    type: "input",
    message: "What's your manager's email?",
    name: "email",
    validate: function( value ) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value) || "Please enter a valid email";
      },
},
{
    type: "input",
    message: "What's your manager ID?",
    name: "id",
    validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
    },
},
{
    type: "input",
    message: "What's your office number?",
    name: "officeNum"
}];

const questionEm = [{
    type: "list",
    message: "What role would you like to add in your team?",
    name: "role",
    choices: ["Engineer", "Intern", "I don't want to add anymore"]
}];

const questionEn = [{
        type: "input",
        message: "What's your name?",
        name: "name"
    },
    {
        type: "input",
        message: "What's your email?",
        name: "email",
        validate: function( value ) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value) || "Please enter a valid email";
          },
    },
    {
        type: "input",
        message: "What's your ID?",
        name: "id",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
          },
    },
    {
        type: "input",
        message: "What's your GitHub username",
        name: "github"
    }];

const questionIn = [{
    type: "input",
    message: "What's your name?",
    name: "name"
},
{
    type: "input",
    message: "What's your email?",
    name: "email",
    validate: function( value ) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value) || "Please enter a valid email";
      },
},
{
    type: "input",
    message: "What's your ID?",
    name: "id",
    validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
    },
},
{
    type: "input",
    message: "What's your school",
    name: "school"
}];


async function getData() {
    return new Promise(async (resolve, reject) => {
        let employees = [];
        let employee;
        let manager = await getManager();

        while (employee = await getEmployee()) {
            employees.push(employee);
        }
        resolve({
            manager,
            employees
        })
    })

    async function getManager() {
        return await inquirer.prompt(questionMa)
    };

    async function getEmployee() {
        return new Promise(async (resolve, reject) => {
            let rval = await inquirer.prompt(questionEm);

            if (rval.role === 'Engineer') {
                let rval = await getEngineer();
                let engineer = new Engineer(rval);

                resolve(engineer);
            } else if (rval.role === 'Intern') {
                let rval = await getIntern();
                let intern = new Intern(rval);

                resolve(intern);
            } else {
                resolve(null);
            }
        })
    }
    async function getEngineer() {
        return await inquirer.prompt(questionEn);
    }
    async function getIntern() {
        return await inquirer.prompt(questionIn);
    }
}

async function generateHtml() {
    let data = await getData();

    let contents = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Main Page</title>
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" />
                        <style>
                        .container {
                            display: flex;
                            flex-wrap: wrap;
                            flex-direction: row;
                            justify-content: space-evenly;
                
                        }
                
                        .card {
                            width: 30%;
                            margin: 1%;
                        }
                    </style>
                    </head>
                    <body>
                        <div class="bg-danger" style="width: 100%; height: 15vh">
                            <h1 class="text-white" style="text-align: center; padding-top: 5vh">My Team</h1>
                        </div>
                        <div class="role pt-5">
                            <div class="container">
                            ${getCards()}
                            </div>
                        </div>
                    </body>
                    </html>`
    return contents;
    // console.log(contents);
    function getCards() {
        let rval = data.employees.map(person => {
            console.log(person.getRole());
            if (person.getRole() === 'Intern') {
                return formatIntern(person);
            } else if (person.getRole() === "Engineer") {
                return formatEngineer(person);
            }
        });
        console.log(rval);
        rval.unshift(formatManager(data.manager));
        return rval.join('\n');
    }
}

function formatManager(person) {
    return `<div class="card">
                <div class="card-body bg-primary">
                    <h5 class="card-title name text-white">${person.name}</h5>
                    <h6 class="card-title manager fas fa-mug-hot text-white"> Manager</h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item id">ID: ${person.id}</li>
                    <li class="list-group-item email">Email: ${person.email}</li>
                    <li class="list-group-item school">Office Number: ${person.officeNum}</li>
                </ul>
            </div>`
}

function formatEngineer(person) {
    return `<div class="card">
                <div class="card-body bg-primary">
                    <h5 class="card-title name text-white">${person.name}</h5>
                    <h6 class="card-title engineer fas fa-glasses text-white"> Engineer</h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item id">ID: ${person.id}</li>
                    <li class="list-group-item email">Email: ${person.email}</li>
                    <li class="list-group-item school">GitHub username: ${person.github}</li>
                </ul>
            </div>`
}

function formatIntern(person) {
    return `<div class="card">
                <div class="card-body bg-primary">
                    <h5 class="card-title name text-white">${person.name}</h5>
                    <h6 class="card-title engineer fas fa-user-graduate text-white"> Intern</h6>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item id">ID: ${person.id}</li>
                    <li class="list-group-item email">Email: ${person.email}</li>
                    <li class="list-group-item school">School: ${person.school}</li>
                </ul>
            </div>`;
}


async function doit() {
    let html = await generateHtml();

    console.log('html',html)
    writeFileAsync("employee-summary.html", html);

}
doit();
// fs.writeFile("employee-summary.html", html, function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//   });
  
// getData()
//   .then(async function() {
//       const html = await generateHtml();
//       return writeFileAsync("employee-summary.html", html);
//   }).then(function () {
//     console.log("Successfully wrote to employee-summary.html");
//   })
//   .catch(function (err) {
//     console.log(err);
//   });