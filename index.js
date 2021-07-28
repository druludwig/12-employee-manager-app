const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const { exit } = require('process');


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'employees_db'
}
)

async function loadLists() {
    con.query("SELECT id, name FROM department", (err, res) => {
      if (err) throw err;
      deptList = res;
    })
    con.query("SELECT id, title as name FROM role", (err, res) => {
      if (err) throw err;
      roleList = res;
    })    
    con.query(`SELECT id, CONCAT(first_name, " ",last_name) AS name FROM employee`, (err, res) => {
      if (err) throw err;
      managerList = res;
    })
}

function welcome() {
console.log('-----------')
console.log('Welcome to Employee Tracker v0.9')
console.log('-----------')
main()
}

function main() {
    inquirer.prompt([
    {
    type: 'list',
    choices: [  "View ALL Employees",
                "View ALL Departments",
                "View ALL Roles",
                new inquirer.Separator(),
                "Add NEW Employee",
                "Add NEW Department",
                "Add NEW Role",
                new inquirer.Separator(),
                "UPDATE Employee Role",
                new inquirer.Separator(),
                "Exit"],
    name: 'menuChoice',
    message: 'Select Task:',
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
            case "Add NEW Employee":
                newEmployee();
            break;
            case "Add NEW Department":
                newDepartment();
            break;
            case "Add NEW Role":
                newRole();
            break;
            case "UPDATE Employee Role":
                updateRole();
            break;
            case "Exit":
                exit();
            default:
                console.log('The program closed. Please restart.');
            break;
    }})
}

async function viewEmployees() {
    con.promise().query("SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ' ,m.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id;")
    .then( ([rows,fields]) => {
        console.log('\n\n\n---------- ALL Employees ----------');
        console.table(rows);
        console.log('Press up/down key to continue.')
    })
    .catch(console.log);

main()
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

function displayRoles() {
    con.promise().query("SELECT role.title AS Title, role.id AS ID, role.salary AS Salary,department.name AS Department FROM department JOIN role ON department.id = department_id;")
    .then( ([rows,fields]) => {
        console.log('\n\n\n---------- ALL Roles ----------');
        console.table(rows);
    })
    .catch(console.log)
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
    let dept = [];
    for (i = 0; i < deptList.length; i++) {
        dept.push( Object(deptList[i]) );
    };

    inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "Enter NAME of new role:"
        },
        {
          name: "salary",
          type: "input",
          message: "Enter SALARY for new role (e.g. 50000):"
        },
        {
          name: "department_id",
          type: "list",
          message: "Select a department:",
          choices: dept
        }])
    
    .then(function(response) {
        for (i = 0; i < dept.length; i++) {
          if (dept[i].name == response.department_id) {
            department_id = dept[i].id
          }
        }
        con.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}', '${response.salary}', ${department_id})`, (err, res) => {
          if (err) throw err;
          console.log('---------\n')
          console.log(`SUCCESS: "${response.title}" added to list of roles.`);
          console.log('\n---------')
          main()
          
            })
        })
       
    
}

async function newEmployee() {
    let role = [];
for (i = 0; i < roleList.length; i++) {
    role.push( Object(roleList[i]) );
};

let manager = [];
for (i = 0; i < managerList.length; i++) {
    manager.push( Object(managerList[i]) );
};

inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Enter FIRST NAME of new employee:"
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter LAST NAME of new employee:"
    },
    {
      name: "role_id",
      type: "list",
      message: "Select a role:",
      choices: role
    },
    {
      name: "manager_id",
      type: "list",
      message: "Select a manager:",
      choices: manager
    }
])

.then(function(response) {
    for (i = 0; i < role.length; i++) {
      if (role[i].name == response.role_id) {
        role_id = role[i].id
      }
    }
    for (i = 0; i < manager.length; i++) {
        if (manager[i].name == response.manager_id) {
          manager_id = manager[i].id
        }
    }
    con.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.first_name}', '${response.last_name}', ${role_id}, ${manager_id})`, (err, res) => {
      if (err) throw err;
      console.log('---------\n')
      console.log(`SUCCESS: ${response.last_name}, ${response.first_name} added to employee database.`);
      console.log('\n---------')
      main()
      
        })
    })
   
}

async function updateRole() {
    displayRoles();
    con.query("SELECT * FROM employee", async (err, employee) => {
    const {person,role} = await inquirer.prompt([{
        type: "list",
        message: "Choose an employee to update:",
        name: "person",
        choices: () => {
            return employee.map((employee) => employee.last_name);
        },
    },
    {
        type: "input",
        message: "What is this employee's new role ID?",
        name: "role",
        
    }
]);
    con.query(
    "UPDATE employee SET ? WHERE ?",
    [{
            role_id: role,
        },
        {
            last_name: person,
        },
    ],
    function (err, res) {
        if (err) throw err;
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        viewEmployees();
    }
    );
    });
}
        
loadLists()
welcome()

