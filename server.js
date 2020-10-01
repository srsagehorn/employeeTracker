const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("console.table");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employee_db",
});
// this application was a collaboration between Ben de Garcia and Brianna Bullock
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected on thread ${connection.threadId}`);
  menu();
});

function menu() {
  inquirer
    .prompt([
      {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Add department",
          "Add employee",
          "Add role",
          "View Department",
          "View Roles",
          "View Employees",
          "Update Employee role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.menu) {
        case "Add department":
          addDept();
        case "Add employee":
          addEmp();
        case "Add role":
          addRole();
        case "View Department":
          viewDept();
        case "View Roles":
          viewRole();
        case "View Employees":
          viewEmp();
        case "Update Employee role":
          upRole();
        case "Exit":
          exit();
      }
    });
}
addDept = () => {
  inquirer
    .prompt({
      name: "aDept",
      type: "text",
      message: "Please enter the department name you would like to add",
    })
    .then(function () {
      // connection.query(INSERT INTO department)
      console.log("yes");
    });
};

addEmp = () => {
  inquirer
    .prompt(
      {
        name: "empfName",
        type: "text",
        message: "Please enter the employee's first name?",
      },
      {
        name: "emplName",
        type: "text",
        message: "Please enter the employee's last name?",
      },
      {
        name: "empName",
        type: "text",
        message: "What role will this person be in?",
      }
    )
    .then(function () {
      // connection.query(INSERT INTO department)
      console.log("yes");
    });
};

addRole = () => {
  inquirer
    .prompt(
      {
        name: "roleTitle",
        type: "text",
        message: "What is the name of the role you would like to add?",
      },
      {
        name: "roleSalary",
        type: "text",
        message: "What is the salary for this position?",
      },
      {
        name: "roleDept",
        type: "text",
        message: "What department is this position in?",
        // choices: departmentNames,
      }
    )
    .then(function () {
      // connection.query(INSERT INTO department)
      console.log("yes");
    });
};

viewDept = () => {
  inquirer
    .prompt({
      name: "deptName",
      type: "text",
      message: "Please enter the department name you would like to add",
    })
    .then(function () {
      // connection.query(INSERT INTO department)
      console.log("yes");
    });
};

viewRole = () => {};

viewEmp = () => {};

upRole = () => {};

exit = () => {};

// questions
// view, delete, add

// add department
// add role
// add employee
// update employee roles
// view departments
// view roles
// view employees
// Leave app
