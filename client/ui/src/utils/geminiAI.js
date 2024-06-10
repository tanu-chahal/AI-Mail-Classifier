import { GoogleGenerativeAI } from "@google/generative-ai";
import  {useState} from "react"

export const useGoogleAI=()=>{
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getEmailsClassified = async (apiKey,emailsData) => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generation_config: {"response_mime_type": "application/json"}});
  
    const prompt = `I'll provide you with an array of emails, classify them email into one category out of these 6 categories: 
  Important: Emails that are personal or work-related and require immediate attention.
  Promotions: Emails related to sales, discounts, and marketing campaigns.
  Social: Emails from social networks, friends, and family.
  Marketing: Emails related to marketing, newsletters, and notifications.
  Spam: Unwanted or unsolicited emails.
  General: If none of the above are matched, use General.
  
  Strict Rules (that must be followed in every circumstance):
  1. Classify emails into categories based on emailsData provided. Read each mail's subject, from, snippet, body, labelIds and then decide in which category one mail must fall into.
  2. Only one of 6 six valid categories is acceptable, the possible categories are: "Important", "Promotions","Social", "Marketing","Spam","General"
  3. Give the JSON ouput striclty with this schema: {"id-of-first-mail": "category-of-first-mail", "id-of-second-mail": "category-of-second-mail",...} & so on.
  4. Don't give any text other than json in output. It's a super strict requirement, kindly follow the schema. 
  5. Don't miss any mail, return a category for each and every mail sent in emailsData. The number of json key value pairs must be equal to the lengthof emailsData sent.
  `;
    try{
      console.log("Gemini writing...")
      const result = await model.generateContent([prompt, JSON.stringify(emailsData)]);
      // console.log(result)
      const response = result.response;
      // console.log(response)
      const text = response.text();
      let jsonObj = JSON.parse(text);
      // console.log(jsonObj);
      // console.log(text);
      console.log("Successfully classified mails.")
      setError(null);
      setResponse(jsonObj)
      // return jsonObj;

    } catch (err) {
      console.log(err);
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    }finally {
      setLoading(false);
    }
  };
  return { aiResponse: response,aiError: error,aiLoading: loading, getEmailsClassified };
} 


