USE employee_tracker_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jon", "Doe", 1, 3)
, ("Mike", "Chan", 2, 1)
, ("Ashley", "Rodriguez", 3, null)
, ("Kevin", "Tupik", 4, 3)
, ("Malia", "Brown", 5, null)
, ("Sarah", "Lourd", 6, null)
, ("Tom", "Allen", 7, 6)
, ("Christian", "Eckenrode", 3, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1)
, ("Salesperson", 80000, 2)
, ("Lead Engineer", 150000, 3)
, ("Software Engineer", 120000, 4)
, ("Accountant", 125000, 5)
, ("Legal Team Lead", 250000, 6)
, ("Lawyer", 190000, 7);

INSERT INTO department (name)
VALUES ("Sales")
, ("Engineering")
, ("Finance")
, ("Leagl");

