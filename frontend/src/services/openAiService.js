import axios from "axios";

const API_KEY = "sk-proj-VMsNahZ1XqzJPWyVvu5jT3BlbkFJVkCX8F3zquyodSdF9YMU";

const generateInterviewQuestions = async (
  applicantData,
  cvString,
  jobString
) => {
  const apiMessages = [
    {
      role: "system",
      content:
        "You are an AI interviewer tasked with generating interview questions.",
    },
    {
      role: "user",
      content: `Generate only 10 interview questions for an applicant named ${applicantData.firstName} ${applicantData.lastName}, who has applied for the position: ${jobString}. The applicant's qualifications are: ${cvString}, and their cover letter says: ${applicantData.coverLetter}. Do not answer with any introductory statement just provide a list of questions directly`,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: apiMessages,
        max_tokens: 250, 
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const questions = response.data.choices[0].message.content
      .split("\n")
      .filter((q) => q.trim() !== "");
    return questions;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [];
  }
};

export default {
  generateInterviewQuestions,
};
