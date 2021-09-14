UPDATE employee
SET manager_id = NULL
WHERE manager_id = 2;

SELECT e.first_name, e.last_name, d.name as department, r.title, r.salary
FROM department d
LEFT JOIN role r ON  d.id = r.department_id
LEFT JOIN employee e ON r.id = e.role_id
LEFT JOIN employee m ON e.id =  m.manager_id
WHERE e.id = 9;

--Notes
DELETE FROM employee 
WHERE id = 9;

SELECT e.id, 
       e.first_name, 
       e.last_name,
       CONCAT (c.address, ' ', c.city, ', ', c.state, ', ', c.zip) AS address,
       c.email,
       c.phone,
       r.title, 
       d.name AS department, 
       r.salary, 
       CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e 
LEFT JOIN role r ON e.role_id = r.id
LEFT JOIN department d ON d.id = r.department_id
LEFT JOIN  employee m ON e.id = m.manager_id
LEFT JOIN contact c ON e.contact_id = c.id;