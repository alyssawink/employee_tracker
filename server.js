const { Pool } = require("pg");
const inquirer = require("inquirer");
const cTable = require("console.table");
const cfonts = require("cfonts");

require("dotenv").config();

// Create a PostgreSQL pool with connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee_tracker",
  password: "G0j069",
  port: process.env.DB_PORT || 5432,
});

pool.connect(function(err){
  console.log("CONNECTED!!!!")
  
  if(err) throw err
})

// Function to start the application of CFONT
cfonts.say("\nSQL Employee Tracker", {
  font: "block",
  align: "left",
  colors: ["blue"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: false,
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});

// Function to handle user interaction
function selectQuestion() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do today?",
        name: "queryOptions",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add New Department",
          "Add New Role",
          "Add New Employee",
          "Update Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.queryOptions) {
        case "View All Departments":
          manageDepartments();
          break;
        case "View All Roles":
          manageRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add New Department":
          addNewDepartment();
          break;
        case "Add New Role":
          addNewRole();
          break;
        case "Add New Employee":
          addNewEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Quit":
          exitApp();
          break;
      }
    });
}

// Function to handle viewing all departments
async function manageDepartments() {
  const res = await pool.query(
    "SELECT * FROM departments ORDER BY id"
  );
  console.log("\n");
  console.table(res.rows);
  // pool.query("SELECT * FROM departments", (err, res)=>{
  //   if (err) throw err
  //   console.table(res.rows)
  // })
  selectQuestion();
}

async function manageRoles() {
  const res = await pool.query("SELECT * FROM roles");
  console.log("\n");
  console.table(res.rows);
  selectQuestion();
}

async function viewEmployees() {
  const res = await pool.query("SELECT * FROM employees");
  console.log("\n");
  console.table(res.rows);
  selectQuestion();
}


async function addNewDepartment() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department you would like to add?",
      name: "addDepartment",
    },
  ]);

  await pool.query("INSERT INTO departments (name) VALUES ($1)", [
    answer.addDepartment,
  ]);
  console.log("\nNew department added successfully!\n");
  selectQuestion();
}

async function addNewRole() {
  const departments = await pool.query("SELECT * FROM departments");
  const departmentChoices = departments.rows.map((dept) => ({
    name: dept.name,
    value: dept.department_id,
  }));

  const answer = await inquirer.prompt([
    {
      type: "input",
      message: "What is the title of the role you would like to add?",
      name: "title",
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "salary",
    },
    {
      type: "list",
      message: "Select the department for this role:",
      name: "department_id",
      choices: departmentChoices,
    },
  ]);

  await pool.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
    [answer.title, answer.salary, answer.department_id]
  );

  console.log("\nNew role added successfully!\n");
  selectQuestion();
}

async function addNewEmployee() {
  try {
    const results = await pool.query("SELECT id, title FROM roles");
    const roles = results.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const employees = await pool.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees"
    );
    const managers = employees.rows.map(({ id, name }) => ({
      name,
      value: id,
    }));

    

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the employee role:",
        choices: [...roles],
      },
      {
        type: "list",
        name: "managerId",
        message: "Select the employee manager:",
        choices: [...managers],
      },
      {
        type: "list",
        name: "isManager",
        message: "Is this the manager?",
        choices: ["true", "false"],
      },
    ]);

    const sql =
      "INSERT INTO employees (first_name, last_name, role_id, manager_id, is_manager) VALUES ($1, $2, $3, $4, $5)";
    const values = [
      answers.firstName,
      answers.lastName,
      answers.roleId,
      answers.managerId,
      answers.isManager
    ];
    await pool.query(sql, values);

    console.log("Employee added successfully");
    selectQuestion(); // Return to main menu
  } catch (error) {
    console.error("Error adding employee:", error.message);
  }
}

async function updateEmployeeRole() {
  const answer = await inquirer.prompt([
    {
      type: "input",
      message: "Which employee ID would you like to update the role for?",
      name: "employee_id",
    },
    {
      type: "input",
      message: "What is the new role ID for this employee?",
      name: "role_id",
    },
  ]);

  await pool.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
    answer.role_id,
    answer.employee_id,
  ]);
  console.log("\nEmployee role updated successfully!\n");
  selectQuestion();
}

function exitApp() {
  pool.end();
  console.log("\nExiting Employee Tracker...");
  process.exit(0);
}

selectQuestion();