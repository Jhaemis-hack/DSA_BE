import { create, getByEmail } from "../../../helper/mongooseQuery";
import mentorProfiles from "../../models/mentorProfile";
import User from "../../models/user";


const skillIndustryMap = {
  skill: [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    ["UX Designer", "Interaction Designer", "Visual Designer"],
    ["Cloud Engineer", "DevOps Engineer", "Infrastructure Architect"],
    ["Marketing Strategist", "Brand Manager", "Media Planner"],
    ["Frontend Engineer", "UI Developer", "Web Animator"],
    ["Blockchain Developer", "Smart Contract Engineer", "Web3 Architect"],
    ["Biomedical Engineer", "Clinical Data Analyst", "Medical Device Technician"],
    ["Content Writer", "Copywriter", "Technical Writer"],
    ["Supply Chain Analyst", "Logistics Coordinator", "Procurement Officer"],
    ["Game Developer", "3D Modeler", "Game Tester"],
    ["Environmental Consultant", "Sustainability Analyst", "Energy Auditor"]
  ],
  industry: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Design & Creative Technology",
    "Cloud Computing & IT Infrastructure",
    "Advertising & Digital Marketing",
    "Web Development & Interface Design",
    "Decentralized Finance & Blockchain Technology",
    "Healthcare Technology & Bioengineering",
    "Publishing & Content Creation",
    "Logistics & Supply Chain Management",
    "Video Game Design & Development",
    "Environmental Science & Renewable Energy"
  ]
};

const mentorProfileData = async function (idx: number) {
  const userId = (await getByEmail(User, `mentor${idx}@gmail.com`))._id;

  const details = {
    mentorId: userId,
    name: `mentor${idx}`,
    skill: skillIndustryMap.skill ? skillIndustryMap.skill[idx] : "",
    industry: skillIndustryMap.industry ? skillIndustryMap.industry[idx] : "",
  };

  const createdUser = await create(mentorProfiles, details);
  console.log(`created ${idx} mentor profiles into the database.`);
};

async function seedMentorProfileIntoDataBase() {
  for (let x = 25; x > 15; x--) {
    mentorProfileData(x);
  }
}

export default seedMentorProfileIntoDataBase;