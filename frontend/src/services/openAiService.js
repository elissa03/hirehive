import axios from "axios";

const API_KEY = "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";

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
      content: `Generate 10 interview questions for an applicant named ${applicantData.firstName} ${applicantData.lastName}, who has applied for the position: ${jobString}. The applicant's qualifications are: ${cvString}, and their cover letter says: ${applicantData.coverLetter}.`,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: apiMessages,
        max_tokens: 500, // Adjust if needed
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract and return the generated questions
    const questions = response.data.choices[0].message.content
      .split("\n")
      .filter((q) => q.trim() !== "");
    return questions.slice(0, 10); // Ensure only 10 questions
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return [];
  }
};

export default {
  generateInterviewQuestions,
};
