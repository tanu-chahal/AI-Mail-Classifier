// Has not been used, coz OpenAI is paid.
import {OpenAI} from "langchain/llms/openai";
let llm = null

export const getEmailsClassified = async (emailsData) => {
  if(localStorage.getItem('openAIApiKey')){
    llm = new OpenAI({
    openAIApiKey: localStorage.getItem('openAIApiKey') || "",
});}
  const prompt = `An array of emails data will be provided, classify them email into one category out of these 6 categories: 
Important: Emails that are personal or work-related and require immediate attention.
Promotions: Emails related to sales, discounts, and marketing campaigns.
Social: Emails from social networks, friends, and family.
Marketing: Emails related to marketing, newsletters, and notifications.
Spam: Unwanted or unsolicited emails.
General: If none of the above are matched, use Generaal.

The output format should be strictly a js array of objects containing id of mail & category of mail with the same indices as given data, example: [{id: <mailId>, category: <one-of-the-six-categories>},...]

The emails data:
${emailsData}
`
const que= "What is the color of human blood"
  let res = "";
  try {
    res = await llm.predict(que);
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
    return e;
  }
};
