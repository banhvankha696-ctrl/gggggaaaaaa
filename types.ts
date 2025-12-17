export interface GeneratePromptRequest {
  imageBase64: string;
  imageMimeType: string;
  requirements: string;
  backgroundSuggestion?: string;
}

export interface GeneratePromptResponse {
  prompt: string;
  error?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}