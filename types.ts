export type TemplateCategory = 'standard' | 'api-safe';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailColor: string;
  thumbnailUrl?: string;
  category: TemplateCategory;
}

export interface AppState {
  currentStep: 'select' | 'edit' | 'preview';
  selectedTemplateId: string | null;
  markdownContent: string;
}
