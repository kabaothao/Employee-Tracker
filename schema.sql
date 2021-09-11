DROP DATABASE company;

CREATE DATABASE company;

USE company;

CREATE TABLE department (
    id INT PRIMARY KEY, 
    name VARCHAR(30) 
    );


CREATE TABLE role (
    id INT PRIMARY KEY, 
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
    );


CREATE TABLE employee (
    id INT PRIMARY KEY, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
    );

CREATE TABLE contact (
    


    );


INSERT INTO department
VALUES(0, 'Engineering'),
      (1, 'Finance'),
      (2, 'Legal'),
      (3, 'Sales');


INSERT INTO role
VALUES(1, 'Sales Lead', 100000, 3),
      (2, 'Salesperson', 80000, 3),
      (3, 'Lead Engineer', 150000, 0),
      (4, 'Software Engineer', 120000, 0),
      (5, 'Account Manager', 160000, 3),
      (6, 'Accountant', 125000, 3),
      (7, 'Legal Team Lead', 250000, 2),
      (8, 'Lawyer', 190000, 2);


INSERT INTO employee
VALUES(1, 'John', 'Doe', 1, null),
      (2, 'Mike', 'Chan', 2, 1),
      (3, 'Ashley', 'Rodriguez', 3, null),
      (4, 'Kevin', 'Tupik', 4, 3),
      (5, 'Kunal', 'Singh', 5, null),
      (6, 'Malia', 'Brown', 6, 5),
      (7, 'Sarah', 'Lourd', 7, null),
      (8, 'Tom', 'Allen', 8, 7);

SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e 
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON d.id = r.department_id
LEFT JOIN  employee m ON e.id = m.manager_id;



UPDATE employee
SET manager_id = NULL
WHERE manager_id = 2;

SELECT e.first_name, e.last_name, d.name as department, r.title, r.salary
FROM department d
LEFT JOIN role r ON  d.id = r.department_id
LEFT JOIN employee e ON r.id = e.role_id
LEFT JOIN employee m ON e.id =  m.manager_id
WHERE e.id = 9;


DELETE FROM employee 
WHERE id = 9;
