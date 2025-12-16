export interface Application {
    id: string;
    projectTitle: string;
    area: string;
    teamName: string;
    submissionDate: string;
    status: 'InReview' | 'Approved' | 'Rejected' | 'Pending';
    feedback: string;
    refNo: string;
    score?: number; // AI Probability Score
}

export interface Team {
    id: string;
    name: string;
    area: string;
    description: string;
    capacity: number;
    currentMembers: number;
    isTrending?: boolean;
    urgent?: boolean;
}

export enum UserRole {
    Student = 'Student',
    Advisor = 'Advisor'
}

export interface User {
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string;
}

export interface ProjectDraft {
    title: string;
    summary: string;
    method: string;
    keywords: string[];
}

export interface AIAnalysisResult {
    score: number;
    analysis: string;
    strengths: string[];
    weaknesses: string[];
}