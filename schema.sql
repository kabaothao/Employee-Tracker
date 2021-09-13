DROP DATABASE company;

CREATE DATABASE company;

USE company;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(30) 
    );


CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
    );


CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    contact_id INT
    );

CREATE TABLE contact (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip INT,
    phone BIGINT,
    email VARCHAR(255)
    );

INSERT INTO contact (address, city, state, zip, phone, email)
VALUES ('1800 Graham Ave W', 'Saint Paul', 'MN', 55117, 6122229432, 'jdoe@gmail.com'),
       ('1834 Wheelock Parkway', 'Saint Paul', 'MN', 55117, 6129902323, 'mchan@gmail.com');


INSERT INTO department (name)
VALUES('Engineering'),
      ('Finance'),
      ('Legal'),
      ('Sales');


INSERT INTO role (title, salary, department_id)
VALUES('Sales Lead', 100000, 3),
      ('Salesperson', 80000, 3),
      ('Lead Engineer', 150000, 0),
      ('Software Engineer', 120000, 0),
      ('Account Manager', 160000, 3),
      ('Accountant', 125000, 3),
      ('Legal Team Lead', 250000, 2),
      ('Lawyer', 190000, 2);


INSERT INTO employee (first_name, last_name, role_id, manager_id, contact_id)
VALUES('John', 'Doe', 1, NULL, 1),
      ('Mike', 'Chan', 2, 1, 2),
      ('Ashley', 'Rodriguez', 3, NULL, NULL),
      ('Kevin', 'Tupik', 4, 3, NULL),
      ('Kunal', 'Singh', 5, NULL, NULL),
      ('Malia', 'Brown', 6, 5, NULL),
      ('Sarah', 'Lourd', 7, NULL, NULL),
      ('Tom', 'Allen', 8, 7, NULL);


SELECT CONCAT(e.first_name, ' ', e.last_name) AS name,
       d.name AS department,
       r.title,
       r.salary,
       CONCAT(m.first_name, ' ', m.last_name) AS manager,
       CONCAT (c.address, ', ', c.city, ', ', c.state, ', ', c.zip) AS address,
       c.phone,
       c.email
FROM employee e
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN employee m ON m.manager_id = e.id
LEFT JOIN contact c ON c.id = e.contact_id
LEFT JOIN department d ON r.department_id = d.id;