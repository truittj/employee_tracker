const inquirer = require ("inquirer");
const mysql = require ("mysql");
const header = require("./Assets/opening.js");

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

function startTable(){

  start();
};


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

      case "exit":
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
        console.log(employeeObj);
        //return employeeObj;
        start();
    })
    
};

function departSearch(){
  console.log('view all emplyees by department');
  start();
};

function byManager() {
  console.log('View all employees by manager');
  start();
};

function adder() {
  console.log('Add Employee');
  start();
};

function remover() {
  console.log('Remove Employee');
  start();
  };

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
          console.log(roleObj);
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
                departmentElm.name = res[i].name;
                
                departmentObj.push(departmentElm);
            }
            console.log(departmentObj);
            //return departmentObj;
            start()
        })
        ;
    }


//  