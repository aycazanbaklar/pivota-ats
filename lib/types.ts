export type ScreeningQuestion = {
  id: string;
  label: string;
  type: "radio" | "select";
  options: string[];
  required: boolean;
};

export type Job = {
  /** İlan numarası — hem listede hem başvuru akışının her adımında görünür */
  code: string;
  title: string;
  department: string;
  location: string;
  workType: "Hibrit" | "Uzaktan" | "Ofis";
  employment: "Tam zamanlı" | "Yarı zamanlı";
  shortDescription: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  applicantCount: number;
  postedAt: string; // ISO
  screeningQuestions: ScreeningQuestion[];
};
