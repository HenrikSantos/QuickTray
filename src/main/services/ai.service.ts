import axios from 'axios'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  try {
    // Gemini uses a different prompt structure
    const fullPrompt = `${systemPrompt}\n\nUser text: "${userPrompt}"`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.candidates[0].content.parts[0].text.trim()
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('Gemini API Error Response:', error.response.data)
      if (error.response.status === 400) {
        return 'Erro: Chave de API inválida ou mal formatada.'
      }
    }
    throw new Error('Failed to communicate with Gemini API.')
  }
}

export async function translateText(
  text: string,
  apiKey: string
): Promise<string> {
  const systemPrompt =
    'You are a helpful translator. Translate the user text to Brazilian Portuguese. Only return the translated text, without any introductory phrases.'
  return callGemini(systemPrompt, text, apiKey)
}

export async function translate(
  text: string,
  apiKey: string,
  from: string,
  to: string
): Promise<string> {
  const fromLanguage = from === 'auto' ? 'auto-detect' : from
  const systemPrompt = `You are an expert translator. Translate the following text from ${fromLanguage} to ${to}. Return only the translated text, without any additional comments or explanations.`
  return callGemini(systemPrompt, text, apiKey)
}

export async function reformulateText(
  text: string,
  apiKey: string
): Promise<string> {
  const systemPrompt =
    "You are a writing assistant. Your task is to reformulate the user's text to make it more professional, fluid, and clear. **CRITICAL INSTRUCTION: You must not, under any circumstances, change the original language of the text.** For example, if the text is in Portuguese, the reformulated text must also be in Portuguese. Your response should only contain the reformulated text, with no extra phrases or introductions."
  return callGemini(systemPrompt, text, apiKey)
}

export async function correctText(
  text: string,
  apiKey: string
): Promise<string> {
  const systemPrompt =
    'You are a grammar assistant. Correct any spelling and grammar mistakes in the user text, maintaining the original style. Only return the corrected text, without any introductory phrases.'
  return callGemini(systemPrompt, text, apiKey)
}

export async function summarizeText(
  text: string,
  apiKey: string
): Promise<string> {
  const systemPrompt =
    "You are a helpful assistant. Your task is to summarize the user's text. **CRITICAL INSTRUCTION: You must not, under any circumstances, change the original language of the text.** For example, if the text is in Portuguese, the summary must also be in Portuguese. Your response should only contain the summarized text, with no extra phrases or introductions."
  return callGemini(systemPrompt, text, apiKey)
}

export async function testApiConnection(apiKey: string): Promise<boolean> {
  try {
    await callGemini('Say "OK".', '', apiKey)
    return true
  } catch (error) {
    return false
  }
} 