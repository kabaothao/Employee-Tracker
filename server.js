//TODO: Include packages needed for this application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");
const conn = require("./connection");

//TODO: Create an array of questions for user input
const generalQuestion = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Department",
      "View All Role",
      "View All Employees By Department",
      "View All Employees By Manager",
      "View Department's Budget",
      "Add Departments",
      "Add Role",
      "Add Employee",
      "Update Employee's Role",
      "Update Employee's Manager",
      "Delete Employee, Department, Role",
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

let roleQuestion = [
  {
    type: "input",
    name: "title",
    message: "What is the name of the role?",
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary of the role?",
  },
  {
    type: "list",
    name: "department",
    message: "Which department does the role belong to?",
    choices: [],
  },
];

let employeeQuestion = [
  {
    type: "input",
    name: "firstName",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "lastName",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "role",
    message: "Which is the employee's role?",
    choices: [],
  },
  {
    type: "list",
    name: "manager",
    message: "Who is the employee's manager?",
    choices: [],
  },
];

let updateEmployeeRoleQuestion = [
  {
    type: "list",
    name: "employee",
    message: "Which employee's role would you like to update?",
    choices: [],
  },
  {
    type: "list",
    name: "role",
    message: "Which role do you want to assign the selected employee?",
    choices: [],
  },
];

let updateEmployeeManagerQuestion = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: [],
  },
  {
    type: "list",
    name: "manager",
    message: "Which manager would you like to assign to the selected employee?",
    choices: [],
  },
];

//TODO: create delete questions
let deleteQuestion = [
  {
    type: "list",
    name: "table",
    message: "Which table would you like to delete from?",
    choices: ["Employee", "Department", "Role"],
  },
];

//functions section
let employees, roles, managers, departments, list, selected_table;

let getDepartments = async function () {
  conn.query(
    ` 
        SELECT id, name
        FROM department
    `,
    (err, res) => {
      if (err) throw err;
      roleQuestion[2].choices = res.map((m) => m.name);
      departments = res;
      return departments;
    }
  );
};

let getRoles = async function () {
  conn.query(
    `
        SELECT title, id
        FROM role
    `,
    (err, res) => {
      if (err) throw err;
      updateEmployeeRoleQuestion[1].choices = res.map((m) => m.title);
      employeeQuestion[2].choices = res.map((m) => m.title);
      roles = res;
      return roles;
    }
  );
};

let getManagers = async function () {
  conn.query(
    `
        SELECT 
            e.id,
            CONCAT(e.first_name, ' ', e.last_name) AS fullName
        FROM employee e
        INNER JOIN employee m ON e.id = m.manager_id;
      `,
    (err, res) => {
      if (err) throw err;
      updateEmployeeManagerQuestion[1].choices = res.map((m) => m.fullName);
      employeeQuestion[3].choices = res.map((m) => m.fullName);
      employeeQuestion[3].choices.push("No Manager");
      managers = res;
      return managers;
    }
  );
};

let getEmployees = function () {
  conn.query(
    `
        SELECT id, 
               CONCAT(first_name, ' ',last_name) AS fullName
        FROM employee;
    `,
    (err, res) => {
      if (err) throw err;
      updateEmployeeRoleQuestion[0].choices = res.map((e) => e.fullName);
      updateEmployeeManagerQuestion[0].choices = res.map((e) => e.fullName);
      employees = res;
      return employees;
    }
  );
};

let preloadData = function () {
  getEmployees();
  getManagers();
  getRoles();
  getDepartments();
};

//------------------>

