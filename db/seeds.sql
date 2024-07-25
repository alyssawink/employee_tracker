INSERT INTO
    departments (name)
VALUES
    ('Monarchy'),
    ('Gentry'),
    ('Clergy'),
    ('Merchants'),
    ('Vassals');

INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('King', 600000, 1),
    ('Duke', 450000, 1),
    ('Bishop', 130000, 1),
    ('Chancellor', 103000, 5),
    ('Constable', 100000, 2),
    ('Knights', 120000, 2),
    ('Soldiers', 92000, 3),
    ('Squires', 810000, 3),
    ('Traders', 86000, 3),
    ('Laborers', 83000, 3),
    ('Farmers', 80000, 3),
    ('Freemen', 76000, 3),
    ('Serfs', 50000, 3);

INSERT INTO
    employees (
        first_name,
        last_name,
        role_id,
        manager_id,
        is_manager
    )
VALUES
    ('Targaryen', 'Rhaenyra', 1, NULL, true),
    ('Targaryen', 'Daemon', 2, 1, false),
    ('Stark', 'Robb', 3, 2, false),
    ('Targaryen', 'Aemond', 4, 1, false),
    ('Hightower', 'Alicent', 5, 4, false),
    ('Stark', 'Arya', 6, 5, false),
    ('Targaryen', 'Daenerys', 7, 1, false),
    ('Lannister', 'Tyrion', 8, 7, false),
    ('Targaryen', 'Helaena', 9, 8, false),
    ('Targaryen', 'Rhaenys', 10, 1, false),
    ('Stark', 'Ned', 11, 6, false),
    ('Velaryon', 'Jaecerys', 12, 6, false),
    ('Velaryon', 'Corlys', 13, 12, false);

SELECT
    *
FROM
    employees;

SELECT
    *
FROM
    employees
WHERE
    is_manager = true;

SELECT
    e.first_name AS employee_name,
    m.first_name AS manager_name
FROM
    employees e
    LEFT JOIN employees m ON e.manager_id = m.id;