export interface EducatorResponse {
  message: string;
  createdAt: string;
  educatorName: string;
}

export interface Doubt {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'answered' | 'resolved';
  resolved: boolean;
  userId: string;
  courseId: string;
  educatorAssigned?: string;
  educatorResponse?: EducatorResponse | null;
}

export interface Message {
  id: string;
  text: string;
  isResponse: boolean;
  userName: string;
  userEmail: string;
  isEducator: boolean;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
}






