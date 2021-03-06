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
  
  connection.connect(function(err) {
    if (err) throw err;
     
    start();
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
    `SELECT employee.id, first_name, last_name, title, salary, depart_name
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
        e.id = m.manager_id 
      ORDER BY 
      e.id;`,
      function(err, managerObj) {
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
  connection.query(
  `
  SELECT employee.id, first_name, last_name, title, salary, depart_name
  FROM employee
    LEFT JOIN role ON role_id = role.id
    LEFT JOIN department ON department_id  = department.id 
  ORDER BY department.depart_name;
  `, function(err, res) {
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
  LEFT JOIN employee m ON
   e.id = m.manager_id
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
  var roleList = [];
  var call = connection.query("SELECT * FROM employee;", function(err, manager) {
    if (err) throw err;
    for (var i = 0; i < manager.length; i++) {
    managerList.push(manager[i].first_name + " " + manager[i].last_name + " " + manager[i].manager_id);
    }
  var query = connection.query("SELECT * FROM role;", function(err, role) {
    if (err) throw err;
    for (var i = 0; i < role.length; i++) {
    roleList.push(role[i].title + " " + role[i].id);
    }
  
  inquirer.prompt([
    {
        type: "input",
        message: "Enter NEW employee FIRST name",
        name: "first_name"
    },
    {
      type: "input",
      message: "Enter NEW employee LAST name",
      name: "last_name"
    },
    {
      type: "list",
      message: "Which Departent does the new role fall within?",
      name: "id",
      choices: roleList
    },
    {
      type: "list",
      message: "Who is this employee's SUPERVISOR?",
      name: "mId",
      choices: managerList
    },
  ]) .then ((answers) => {
    var splitSTR = answers['id'].split(" ");            
    var splitSecondSTR = answers['mId'].split(" ");            
    connection.query(
      "INSERT employee SET ?",
      [
        {
          first_name: answers.first_name,
          last_name: answers.last_name,
          role_id: splitSTR[1],
          manager_id: splitSecondSTR[2]

        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log('New Employee Added');
        
        start();
        })
      })
    })
    })
}

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
  inquirer.prompt([
    {
    type: "list",
    message: "Would you like to UPDATE a manager or REMOVE a manager's privilages?",
    choices: ["UPDATE", "REMOVE"],
    name: "path",
    },
  ])
  .then((answer) => {
      if (answer.path === "UPDATE") {
        var managerList = [];
        var query = connection.query("SELECT * FROM employee;", function(err, man) {
        if (err) throw err;
        for (var i = 0; i < man.length; i++) {
        managerList.push(man[i].id + " " + man[i].first_name + " " + man[i].last_name + " " + man[i].manager_id);
        
        }
        inquirer.prompt([
          {
              type: "list",
              message: "Who do you want to ASSIGN as a manager?",
              name: "mId",
              choices: managerList
          },
          {
            type: "list",
            message: "Who is their SUBORDOINATE?",
            name: "sId",
            choices: managerList
        },
        ]) .then ((answers) => {
          var splitSTR = answers['mId'].split(" ");
          var splitSecondSTR = answers['sId'].split(" ");            
          connection.query(
            "UPDATE employee SET ? WHERE ?;",
            [
              {
                manager_id:splitSTR[3]
              },
              {
                id:splitSecondSTR[0]
              }
            ],
            function(err, newRole) {
              if (err) throw err;
              console.log('New Manager Assigned');
              start();
              })
            })
        })
      }  
      else {
        var managerList = [];
        connection.query("SELECT * FROM employee;", function(err, man) {
        if (err) throw err;
        for (var i = 0; i < man.length; i++) {
        managerList.push(man[i].id + " " + man[i].first_name + " " + man[i].last_name + " " + man[i].manager_id);
        }
        inquirer.prompt ([
          {
            type: "list",
            message: "Select the employee to REMOVE privlagies from",
            name: "demoted",
            choices: managerList
          },
        ])
        .then (function(res) {
          var splitSTR = res['demoted'].split(" ");            

          connection.query("UPDATE employee SET manager_id = NULL WHERE employee.id=" + splitSTR[0],
              function(err, res) {
              if (err) throw err;
              console.log( "Role was removed");
              start();
              });
            });
        }
      )
  }})};


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
      return roleObj
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
          return departmentObj;
        })
        ;
    }
 