export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailColor: string;
}

export interface AppState {
  currentStep: 'select' | 'edit' | 'preview';
  selectedTemplateId: string | null;
  markdownContent: string;
}