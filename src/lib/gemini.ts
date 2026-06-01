/**
 * Gemini AI API integration layer for Shouvik Das's portfolio.
 * Uses a direct HTTP REST client interface to ensure full compatibility with
 * Vercel Serverless and Edge Functions without heavy packages.
 */

export interface ArticleGenerationResult {
  title: string;
  description: string;
  content: string;
  category: string;
  rejected: boolean; // STRICT NSFW/Adult Content safety flag
}

export interface RawNewsItem {
  title: string;
  description: string;
  source: string;
}

export interface BatchArticleResult extends ArticleGenerationResult {
  originalIndex: number;
}

/**
 * Calls the Google Gemini 1.5 Flash API to rewrite news stories into structured blogs.
 * Enforces strict NSFW/adult filtering and safety controls.
 */
export async function generateTechArticle(
  newsTitle: string,
  newsDescription: string,
  newsSource: string
): Promise<ArticleGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables!");
  }

  const model = "gemini-2.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Structured prompt to return pure, parseable JSON with strict safety instructions
  const prompt = `
Act as an expert copywriter, SEO specialist, content editor, and tech/pop-culture journalist.
I will give you a recent raw news headline and snippet. You will turn it into a premium, engaging, SEO-optimized blog article.

CRITICAL SAFETY FILTER: You must strictly filter out and reject any adult, explicit, sexually suggestive, highly violent, gory, or NSFW content. If the source material contains inappropriate themes, set the "rejected" flag to true in the output JSON.

Raw News Title: "${newsTitle}"
Raw News Description: "${newsDescription}"
Original Source: "${newsSource}"

Your output MUST be a valid JSON object matching the following structure exactly, with NO markdown formatting, NO backticks, and NO trailing text outside the JSON.

CRITICAL JSON RULES:
1. NEVER use literal double quotes (") inside your string values (e.g. inside "title", "description", or "content"). If you want to quote something in the text, use single quotes (') instead.
2. For all HTML tags or links in "content", you MUST use single quotes (') for all attributes (e.g. use <a href='https://...' target='_blank'> instead of double quotes).
3. If you must output a double quote, you MUST escape it as \\".

Expected JSON schema:
{
  "rejected": false, // Set to true if raw title/description contains adult, sexual, explicit, or highly violent content. Otherwise false.
  "title": "A catchy, highly engaging, click-worthy, search-optimized title for the article (leave empty if rejected)",
  "description": "A compelling 1-2 sentence meta description/summary that will appear in Google Discover cards (leave empty if rejected)",
  "content": "A detailed, structured article in beautiful HTML format (using <h3>, <p>, <strong>, <ul>, <li> tags). It should be informative, approximately 300-500 words long. Do not use <h1> or <h2>, start directly with <h3> or <p> (leave empty if rejected)",
  "category": "Choose one of: Technology, Science, Global Innovations, Entertainment, or Anime"
}
`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (HTTP ${response.status}): ${errorText}`);
    }

    const resJson = await response.json();
    const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Empty response received from Gemini AI model.");
    }

    let cleanedText = rawText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```[a-zA-Z]*\s*/, "");
      cleanedText = cleanedText.replace(/\s*```$/, "");
    }

    const parsedData: ArticleGenerationResult = JSON.parse(cleanedText.trim());
    return parsedData;

  } catch (error) {
    console.error("Error executing generateTechArticle in gemini.ts:", error);
    throw error;
  }
}

/**
 * Optimised Batch generation. Processes multiple raw news articles in a single prompt.
 * Enforces strict NSFW/adult filtering and safety controls on all batch items.
 */
export async function generateBatchTechArticles(
  articles: RawNewsItem[]
): Promise<BatchArticleResult[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables!");
  }

  const model = "gemini-2.5-flash";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
Act as an expert copywriter, SEO specialist, content editor, and tech/pop-culture journalist.
I will give you an array of raw news articles in JSON format. You will turn each raw news article into a premium, engaging, SEO-optimized blog article.

CRITICAL SAFETY FILTER: You must strictly filter out and reject any adult, explicit, sexually suggestive, highly violent, gory, or NSFW content. If any raw news item contains inappropriate, sexually explicit, highly violent, or offensive themes, you MUST set the "rejected" flag to true for that item in the output array.

Input Raw News Articles:
${JSON.stringify(articles, null, 2)}

Your output MUST be a valid JSON array of objects matching the following schema exactly, with NO markdown formatting, NO backticks, and NO trailing text outside the JSON.

CRITICAL JSON RULES:
1. NEVER use literal double quotes (") inside your string values (e.g. inside "title", "description", or "content"). If you want to quote something in the text, use single quotes (') instead.
2. For all HTML tags or links in "content", you MUST use single quotes (') for all attributes (e.g. use <a href='https://...' target='_blank'> instead of double quotes).
3. If you must output a double quote, you MUST escape it as \\".

Expected JSON array schema:
[
  {
    "rejected": false, // Set to true if the source material contains adult, sexually explicit, or highly violent content. Otherwise false.
    "title": "A catchy, highly engaging, click-worthy, search-optimized title for this article (leave empty if rejected)",
    "description": "A compelling 1-2 sentence meta description/summary (leave empty if rejected)",
    "content": "A detailed, structured article in beautiful HTML format (using <h3>, <p>, <strong>, <ul>, <li> tags) of approximately 300-500 words. Do not use <h1> or <h2>, start directly with <h3> or <p> (leave empty if rejected)",
    "category": "Choose one of: Technology, Science, Global Innovations, Entertainment, or Anime",
    "originalIndex": The 0-based index of this article in the input array
  },
  ...
]
`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini Batch API Error (HTTP ${response.status}): ${errorText}`);
    }

    const resJson = await response.json();
    const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Empty response received from Gemini Batch AI model.");
    }

    let cleanedText = rawText.trim();
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```[a-zA-Z]*\s*/, "");
      cleanedText = cleanedText.replace(/\s*```$/, "");
    }

    const parsedData: BatchArticleResult[] = JSON.parse(cleanedText.trim());
    return parsedData;

  } catch (error) {
    console.error("Error executing generateBatchTechArticles in gemini.ts:", error);
    throw error;
  }
}
