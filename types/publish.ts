export type EditorMode = 'article' | 'card';

export interface CardPage {
  index: number;
  heading: string;
  markdown: string;
  isCover: boolean;
}

export interface CardDocument {
  title: string;
  pages: CardPage[];
}

export interface CardDocumentResult {
  document: CardDocument;
  errors: string[];
}
