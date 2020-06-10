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
        "Update Role",
        "Update Employee Manager",
        "View All Roles",
        "View All Departments",
        "Exit"
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

      case "Update Role":
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
    connection.query(
    `SELECT employee.id, first_name, last_name as employee, title, salary as role, depart_name as department
      FROM employee
        LEFT JOIN role ON role_id = role.id
        LEFT JOIN department ON department_id  = department.id 
      ORDER BY employee.id`, 
    function(err, res) {
      if (err) throw err;
      connection.query(`
      SELECT 
        CONCAT(m.last_Name, ', ', m.first_Name) AS Manager
      FROM
        employee e
      LEFT JOIN employee m ON 
        m.manager_id = e.id
      ORDER BY 
      e.id;`,
      function(err, managerObj) {
        //console.log(managerObj);
        if (err) throw err;
        var employeeArr = res.map((employeeObj, index)=>{
          return {...employeeObj, manager: managerObj[index].Manager}
        });

        var tableEmployee = cTable.getTable(employeeArr);
        console.log(tableEmployee);
        start();
        //return employeeObj;

    })
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
  connection.query(`  
  SELECT
  CONCAT(m.last_Name, ', ', m.first_Name) AS Manager,
  CONCAT(e.last_Name, ', ', e.first_Name) AS 'Direct report'
  FROM
  employee e
  INNER JOIN employee m ON
  m.manager_id = e.id
  ORDER BY
  Manager;
  `, function(err, res) {
    if (err) throw err;
    var tableByManager = cTable.getTable(res);
    console.log(tableByManager);  
    console.log('View all employees by manager');
    start();
    }
  )};

function adder() {
  
  var managerList = [];
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerList.push(res[i].first_name + " " + res[i].last_name);
      }
      var roleList = [];
      connection.query("SELECT title FROM role;", function(err, role) {
        if (err) throw err;
          for (var i = 0; i < role.length; i++) {
            roleList.push(role[i].title);
          }


  inquirer
  .prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role",
      type: "list",
      message: "What is the employee's role?",
      choices: roleList
    },
    {
      name: "manager",
      type: "list",
      message: "Who is the employee's manager",
      choices: managerList
    }
  ])
  .then(function(answer) {

console.log(answer);

    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role,
        manager_id: answer.manager 
      },
      function(err) {
        if (err) throw err;
        // re-prompt the user for if they want to bid or post
        console.log('Add Employee');
        start();
      }
    )
})})})};

function remover() {
  var employeeList = [];
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        employeeList.push(res[i].first_name + " " + res[i].last_name);
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
  inquirer.prompt([
    {
    type: "list",
    message: "Would you like to ADD or REMOVE a role?",
    choices: ["ADD", "REMOVE"],
    name: "path",
    },
  ])
  .then((answer) => {
      if (answer.path === "ADD") {
        var departmentList = [];
        var query = connection.query("SELECT * FROM department;", function(err, dep) {
        if (err) throw err;
        for (var i = 0; i < dep.length; i++) {
        departmentList.push(dep[i].depart_name + " " + dep[i].id);
        }
        
        inquirer.prompt([
          {
              type: "input",
              message: "Enter NEW role",
              name: "title"
          },
          {
              type: "input",
              message: "Enter Salary",
              name: "salary"
          },
          {
            type: "list",
            message: "Which Departent does the new role fall within?",
            name: "id",
            choices: departmentList
          },
        ]) .then ((answers) => {
          var splitSTR = answers['id'].split(" ");            
          connection.query(
            "INSERT role SET ?",
            [
              {
                title: answers.title,
                salary: answers.salary,
                department_id:splitSTR[1]
              }
            ],
            function(err, newRole) {
              if (err) throw err;
              console.log('New Role Added');
              var tableRole = cTable.getTable(newRole);
              console.log(tableRole);
              start();
              })
            })
        })
      }  
      else {
        var roleList = [];
        connection.query("SELECT title FROM role", function(err, role) {
          if (err) throw err;
          for (var i = 0; i < role.length; i++) {
          roleList.push(role[i].title);
            }
        inquirer
        .prompt ([
          {
            type: "list",
            message: "Which ROLE would you like to delete?",
            name: "employee",
            choices: roleList
          },
        ])
        .then (function(res) {
          connection.query("DELETE FROM role WHERE ?",
              {
                title: res.roleList
              },
              function(err, res) {
              if (err) throw err;
              console.log( "Role was removed");
              start();
              });
            });
        })
      };
  })
};

function updateRole() {
  inquirer.prompt([
      {
      type: "list",
      message: "Would you like to ADD or REMOVE a role?",
      choices: ["ADD", "REMOVE"],
      name: "path",
      },
    ])
    .then((answer) => {
        if (answer.path === "ADD") {
          var departmentList = [];
          var query = connection.query("SELECT * FROM department;", function(err, dep) {
          if (err) throw err;
          for (var i = 0; i < dep.length; i++) {
          departmentList.push(dep[i].depart_name + " " + dep[i].id);
          }
          
          inquirer.prompt([
            {
                type: "input",
                message: "Enter NEW role",
                name: "title"
            },
            {
                type: "input",
                message: "Enter Salary",
                name: "salary"
            },
            {
              type: "list",
              message: "Which Departent does the new role fall within?",
              name: "id",
              choices: departmentList
            },
          ]) .then ((answers) => {
            var splitSTR = answers['id'].split(" ");            
            connection.query(
              "INSERT role SET ?",
              [
                {
                  title: answers.title,
                  salary: answers.salary,
                  department_id:splitSTR[1]
                }
              ],
              function(err, newRole) {
                if (err) throw err;
                console.log('New Role Added');
                var tableRole = cTable.getTable(newRole);
                console.log(tableRole);
                start();
                })
              })
          })
        }  
        else {
          var roleList = [];
          connection.query("SELECT title FROM role", function(err, role) {
            if (err) throw err;
            for (var i = 0; i < role.length; i++) {
            roleList.push(role[i].title);
              }
          inquirer
          .prompt ([
            {
              type: "list",
              message: "Which ROLE would you like to delete?",
              name: "employee",
              choices: roleList
            },
          ])
          .then (function(res) {
            connection.query("DELETE FROM role WHERE ?",
                {
                  title: res.roleList
                },
                function(err, res) {
                if (err) throw err;
                console.log( "Role was removed");
                start();
                });
              });
          })
        };
    })
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

    function startTable() {
      start();
      };
//  