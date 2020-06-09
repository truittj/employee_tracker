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
    console.log(header)
    // run the start function after the connection is made to prompt the user
     
    
    //callEmployeeTable();
     
     //callDepartmentTable();
     
     //callRoleTable();
    //console.log("Success");
});


  






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
        //console.log(employeeObj);
        return employeeObj;
    })
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
        })
    }


//   function start() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "list",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID", "EXIT"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid === "POST") {
//           postAuction();
//         }
//         else if(answer.postOrBid === "BID") {
//           bidAuction();
//         } else{
//           connection.end();
//         }
//       });
//   }

// readTables();
// addElem();

//   function readTables() {
//     connection.query("SELECT * FROM role", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.log(res);
//       connection.end();
//     });
//   }

//   function addElem() {
//     var query = connection.query(
//       "INSERT INTO role SET ?",
//       {
//         title: "test",
//         salary: 3.0,
//         department_id: 50,
        
//       },
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " product inserted!\n");
//         // Call updateProduct AFTER the INSERT completes
       
//         console.log(query.sql);
//         //connection.end();
//         //readItems();

//       }
//     );
//     };

