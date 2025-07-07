import bcrypt from "bcrypt";
import { create, getByEmail } from "../../../helper/mongooseQuery";
import User from "../../models/user";
import Profiles from "../../models/profile";

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
  ],
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

async function seedMenteeProfileIntoDataBase() {
  for (let x = 15; x > 0; x--) {
    menteeProfileData(x);
  }
}

export default seedMenteeProfileIntoDataBase;
