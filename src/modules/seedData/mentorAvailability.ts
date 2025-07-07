import { create } from "../../../helper/mongooseQuery";
import AvailabilitySchema from "../../models/availability";


const availabilityDataBase = async function () {

  const details = {
    mentorId: "68672eb716243a85ccf39d26",
    date: "2025-07-15",
    startTime: "05:10am",
    endTime: "05:10pm",
  };

  const createdUser = await create(AvailabilitySchema, details);
  console.log(`created profiles into the database.`);
};

async function availabilitymentorInfoIntoDataBase() {
  for (let x = 1; x > 0; x--) {
    availabilityDataBase();
  }
}

export default availabilitymentorInfoIntoDataBase;