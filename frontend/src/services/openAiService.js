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


const customizeCv = async (cvData, jobDescription) => {
  const apiMessages = [
    {
      role: "system",
      content:
        "You are an AI tasked with customizing a CV based on a job description.",
    },
    {
      role: "user",
      content: `Customize the CV data based on the job description provided. The CV data to customize is: ${JSON.stringify(cvData)}. 
                The job description is: ${jobDescription}. Give me the education and experience objects exactly like you received them,
                only fix the description in every object in each array making it better language and more thorough and detailed, end each
                 sentence by a period '.', answer in a professional tone. Only provide the customized output without introductory sentences.`,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "text-davinci-003",
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

    // Extract and return the customized output from the response
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error customizing CV based on job description:", error);
    return null;
  }
};
 
export default {
  generateInterviewQuestions,
  customizeCv 
};
