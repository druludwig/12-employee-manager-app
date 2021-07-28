const inquirer = require('inquirer');
const mysql = require('mysql2');
const { exit } = require('process');
const cTable = require('console.table');
const { v4: uuidv4 } = require('uuid');


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
    con.promise().query("SELECT id AS ID, name AS Name FROM department;")
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


    
async function newDepartment() {
    const response = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter NAME of new department:',
        }])
    con.query("INSERT INTO department SET ?", {
        name: response.name},
        function (err) {
            if (err) throw err;
            console.log('---------\n')
            console.log(`SUCCESS: "${response.name}" added to department list.`);
            console.log('\n---------')
            main();
        }
    );
}

async function newRole(){
    const response = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter NAME of new role:'
        },{
            type: 'input',
            name: 'salary',
            message: 'Enter SALARY of new role (e.g. 50000):'
        },{
            type: 'input',
            name: 'newDeptName',
            message: 'Enter NAME of new department:',            
        }
    ])
    con.query("INSERT INTO department SET ?", {
        name: response.newDeptName},
        function (err) {
            if (err) throw err;
            console.log('---------\n')
            console.log(`SUCCESS: "${response.newDeptName}" added to department list.`);
            console.log('\n---------')
            main();
        }
    );
}



// function newEmployee()



// function updateEmployee()

main();

