INSERT INTO department(name)
VALUES ("Sales"), ("Human Resources"), ("Accounting"), ("Managment"), ("Warehouse");

INSERT INTO role(title, salary, department_id)
VALUES ("Sales Person", 60000, 1), ("HR Rep", 80000, 2), ("Accountant", 90000, 3), ("Manager", 90000, 4), ("Foreman", 70000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jim", "Halpert", 1), ("Toby", "Flenderson", 2)
