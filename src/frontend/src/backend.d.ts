import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Note {
    id: string;
    metadata: NoteMetadata;
    blob: ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface StudyGroup {
    id: string;
    creator: Principal;
    members: Array<Principal>;
    name: string;
    createdAt: Time;
    description: string;
}
export interface VivaQuestion {
    creator: Principal;
    question: string;
    createdAt: Time;
}
export interface QuizQuestion {
    question: string;
    answer: string;
    options: Array<string>;
}
export interface Quiz {
    id: string;
    creator: Principal;
    createdAt: Time;
    questions: Array<QuizQuestion>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface NoteMetadata {
    topic: string;
    semester: string;
    subject: string;
    uploader: Principal;
    uploadTime: Time;
    college: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    bio?: string;
    isPremium: boolean;
    name: string;
    email: string;
    isAdmin: boolean;
    department?: string;
    yearOfStudy?: string;
    college: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createStudyGroup(id: string, name: string, description: string): Promise<StudyGroup>;
    generateQuizFromAI(outcallUrl: string): Promise<string>;
    generateSummaryFromAI(outcallUrl: string): Promise<string>;
    generateVivaFromAI(outcallUrl: string): Promise<string>;
    getAdminUserProfile(): Promise<UserProfile | null>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNote(noteId: string): Promise<Note | null>;
    getNotesBySubject(subject: string): Promise<Array<Note>>;
    getQuiz(quizId: string): Promise<Quiz | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getStudyGroup(groupId: string): Promise<StudyGroup | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVivaQuestions(subject: string): Promise<Array<VivaQuestion>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    joinStudyGroup(groupId: string): Promise<StudyGroup>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveQuiz(id: string, questions: Array<QuizQuestion>): Promise<void>;
    saveVivaQuestions(subject: string, questions: Array<string>): Promise<void>;
    searchUsersByEmail(searchTerm: string): Promise<Array<UserProfile>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setUserAdminStatus(user: Principal, isAdmin: boolean): Promise<void>;
    setUserPremiumStatus(user: Principal, isPremium: boolean): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    uploadNote(id: string, metadata: NoteMetadata, blob: ExternalBlob): Promise<void>;
}
