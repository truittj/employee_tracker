const inquirer = require ("inquirer");
const mysql = require ("mysql");
const header = require("./Assets/opening.js");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "employee_tracker_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
     
    startTable();
});
      
function start() {
  inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employees",
        "Remove Employee",
        "Update Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "View All Departments",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.start) {
      case "View All Employees":
        callEmployeeTable();
        break;
        
      case "View All Employees by Department":
          departSearch();
          break;

      case "View All Employees by Manager":
        byManager();
        break;

      case "Add Employees":
        adder();
        break;

      case "Remove Employee":
        remover();
        break;
      
      case "Update Employee":
        updateEmployee();
        break;

      case "Update Employee Role":
        updateRole();
        break;

      case "Update Employee Manager":
        updateManager();
        break;

      case "View All Roles":
        callRoleTable();
        break;

        case "View All Departments":
        callDepartmentTable();
        break;

      case "Exit":
        connection.end();
        break;
      }
    });
}


function callEmployeeTable() {
    connection.query("SELECT * FROM employee;", function(err, res) {
      if (err) throw err;

        var employeeObj = [];
        for(var i=0; i<res.length; i++){
            var employeeElm= {};
            employeeElm.id=res[i].id;
            employeeElm.first_name=res[i].first_name;
            employeeElm.last_name=res[i].last_name;
            employeeElm.role_id=res[i].role_id;
            employeeElm.manager_id=res[i].manager_id;
            employeeObj.push(employeeElm)
        }
        var table = cTable.getTable(employeeObj);
        console.log(table);
        start();
        //return employeeObj;

    })
    
};

function departSearch() {
  connection.query("SELECT * FROM employee INNER JOIN role INNER JOIN department", function(err, res) {
    if (err) throw err;
  var tableDepart = cTable.getTable(res);
    console.log(tableDepart);
  start();
  }
)};

function byManager() {
  console.log('View all employees by manager');
  start();
};

// function adder() {
  
//   inquirer
//   .prompt([
//     {
//       name: "first_name",
//       type: "input",
//       message: "What is the employee's first name?"
//     },
//     {
//       name: "last_name",
//       type: "input",
//       message: "What is the employee's last name?"
//     },
//     {
//       name: "role",
//       type: "list",
//       message: "What is the employee's role?",
//       choices: 
//       () => connection.query("SELECT title FROM role", function(err, role) {
//         if (err) throw err;
//         console.log(role);
//         return role;
//       })
//     },
//     {
//       name: "manager",
//       type: "list",
//       message: "Who is the employee's manager",
//       choices: 
      
//       () => connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
//         if (err) throw err;
//         console.log(res);
//         return res;
//       })
//     }
//   ])
//   .then(function(answer) {
//     // when finished prompting, insert a new item into the db with that info
//     connection.query(
//       "INSERT INTO employee SET ?",
//       {
//         first_name: answer.first_name,
//         last_name: answer.last_name,

//         role_id: answer.role,
//         manager_id: answer.manager 
//       },
//       function(err) {
//         if (err) throw err;
//         console.log("Your auction was created successfully!");
//         // re-prompt the user for if they want to bid or post
//         console.log('Add Employee');
//         start();
//       }
//     )
// })};

function remover() {
  var employeeList = [];
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        employeeList.push(res[i].first_name + " " + res[i].last_name);
        console.log(employeeList);
      }
  inquirer
  .prompt ([
    {
      type: "list",
      message: "Which employee would you like to delete?",
      name: "employee",
      choices: employeeList
    },
  ])
  .then (function(res) {
    connection.query(
      `DELETE FROM employee WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "Employee removed");
        start();
        });
      });
    }
)};

function updateEmployee() {
  console.log('Update Employee');
  start();
};

function updateRole() {
  console.log('Update Employee Role');
  start();
};

function updateManager() {
  console.log('Update Manager');
  start();
};


    function callRoleTable() {
        connection.query("SELECT * FROM role;", function(err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          var roleObj=[];
          for(var i=0; i<res.length; i++){
            var roleElm={};
            roleElm.id=res[i].id;
            roleElm.title= res[i].title;
            roleElm.salary=res[i].salary;
            roleElm.department_id=res[i].department_id;
            roleObj.push(roleElm)

          }
          var table = cTable.getTable(roleObj);
          console.log(table);
          start();
          //return roleObj
        })
        
    };


        function callDepartmentTable() {
            connection.query("SELECT * FROM department;", function(err, res) {
              if (err) throw err;
              var departmentObj=[];
              for(var i=0; i<res.length; i++){
                var departmentElm={};
                departmentElm.id=res[i].id;
                departmentElm.name = res[i].depart_name;
                
                departmentObj.push(departmentElm);
            }
            var table = cTable.getTable(departmentObj);
            console.log(table);
            start();
            //return departmentObj;
        })
        ;
    }

    function startTable(employeeObj) {
      console.log(employeeObj);
      start();
      };
//  