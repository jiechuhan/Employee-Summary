inquirer
    .prompt(questionEm)
    .then(function ({ name, email, id, officeNum, role }) {

        const manager = new Manager(name, email, id, officeNum)
        console.log(manager.getEmail())

        switch (role) {
            case "Engineer":
                inquirer
                    .prompt(questionEn)
                    .then(function ({ Ename, Eemail, Eid, username }) {
                        const engineer = new Engineer(Ename, Eemail, Eid, username)
                        console.log(engineer.getGithub())
                    });
                break;
            case "Intern":
                inquirer
                    .prompt(questionIn)
                    .then(function ({ Iname, Iemail, Iid, school }) {
                        const intern = new Intern(Iname, Iemail, Iid, school)
                        console.log(intern.getSchool())
                    });
                break;
            case "I don't want to add anymore":
                return;
        }
    });