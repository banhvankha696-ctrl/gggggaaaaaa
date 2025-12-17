import { GoogleGenAI } from "@google/genai";
import { GeneratePromptRequest } from "../types";

const processEnvApiKey = process.env.API_KEY;

if (!processEnvApiKey) {
  console.error("API Key is missing. Please ensure process.env.API_KEY is set.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

export const generatePromptFromImage = async (
  request: GeneratePromptRequest
): Promise<string> => {
  try {
    // Strip the data URL prefix (e.g., "data:image/jpeg;base64,") to get just the base64 data
    const base64Data = request.imageBase64.split(',')[1];

    if (!base64Data) {
        throw new Error("Invalid image data");
    }

    const imagePart = {
      inlineData: {
        mimeType: request.imageMimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `
      Bạn là một chuyên gia kỹ thuật về Prompt Engineering (Kỹ sư gợi ý) cho các AI tạo ảnh như Midjourney, Stable Diffusion và DALL-E 3.
      
      NHIỆM VỤ:
      Hãy phân tích hình ảnh được cung cấp và viết một "text prompt" (câu lệnh mô tả) thật chi tiết, chính xác để tái tạo lại hình ảnh này.
      
      THÔNG TIN ĐẦU VÀO TỪ NGƯỜI DÙNG:
      1. Yêu cầu chung (Style, Chi tiết): "${request.requirements || "Mô tả chi tiết ảnh gốc."}"
      2. Yêu cầu về Background/Bối cảnh: "${request.backgroundSuggestion || "Giữ nguyên bối cảnh gốc của ảnh."}"

      HƯỚNG DẪN XỬ LÝ BACKGROUND:
      - Nếu người dùng CÓ nhập "Yêu cầu về Background", hãy VIẾT LẠI prompt sao cho chủ thể của ảnh được đặt trong bối cảnh mới đó. Đảm bảo ánh sáng và không khí (atmosphere) phù hợp với background mới.
      - Nếu KHÔNG, hãy mô tả thật chi tiết bối cảnh gốc đang có trong ảnh.

      CẤU TRÚC PHẢN HỒI:
      1. Ngôn ngữ: TIẾNG ANH (English).
      2. Bao gồm: [Subject Description] + [Action/Pose] + [Background/Environment] + [Lighting] + [Art Style/Camera].
      3. Định dạng đầu ra chỉ là nội dung của prompt, không cần lời dẫn dắt thừa.
      `
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple multimodal tasks
      }
    });

    if (response.text) {
      return response.text.trim();
    } else {
      throw new Error("No text generated from Gemini.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Không thể tạo prompt. Vui lòng kiểm tra lại API Key hoặc thử lại sau.");
  }
};