import OpenAI from "openai";
import  {useState} from "react"
import axios from "axios"

export const useOpenAIApi = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callOpenAI = async (apiKey, messages, model = "gpt-3.5-turbo", temperature = 0.7) => {
    console.log("llolll")
    const openai = new OpenAI({
        organization: import.meta.env.VITE_ORG_ID,
        project: import.meta.env.VITE_PROJ_ID,
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });
    setLoading(true);
    try {
        console.log("lol2")
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: model,
          messages: messages,
          temperature: temperature
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      console.log(result)

      setResponse(result.data);
      setError(null);
    } catch (err) {
        console.log(err)
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, callOpenAI };
};
