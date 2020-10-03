const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  // display menu
  menu();
});

let managerId = 0;

// set the default manager id because we cant have two auto incrementing tables in mysql
connection.query("SELECT manager_id FROM employee;", function (err, res) {
  if (err) throw err;
  for (let i = 0; i < res.length; i++) {
    if (res[i].manager_id != null && managerId < res[i].manager_id) {
      managerId = res[i].manager_id;
    }
  }
});

// main menu options
function menu() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Menu:",
      choices: [
        "View employees",
        "View departments",
        "View roles",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update an employee's role",
        "Remove an employee",
      ],
    })
    // run corresponding function
    .then((response) => {
      switch (response.menu) {
        case "View employees":
          viewEmp();
          break;
        case "View departments":
          viewDept();
          break;
        case "View roles":
          viewRole();
          break;
        case "Add an employee":
          addEmp();
          break;
        case "Add a department":
          newDept();
          break;
        case "Add a role":
          newRole();
          break;
        case "Update an employee's role":
          updateRole();
          break;
        case "Remove an employee":
          removeEmp();
          break;
      }
    });
}

function viewEmp() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id, employee.first_name FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON department.id=role.department_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      menu();
    }
  );
}

function viewDept() {
  let departments = [];
  // get the all the names of the departments and store them in an array
  connection.query("SELECT name FROM department;", function (err, res) {
    if (err) throw err;
    for (let x = 0; x < res.length; x++) {
      departments.push(res[x].name);
    }
    // Ask the user which department they would like to see
    inquirer
      .prompt({
        name: "department",
        type: "list",
        message: "Which department would you like to see?",
        choices: departments,
      })
      .then((response) => {
        connection.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, 
                    concat(employee2.first_name, " ", employee2.last_name) manager FROM employee 
                    LEFT JOIN role ON employee.role_id=role.id 
                    LEFT JOIN department ON department.id=role.department_id 
                    LEFT JOIN employee employee2 ON employee.id=employee2.manager_id 
                    WHERE name=?`,
          response.department,
          function (err, res) {
            if (err) throw err;
            console.table(res);
            menu();
          }
        );
      });
  });
}

function viewRole() {
  // get all of the role names and push them into an array
  let roles = [];
  connection.query("SELECT title FROM role;", function (err, res) {
    if (err) throw err;
    for (let x = 0; x < res.length; x++) {
      roles.push(res[x].title);
    }
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which of the following roles would you like to view?",
        choices: roles,
      })
      .then((response) => {
        connection.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, 
                    concat(employee2.first_name, " ", employee2.last_name) manager FROM employee 
                    LEFT JOIN role ON employee.role_id=role.id 
                    LEFT JOIN department ON department.id=role.department_id 
                    LEFT JOIN employee employee2 ON employee.id=employee2.manager_id 
                    WHERE title=?`,
          response.role,
          function (err, res) {
            if (err) throw err;
            console.table(res);
            menu();
          }
        );
      });
  });
}

function addEmp() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message:
          "What is the first name of the new employee you would like to add?",
      },
      {
        name: "last_name",
        type: "input",
        message:
          "What is the last name of the new employee you would like to add?",
      },
      {
        name: "manager",
        type: "list",
        message: "Is this employee a manager?",
        choices: ["Yes", "No"],
      },
    ])
    .then((response) => {
      if (response.manager == "Yes") {
        managerId++;
        response.manager = managerId;
      } else {
        response.manager = null;
      }
      connection.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: null,
          manager_id: response.manager,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            `Added ${response.first_name}${" "}${response.last_name}!`
          );
          menu();
        }
      );
    });
  //   });
}

function newDept() {
  // initialize array to store # of departments created to push the correct id into the new row
  let numDepartments = [];
  connection.query("SELECT id FROM department;", function (err, res) {
    if (err) throw err;
    // loop through roles and push into array
    for (let x = 0; x < res.length; x++) {
      numDepartments.push(res[x].id);
    }
    inquirer
      .prompt({
        name: "newDepartment",
        type: "input",
        message:
          "What is the name of the new department you would like to add?",
      })
      .then((response) => {
        connection.query(
          `INSERT INTO department SET ?`,
          {
            id: numDepartments.length + 1,
            name: response.newDepartment,
          },
          function (err, res) {
            if (err) throw err;
          }
        );
        console.log(`Successfully added ${response.newDepartment}!`);
        menu();
      });
  });
}

function newRole() {
  // array to hold number of roles to create the id
  let numRoles = [];
  connection.query("SELECT id FROM role;", function (err, res) {
    if (err) throw err;
    // loop through roles and push into array
    for (let x = 0; x < res.length; x++) {
      numRoles.push(res[x].id);
    }
    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of the new role you would like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this new role?",
        },
      ])
      .then((response) => {
        connection.query(
          `INSERT INTO role SET ?`,
          {
            id: numRoles.length + 1,
            title: response.newRole,
            salary: response.salary,
          },
          function (err, res) {
            if (err) throw err;
          }
        );
        console.log(`Successfully added ${response.newRole}!`);
        menu();
      });
  });
}

function updateRole() {
  connection.query(
    "SELECT id, concat(first_name, ' ', last_name) fullName FROM employee",
    function (err, results2) {
      if (err) throw err;
      let employees = results2.map(
        (employee) => employee.id + " " + employee.fullName
      );

      inquirer
        .prompt({
          name: "employeeChoice",
          type: "list",
          message: "Which employee would you like to change?",
          choices: employees,
        })
        .then((response) => {
          let employeeId = response.employeeChoice.split(" ")[0];
          connection.query("SELECT id, title FROM role;", function (err, res) {
            if (err) throw err;
            // loop through roles and push into array
            let roles = res.map((role) => role.id + " " + role.title);

            inquirer
              .prompt({
                name: "newRole",
                type: "list",
                message: "What is their new role?",
                choices: roles,
              })
              .then((response2) => {
                connection.query(
                  `UPDATE employee SET role_id=${
                    response2.newRole.split(" ")[0]
                  } WHERE employee.id=${employeeId}`,
                  function (err, res) {
                    if (err) throw err;
                  }
                );
                console.log("Role update successful!");
                menu();
              });
          });
        });
    }
  );
}

function removeEmp() {
  console.log("working");
  connection.query(
    "SELECT concat(first_name, ' ', last_name) fullName FROM employee",
    function (err, results3) {
      if (err) throw err;
      let employees = results3.map((employee) => employee.fullName);
      inquirer
        .prompt({
          name: "employeeChoice",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: employees,
        })
        .then((response) => {
          console.log(response.employeeChoice);
          connection.query(
            `DELETE from employee WHERE concat(first_name, ' ', last_name) = ${response.employeeChoice}`,
            function (err, res) {
              if (err) throw err;
              console.log("Employee Removed");
              menu();
            }
          );
        });
    }
  );
}
