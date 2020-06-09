const inquirer = require ("inquirer");
const mysql = require ("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "8675309aA",
    database: "employee_tracker_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    //start();
  });
readTables();
addElem();

  function readTables() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  }

  function addElem() {
    var query = connection.query(
      "INSERT INTO role SET ?",
      {
        title: "test",
        salary: 3.0,
        department_id: 50,
        
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " product inserted!\n");
        // Call updateProduct AFTER the INSERT completes
       
        console.log(query.sql);
        //connection.end();
        //readItems();

      }
    );
    };

