import { Request, Response } from "express";
import { create, getByEmail } from "../../../../helper/mongooseQuery";
import mentorProfiles from "../../../models/mentorProfile";
import User from "../../../models/user";

export const seedMentorProfileData =async (req:Request, res: Response)=>{
  await seedMentorProfileIntoDataBase(mentorProfileData, 0, 20 )
}

const skillIndustryMap = {
  skill: [
    ["UX Designer", "Interaction Designer", "Visual Designer"],
    ["Cloud Engineer", "DevOps Engineer", "Infrastructure Architect"],
    ["Marketing Strategist", "Brand Manager", "Media Planner"],
    ["Frontend Engineer", "UI Developer", "Web Animator"],
    ["Blockchain Developer", "Smart Contract Engineer", "Web3 Architect"],
    ["Biomedical Engineer", "Clinical Data Analyst", "Medical Device Technician"],
    ["Content Writer", "Copywriter", "Technical Writer"],
    ["Supply Chain Analyst", "Logistics Coordinator", "Procurement Officer"],
    ["Game Developer", "3D Modeler", "Game Tester"],
    ["Environmental Consultant", "Sustainability Analyst", "Energy Auditor"],
    // 11–20:
    ["Data Scientist", "Machine Learning Engineer", "Data Analyst"],
    ["Security Analyst", "Penetration Tester", "Security Architect"],
    ["Instructional Designer", "E‑Learning Developer", "Curriculum Specialist"],
    ["Financial Analyst", "Investment Banker", "Risk Manager"],
    ["Talent Acquisition Specialist", "HR Manager", "Compensation Analyst"],
    ["Legal Researcher", "Compliance Officer", "Contract Manager"],
    ["Production Engineer", "Quality Control Inspector", "Process Engineer"],
    ["E‑commerce Manager", "Digital Merchandiser", "Retail UX Specialist"],
    ["AI Researcher", "NLP Engineer", "Computer Vision Engineer"],
    ["Mobile App Developer", "Android Developer", "iOS Developer"]
  ],
  industry: [
    "Design & Creative Technology",
    "Cloud Computing & IT Infrastructure",
    "Advertising & Digital Marketing",
    "Web Development & Interface Design",
    "Decentralized Finance & Blockchain Technology",
    "Healthcare Technology & Bioengineering",
    "Publishing & Content Creation",
    "Logistics & Supply Chain Management",
    "Video Game Design & Development",
    "Environmental Science & Renewable Energy",
    // 11–20:
    "Data Science & Analytics",
    "Cybersecurity & Risk Management",
    "Education Technology & e‑Learning",
    "Finance & Investment Banking",
    "Human Resources & Organizational Development",
    "Legal & Compliance Technology",
    "Manufacturing & Industrial Engineering",
    "E‑commerce & Retail Technology",
    "Artificial Intelligence & Machine Learning",
    "Mobile Development & App Ecosystems"
  ]
};


async function mentorProfileData (idx: number) {
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

async function seedMentorProfileIntoDataBase(
  param: (x: any) => void,
  min: number,
  max: number
) {
   for (let x = max; x > min; x--) {
    param(x);
  }
}
