import cvService from "../../services/cvService";
import localStorageUtils from "../../utils/localStorageUtils";

const STATIC_SKILLS = [
    "JavaScript", "Python", "Java", "C#", "Ruby", "Go", "Scala", "Swift", "Kotlin", "PHP"
]; 

const SOFT_SKILLS = [
  "Communication skills", "Teamwork", "Problem-solving", "Time management", "Leadership",
  "Adaptability", "Creativity", "Critical thinking", "Emotional intelligence", "Conflict resolution",
  "Decision-making", "Stress management", "Networking", "Negotiation", "Empathy", "Resilience",
  "Attention to detail", "Organization", "Open-mindedness", "Self-motivation", "Work ethic",
  "Active listening", "Presentation skills", "Interpersonal skills", "Conflict management",
  "Collaboration", "Flexibility", "Mentoring/Coaching", "Persuasion/Influence", "Facilitation",
  "Customer service", "Cultural awareness", "Initiative", "Patience", "Problem analysis",
  "Trustworthiness", "Curiosity", "Storytelling", "Delegation", "Public speaking", "Positive attitude",
  "Resourcefulness", "Strategic thinking", "Goal setting", "Self-awareness", "Gratitude", "Vision",
  "Enthusiasm", "Diplomacy", "Risk management", "Writing skills", "Decision analysis", "Follow-up",
  "Non-verbal communication", "Assertiveness", "Relationship building", "Respect", "Humor",
  "Conflict prevention", "Self-care", "Grit", "NodeJS", "NestJS", "NextJS"
];


const createCv = async(data) => {

  try {

    const userId = localStorageUtils.getLocalUserId();
    
    if (!userId)
      return;

    data['userId'] = userId;
    const response = await cvService.createCv(data);

    return response;

  } catch (error) {

    console.error("There was an error creating the cv: ", error);
    return {status: 500, message: error};

  }

};

export default {
    SOFT_SKILLS,  
    STATIC_SKILLS,
    createCv
}