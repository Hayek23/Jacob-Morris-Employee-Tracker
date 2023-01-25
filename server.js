const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'burn',
        database: 'employees_db'
    },
    console.log('Connected to the employee database.')
);

const promptUser = () =>
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select an option.',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                "Add department",
                'Add role',
                'Add employee',
                'Update employee role',
                'Quit'
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;

            if(choices === 'View all departments'){
                db.query('select * from department;', function (err, res){
                    console.table(res)
                    promptUser()
                })
            }
            if(choices === 'View all roles'){
                db.query('select * from role;', function (err, res) {
                    console.table(res)
                    promptUser()
                });
            }
            if(choices === 'View all employees'){
                db.query('select * from employee;', function (err, res){
                    console.table(res)
                    promptUser()
                });
            }
            if(choices === 'Add department'){
                addDeparment();
            }
            if(choices === 'Add role'){
                addRole();
            }
            if(choices === 'Add employee'){
                addEmployee();
            }
            if(choices === 'Update employee role'){
                updateEmployeeRole();
            }
            if(choices === 'quit'){
                return;
            }
    })

    const addDeparment = () => {
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What is the name of this department?'
            }
        ])
        .then((answers) => {
            db.query(`INSERT INTO department(name) VALUES ("${answers.departmentName}");`, function (err, res){
                console.log(res)
            })
        })
        .then(() => {
            return promptUser();
        })
    }
    const addRole = () => {
        db.query('SELECT * FROM department', function (err, res){
            console.log(res)
          let departments = res;
          const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
          }))
        
          

          console.log()
        inquirer.prompt([
            {
                name:'title',
                type: 'input',
                message: 'What is the title of this role?'
            },
            {
                name:'roleDeparment',
                type: 'list',
                message: 'What department does this role belong to?',
                choices: departmentChoices
                
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role'
            }
        ])
        .then((answers) => {
            const answerArray = [answers.title, answers.salary, answers.roleDepartment]

            let role = answerArray[0]
            answerArray[1] = salary
            answerArray[2] = roleDepartment

            const sql = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`

                db.query(sql, role, function (err, res){
                    console.table(res)
                })
            }
        )
        .then(() => {
            return promptUser();
        })
    })};

    const addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of this employee?',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of this employee?',
            }
        ])
        .then(answers => {
            const answerArray = [answers.firstName, answers.lastName]

            const roleMysql = 'SELECT role.id, role.title FROM role';

            db.query(roleMysql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({id, title}) => ({
                    name: title,
                    value: id
                }))

                inquirer.prompt([
                    {
                        type: 'list',
                        message: 'What is the role of this employee?',
                        name: 'role',
                        choices: roles
                    }
                ])
                .then(roleAnswer => {
                    const role = roleAnswer.role;
                    answerArray.push(role)

                    const sql = `insert into employee (first_name, last_name, role_id) values (?, ?, ?)`;

                    db.query(sql, answerArray, (err, res) => {
                        console.table(res)
                    return promptUser();
                    })
                })
            })
        })
    }

    const updateEmployeeRole = () => {
        db.query('SELECT * FROM employee', function (err, res){
            console.log(res)
            
            let employees = res;
            const employeeChoices = employees.map(({id, last_name}) => ({
                name: last_name,
                value: id
            }))

            inquirer.prompt([
                {
                    type: 'list',
                    message: 'Which employee would you like to change?',
                    name: 'employee',
                    choices: employeeChoices
                }
            ])

            .then(answers => {
                const answersArray = [answers.employee];

                db.query('select * from role', function (err, res){
                    console.log(res)

                    let roles = res;
                    const roleChoices = roles.map(({id, title}) => ({
                        name: title,
                        value: id
                    }))
                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'What role would you like to change this employee to?',
                            name: 'role',
                            choices: roleChoices
                        }
                    ])
                    .then(answer => {
                        const role = answer.role;
                        answersArray.push(role);

                        let employee = answersArray[0]
                        answersArray[0] = role
                        answersArray[1] = employee

                        const sql = `update employee set role_id = ? where id = ?`;

                        db.query(sql, answersArray, (err, res) => {
                            console.table(res)
                            return promptUser();
                        })
                    })
                })
            })
        })
    }

    promptUser();
