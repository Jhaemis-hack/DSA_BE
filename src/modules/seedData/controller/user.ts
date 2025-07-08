import bcrypt from "bcrypt";
import { create } from "../../../../helper/mongooseQuery";
import User from "../../../models/user";
import { Request, Response } from "express";

export const seedMenteeData =async (req: Request, res: Response) => {
  await seedUserIntoDataBase(userMenteeData, 0, 20);
};

export const seedMentorData =async (req: Request, res: Response) => {
 await seedUserIntoDataBase(userMentorData, 0, 20);
};

export const seedAdminData =async (req: Request, res: Response) => {
  await seedUserIntoDataBase(userAdminData, 0, 5);
};

// role: mentee
async function userMenteeData(idx: number) {
  const hashedPassword = await bcrypt.hash(`userspassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `user${idx}@gmail.com`,
    password: hashedPassword,
  });
  console.log(`seeded ${idx} into the database.`);
}

// role: mentor
async function userMentorData(idx: number) {
  const hashedPassword = await bcrypt.hash(`mentorspassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `mentor${idx}@gmail.com`,
    password: hashedPassword,
    role: "mentor",
  });
  console.log(`seeded ${idx} into the database.`);
}

// role: mentor
async function userAdminData(idx: number) {
  const hashedPassword = await bcrypt.hash(`adminpassword${idx}`, 10);

  const createdUser = await create(User, {
    email: `admin${idx}@gmail.com`,
    password: hashedPassword,
    role: "admin",
  });
  console.log(`seeded admin no. ${idx} into the database.`);
}

async function seedUserIntoDataBase(
  param: (x: any) => void,
  min: number,
  max: number
) {
  for (let x = max; x > min; x--) {
    param(x);
  }
}

