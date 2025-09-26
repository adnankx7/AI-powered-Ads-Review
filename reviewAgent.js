const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { JsonOutputParser } = require('@langchain/core/output_parsers');
require('dotenv').config();

const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.GROQ_API_KEY,
});

const prompt = PromptTemplate.fromTemplate(`
You are an AI content reviewer for a multilingual car marketplace.

Users may write ads in:
- English
- Urdu script (e.g., کار برائے فروخت)
- Roman Urdu (e.g., gari for sale)

Your task is to review the ad description based on the following rules:
1. Inappropriate, offensive, or abusive language is strictly not allowed in any language (English, Urdu, Roman Urdu).
2. Misleading or unverifiable claims must be flagged.
   - for example, if the condition is marked as "Used", and in description write like "like new", "looks like new", or "new condition" are allowed.
3. Mentions of "minor touch", "accidental", or "paint touch-up" are allowed, as long as the language is professional and the ad is truthful.
4. Do not allow irrelevant, suspicious, spammy, or non-car-related content.
5. Reject if there is a mismatch between the description and the car details provided.
   - For example, if the description says "Selling Honda Civic" but the selected brand/model is "Toyota Corolla", this is a mismatch and should be rejected.
   
Here are the ad details:

- Brand: {brand}
- Model: {model}
- Variant: {variant}
- Year: {year}
- Mileage: {mileage}
- Fuel Type: {fuelType}
- Engine Type (cc): {engineType}
- Transmission: {transmission}
- Condition: {condition}
- Description: {description}

Respond only with valid JSON in this format. Do not include any other text or explanations outside the JSON.

{{
  "decision": "Approve" or "Reject",
  "reason": "Explain clearly why the ad was approved or rejected. Mention any mismatches, inappropriate language, or misleading claims."
}}
`);

function getAdReviewChain() {
  return prompt.pipe(llm).pipe(new JsonOutputParser());
}

module.exports = { getAdReviewChain };
