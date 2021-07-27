const inquirer = require('inquirer');
const mysql = require('mysql2');
const { exit } = require('process');
const cTable = require('console.table');

// connect to the database
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees_db'
});

function main() {
console.log('-----------')
inquirer.prompt([
    {
    type: 'list',
    choices: [  "View ALL Employees",
                "View ALL Departments",
                "View ALL Roles",
                new inquirer.Separator(),
                "UPDATE Employee Role",
                new inquirer.Separator(),
                "Add NEW Employee",
                "Add NEW Department",
                "Add NEW Role",
                new inquirer.Separator(),
                "Exit"],
    name: 'menuChoice',
    message: 'What would you like to do?',
    pageSize: 12,
    }])

    .then((choice)=> {
        switch (choice.menuChoice) {
            case "View ALL Employees":
                viewEmployees();
            break;
            case "View ALL Departments":
                viewDepartments();
            break;
            case "View ALL Roles":
                viewRoles();
            break;
            case "UPDATE Employee Role":
                updateEmployee();
            break;
            case "Add NEW Employee":
                newEmployee();
            break;
            case "Add NEW Department":
                newDepartment();
            break;
            case "Add NEW Role":
                newRole();
            break;
            case "Exit":
                exit();
            default:
                console.log('The program closed. Please restart.');
            break;
    }})
}

function viewDepartments() {
    con.promise().query("SELECT * FROM department;")
    .then( ([rows,fields]) => {
        console.log('\n\n\n---------- ALL Departments ----------');
        console.table(rows);
        console.log('Press up/down key to continue.')
    })
    .catch(console.log);

main()
}

function viewRoles() {
    con.promise().query("SELECT role.title AS Title, role.id AS ID, role.salary AS Salary,department.name AS Department FROM department JOIN role ON department.id = department_id;")
    .then( ([rows,fields]) => {
        console.log('\n\n\n---------- ALL Roles ----------');
        console.table(rows);
        console.log('Press up/down key to continue.')
    })
    .catch(console.log)

main()
}

function viewEmployees() {
    con.promise().query("SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ' ,m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id;")
    .then( ([rows,fields]) => {
        console.log('\n\n\n---------- ALL Employees ----------');
        console.table(rows);
        console.log('Press up/down key to continue.')
    })
    .catch(console.log);

main()
}


// function updateEmployee()
// function newEmployee()
// function newDepartment()
// function newRole()


main();













// simple query
// connection.query(
//   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );
 