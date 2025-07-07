import bcrypt from "bcrypt";
import { create } from "../../../helper/mongooseQuery";
import User from "../../models/user";


// role: mentee
const userMenteeData = async function (idx: number) {

  const hashedPassword = await bcrypt.hash(`userspassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `user${idx}@gmail.com`,
    password: hashedPassword,
  });
  console.log(`seeded ${idx} into the database.`);
};

// role: mentor
const userMentorData = async function (idx: number) {

  const hashedPassword = await bcrypt.hash(`mentorspassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `mentor${idx}@gmail.com`,
    password: hashedPassword,
    role: "mentor"
  });
  console.log(`seeded ${idx} into the database.`);
};

// role: mentor
const userAdminData = async function (idx: number) {

  const hashedPassword = await bcrypt.hash(`adminpassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `admin${idx}@gmail.com`,
    password: hashedPassword,
    role: "admin"
  });
  console.log(`seeded admin no. ${idx} into the database.`);
};


async function seedUserIntoDataBase (){
    for (let x = 5; x > 0; x--) {
        userAdminData(x)
    }
}

export default seedUserIntoDataBase;