let getGeneralQuestions = async function () {
  preloadData();
  inquirer.prompt(generalQuestion).then(function (data) {
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
            LEFT JOIN employee m ON m.id = e.manager_id
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
      //TODO: Add roles, add employees, and update employee roles
      case "Add Role":
        inquirer.prompt(roleQuestion).then(function (data) {
          let role = {
            title: data.title,
            salary: data.salary,
            department_id: departments.filter((d) => {
              return d.name === data.department;
            })[0].id,
          };
          conn.query(
            `
                INSERT INTO role (title, salary, department_id)
                VALUES ('${role.title}', ${role.salary}, ${role.department_id} )
            `,
            (err, res) => {
              if (err) throw err;
              console.log(`Added ${data.title} to role.`);
              getGeneralQuestions();
            }
          );
        });
        break;

      case "Add Employee":
        inquirer.prompt(employeeQuestion).then(function (data) {
          let employee = {
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: roles.filter((r) => {
              return r.title === data.role;
            })[0].id,
            managerId: managers.filter((m) => {
              return m.fullName === data.manager;
            })[0].id,
          };
          console.log(employee);
          conn.query(
            `
                INSERT INTO employee (first_Name, last_Name, role_id, manager_id)
                VALUES ('${employee.firstName}', '${employee.lastName}', '${employee.roleId}', '${employee.managerId}')
            `,
            (err, res) => {
              if (err) throw err;
              console.log(
                `Added ${employee.firstName} ${employee.lastName} as an employee.`
              );
              getGeneralQuestions();
            }
          );
        });
        break;

      case "Update Employee's Role":
        inquirer.prompt(updateEmployeeRoleQuestion).then(function (data) {
          let e = {
            id: employees.filter((f) => {
              return f.fullName === data.employee;
            })[0].id,
            roleId: roles.filter((f) => {
              return f.title === data.role;
            })[0].id,
          };
          conn.query(
            `
                  UPDATE employee
                  SET role_id = ${e.roleId}
                  WHERE id = ${e.id}

                `,
            (err, res) => {
              if (err) throw err;
              console.log(`Employee's role updated successfully.`);
              getGeneralQuestions();
            }
          );
        });
        break;

      case "Update Employee's Manager":
        inquirer.prompt(updateEmployeeManagerQuestion).then(function (data) {
          let e = {
            id: employees.filter((f) => {
              return f.fullName === data.employee;
            })[0].id,
            managerId: managers.filter((f) => {
              return f.fullName === data.manager;
            })[0].id,
          };
          conn.query(
            `
            UPDATE employee
            SET manager_id = ${e.managerId}
            WHERE id = ${e.id}
            `,
            (err, res) => {
              if (err) throw err;
              console.log(`Employee's manager updated successfully.`);
              getGeneralQuestions();
            }
          );
        });
        break;

      case "View All Employees By Manager":
        conn.query(
          `
            SELECT CONCAT(m.first_name, ' ', m.last_name) AS Manager,
            CONCAT(e.first_name, ' ', e.last_name) AS Employee
            FROM employee e
            INNER JOIN employee m ON m.id = e.manager_id
          `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            getGeneralQuestions();
          }
        );
        break;

      case "View All Employees By Department":
        conn.query(
          `
            SELECT d.name AS Department, 
            CONCAT(e.first_name, ' ' , e.last_name) AS Employee 
            FROM employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN department d ON d.id = r.department_id 
            `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            getGeneralQuestions();
          }
        );
        break;

      case "View Department's Budget":
        conn.query(
          `
            SELECT d.id, d.name AS Department,
            FORMAT(SUM(IFNULL(r.salary,0)),0) AS Budget
            FROM department d
            LEFT JOIN role r ON r.department_id = d.id
            LEFT JOIN employee e ON e.role_id = r.id
            GROUP BY d.id;
        `,
          (err, res) => {
            if (err) throw err;
            console.table(res);
            getGeneralQuestions();
          }
        );
        break;

      case "Delete Employee, Department, Role":
        inquirer.prompt(deleteQuestion).then(function (data) {
          selected_table = data.table;
          if (selected_table === "Employee") {
            list = employees.map((m) => m.fullName);
          } else if (selected_table === "Role") {
            list = roles.map((m) => m.title);
          } else if (selected_table === "Department") {
            list = departments.map((m) => m.name);
          }
          let nextQuestion = [
            {
              type: "list",
              name: "option",
              message: "Which table would you like to delete from?",
              choices: list,
            },
          ];
          inquirer.prompt(nextQuestion).then(function (data) {
            let id = -1;
            if (selected_table === "Employee") {
              id = employees.filter((f) => {
                return f.fullName === data.option;
              })[0].id;
            } else if (selected_table === "Department") {
              id = departments.filter((f) => {
                return f.name === data.option;
              })[0].id;
            } else if (selected_table === "Role") {
              id = roles.filter((f) => {
                return f.title === data.option;
              })[0].id;
            }

            conn.query(
              `
                  DELETE
                  FROM ${selected_table}
                  WHERE id = ${id}
              `,
              (err, res) => {
                if (err) throw err;
                console.log(`${data.option} was deleted successfully!`);
                getGeneralQuestions();
              }
            );
          });
        });
        break;

      case "Quit":
        break;
    }
  });
};

getGeneralQuestions();
