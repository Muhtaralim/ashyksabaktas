export interface ClassroomScores {
  task1: number;
  task2: number;
  task3: number;
  comicAccess: number;
  comicPixel: number;
  comicVector: number;
  comicFormats: number;
  comicProject: number;
  comicQuiz: number;
}

export const comicScoreMaxima = {
  comicAccess: 10,
  comicPixel: 15,
  comicVector: 20,
  comicFormats: 15,
  comicProject: 20,
  comicQuiz: 20,
} as const;

export type ComicScoreKey = keyof typeof comicScoreMaxima;

export interface ClassroomStudent {
  id: string;
  name: string;
  scores: ClassroomScores;
  updatedAt: string;
}

export type ClassroomSession =
  | { role: 'student'; student: ClassroomStudent; token: string }
  | { role: 'teacher'; token: string };