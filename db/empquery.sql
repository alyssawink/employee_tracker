CREATE TABLE
    IF NOT EXISTS department (
        department_id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS role (
        role_id SERIAL PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        salary DECIMAL(10,2) NOT NULL,
        department_id INT REFERENCES department (department_id)
    );

CREATE TABLE
    IF NOT EXISTS employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT REFERENCES role (role_id),
        manager_id INT REFERENCES employee (id)
    );