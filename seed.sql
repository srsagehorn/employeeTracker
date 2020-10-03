DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
	REFERENCES department(id)
	ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    department_id INT,
    FOREIGN KEY (role_id)
	REFERENCES role(id)
	ON DELETE CASCADE
);

USE employee_db;

--departments table

INSERT INTO department (name)
VALUES ("Design");

INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO department (name)
VALUES ("Software Development");

-- roles table

INSERT INTO role (title, salary, department_id)
VALUES ("Video Animator", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Graphic Designer", 35000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Tax Accountant", 80000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("CFO", 130000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Specialist", 60000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Generalist", 50000, 3);

INSERT INTO role ( title, salary, department_id)
VALUES ("Junior Enginner", 85000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 120000, 4);

-- employees table

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jackie", "Kerry", 3, null);

INSERT INTO employee ( first_name, last_name, role_id, manager_id)
VALUES ("Carson", "Knox", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Justin", "Krivda", 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Agustus", "Mosse", 4, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leslie", "Sawyer", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christina", "Lynch", 6, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Campos", 7, 3);