//TODO: Include packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");
const conn = require("./connection");

//TODO:

//Create an array of questions for user input
const generalQuestion = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Department",
      "View All Role",
      //"View All Employees By Department",
      //"View All Employees By Manager",
      "Add Departments",
      "Add Role",
      "Add Employee",
      //"Remove Employee",
      "Update Employee Role",
      "Quit",
    ],
  },
];

const departmentQuestion = [
  {
    type: "input",
    name: "department",
    message: "What is the name of the department?",
  },
];

//------------------>

let getGeneralQuestions = function () {
  inquirer.prompt(generalQuestion).then(function (data) {
    //TODO:
    switch (data.choice) {
      case "View All Employees":
        conn.query(
          `
            SELECT 
            e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS name,
            d.name AS department,
            r.title,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e
            LEFT JOIN role r ON e.role_id = r.id
            LEFT JOIN employee m ON m.manager_id = e.id
            LEFT JOIN department d ON r.department_id = d.id;
        `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            getGeneralQuestions();
          }
        );
        break;

      case "View All Department":
        conn.query("SELECT * FROM department", (err, res) => {
          if (err) throw err;
          console.table(res);
          getGeneralQuestions();
        });
        break;

      case "View All Role":
        conn.query(
          `
                SELECT
                r.id, r.title, d.name AS department, r.salary
                FROM role r
                LEFT JOIN department d ON r.department_id = d.id;
            `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            getGeneralQuestions();
          }
        );
        break;

      case "Add Departments":
        inquirer.prompt(departmentQuestion).then(function (data) {
          //data.department
          conn.query(
            ` 
                INSERT INTO department (name)
                VALUES ('${data.department}')
            `,
            (err, res) => {
              if (err) throw err;
              console.log(`Added ${data.department} to department.`);
              getGeneralQuestions();
            }
          );
        });

        break;

      case "Add Role":
        inquirer.prompt(roleQuestion).then(function (data) {

        conn.end();
        break;

      case "Add Employee":
        conn.end();
        break;

      case "Quit":
        conn.end();
        break;
    }
  });
};

getGeneralQuestions();
