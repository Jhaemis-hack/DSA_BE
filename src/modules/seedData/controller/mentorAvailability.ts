import { Request, Response } from "express";
import { create, getByEmail } from "../../../../helper/mongooseQuery";
import AvailabilitySchema from "../../../models/availability";
import User from "../../../models/user";

export const seedMentorAvailabilityData = async (
  req: Request,
  res: Response
) => {
  await availabilitymentorInfoIntoDataBase(availabilityDataBase, 0, 20);
};

const availabilityDataBase = async function (idx: number) {
  const userId = (await getByEmail(User, `mentor${idx}@gmail.com`))._id;

  const details = {
    mentorId: userId,
    date: "tuesday",
    startTime: "10:00am",
    endTime: "05:10pm",
  };

  const createdUser = await create(AvailabilitySchema, details);
  console.log(`created profiles into the database.`);
};

async function availabilitymentorInfoIntoDataBase(
  param: (x: any) => void,
  min: number,
  max: number
) {
  for (let x = max; x > min; x--) {
    param(x);
  }
}
