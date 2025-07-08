import bcrypt from "bcrypt";
import { create, getByEmail } from "../../../../helper/mongooseQuery";
import User from "../../../models/user";
import Profiles from "../../../models/profile";
import { Request, Response } from "express";

export const seedMenteeProfileData = async (req: Request, res: Response)=> {
 await seedMenteeProfileIntoDataBase(menteeProfileData, 0, 20)
}

const skillGoalMap = {
  skill: [
    ["Frontend Developer", "React Engineer", "UI/UX Designer"],
    ["Backend Developer", "Node.js Engineer", "API Designer"],
    ["Data Scientist", "ML Engineer", "Data Analyst"],
    ["Project Manager", "Scrum Master", "Agile Coach"],
    ["Digital Marketer", "SEO Specialist", "Content Strategist"],
    ["DevOps Engineer", "Site Reliability Engineer", "Cloud Architect"],
    ["Cybersecurity Analyst", "Ethical Hacker", "Security Consultant"],
    ["Mobile App Developer", "iOS Engineer", "Android Developer"],
    ["Graphic Designer", "Illustrator", "Brand Identity Specialist"],
    ["Financial Analyst", "Investment Banker", "Risk Manager"],
    ["Product Manager", "Business Analyst", "Growth Strategist"],
    ["AI Researcher", "NLP Engineer", "Deep Learning Specialist"],
    ["Human Resource Manager", "Recruiter", "Talent Acquisition Specialist"],
    ["Sales Executive", "Account Manager", "Customer Success Manager"],
    ["Mechanical Engineer", "CAD Designer", "Manufacturing Engineer"],
    // 16–20:
    ["UX Researcher", "User Researcher", "Usability Analyst"],
    ["Cloud Engineer", "AWS Architect", "Kubernetes Administrator"],
    ["Game Developer", "Gameplay Programmer", "Game Designer"],
    ["Data Engineer", "Big Data Developer", "ETL Specialist"],
    ["Technical Writer", "Documentation Specialist", "API Writer"]
  ],
  goals: [
    "To design clean, user-friendly interfaces that millions enjoy using.",
    "To build scalable backend services that power high-traffic applications.",
    "To leverage data to create predictive models that solve real-world problems.",
    "To lead successful teams and ensure timely delivery of high-impact projects.",
    "To drive traffic and conversions through impactful digital campaigns.",
    "To maintain infrastructure that ensures 99.99% uptime across all services.",
    "To protect organizations from cyber threats and improve digital safety.",
    "To publish and maintain widely-used mobile applications with stellar ratings.",
    "To create visually stunning brand identities for clients across industries.",
    "To make data-driven decisions that guide smart financial investments.",
    "To define product visions and ship features that users truly love.",
    "To push the boundaries of AI and contribute to cutting-edge research.",
    "To foster a positive work culture and recruit top industry talent.",
    "To exceed sales targets while ensuring clients derive value continuously.",
    "To design efficient mechanical systems that improve daily life technology.",
    // 16–20:
    "To uncover user needs and insights that drive intuitive product experiences.",
    "To architect robust cloud environments that scale and perform under any load.",
    "To build engaging game mechanics that captivate players worldwide.",
    "To engineer reliable data pipelines that power analytics at scale.",
    "To craft clear, concise documentation that empowers developers and users."
  ],
  bio: [
    "A passionate frontend craftsman focused on bringing design to life with modern web technologies.",
    "A backend enthusiast committed to building reliable and secure digital ecosystems.",
    "An analytical thinker who loves uncovering insights and building intelligent systems from data.",
    "A natural team leader with a track record of driving projects from idea to execution.",
    "A creative marketer with a love for brand storytelling and audience engagement.",
    "A systems thinker who thrives in automating, monitoring, and scaling infrastructure.",
    "A cybersecurity guardian always a step ahead in fortifying digital environments.",
    "A mobile technology lover shaping intuitive app experiences for on-the-go users.",
    "An imaginative designer dedicated to translating visions into compelling visuals.",
    "A detail-oriented analyst passionate about turning numbers into strategies.",
    "A product visionary who translates user needs into innovative product features.",
    "An AI researcher obsessed with solving complex problems using machine learning.",
    "A people-first HR professional shaping inclusive, high-performing workplaces.",
    "A persuasive communicator focused on relationship-driven sales and client growth.",
    "An engineer who loves optimizing mechanics for speed, precision, and durability.",
    // 16–20:
    "A user advocate skilled at turning research data into usable design recommendations.",
    "A cloud specialist passionate about deploying scalable, fault-tolerant architectures.",
    "A gamer at heart who codes immersive worlds and unforgettable player experiences.",
    "A data pipeline expert dedicated to ensuring clean, accessible data for all teams.",
    "A wordsmith who transforms complex APIs into clear, actionable documentation."
  ]
};

const menteeProfileData = async function (idx: number) {
  const userId = (await getByEmail(User, `user${idx}@gmail.com`))._id;

  const details = {
    menteeId: userId,
    username: `user${idx}`,
    bio: skillGoalMap.bio ? skillGoalMap.bio[idx] : "",
    skill: skillGoalMap.bio ? skillGoalMap.skill[idx] : "",
    goals: skillGoalMap.bio ? skillGoalMap.goals[idx] : "",
  };

  const createdUser = await create(Profiles, details);
  console.log(`created ${idx} profiles into the database.`);
};

async function seedMenteeProfileIntoDataBase(
  param: (x: any) => void,
  min: number,
  max: number
) {
  for (let x = max; x > min; x--) {
    param(x);
  }
}

