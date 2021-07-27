-- WHEN I choose to view all employees
-- THEN I am presented with a formatted table showing employee data, including employee ids,
-- first names, last names, job titles, departments, salaries, and managers that the
-- employees report to

USE employees_db;

SELECT employee.id AS ID, employee.first_name AS First, employee.last_name AS Last, role.title AS Title, 
department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ' ,m.last_name) AS Manager
FROM employee 
LEFT JOIN role ON employee.role_id = role.id 
LEFT JOIN department on role.department_id = department.id
LEFT JOIN employee m on employee.manager_id = m.id;


