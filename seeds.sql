USE employees_db;

INSERT INTO department (id,name)
VALUES (001,"Marketing"),
       (002,"Finance"),
       (003,"Operations"),
       (004,"Human Resources"),
       (005,"IT");

INSERT INTO role (id,title,salary,department_id)
VALUES (001,"Developer",60000,005),
       (002,"Product Manager",80000,001),
       (003,"Customer Service",45000,003),
       (004,"Recruiter",70000,004),
       (005,"Assistant",50000,003);

INSERT INTO employee (id,first_name,last_name,role_id,manager_id)
VALUES (001,"Sherlock","Holmes",002,null),
       (002,"John","Watson",005,001);
     