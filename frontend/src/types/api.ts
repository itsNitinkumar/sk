import type {
  User,
  Course,
  Module,
  Content,
  Doubt,
  File,
  Educator,
  Message,
  Category,
  AdminLog,
  Transaction,
  Review
} from './index';

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SearchResponse {
  courses: Course[];
  total: number;
}

export interface CategoryResponse {
  courses: Course[];
  categoryName: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

// Doubt Related Responses
export interface DoubtResponse {
  success: boolean;
  message: string;
  doubt: Doubt & {
    file?: File;
    educator?: Educator;
    messages: Message[];
    user: Pick<User, 'id' | 'name' | 'pfp'>;
  };
}

export interface DoubtsResponse {
  success: boolean;
  message: string;
  doubts: (Doubt & {
    messages: Message[];
  })[];
  total: number;
}

// Content Related Responses
export interface ContentResponse {
  success: boolean;
  message: string;
  content: Content & {
    module: Module;
  };
}

export interface ContentsResponse {
  success: boolean;
  message: string;
  contents: Content[];
  total: number;
}

// Category Related Responses
export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
  total: number;
}

// File Related Responses
export interface FileResponse {
  success: boolean;
  message: string;
  file: File;
}

export interface FilesResponse {
  success: boolean;
  message: string;
  files: File[];
  total: number;
}

// OTP Related Responses
export interface OTPResponse {
  success: boolean;
  message: string;
  otp?: {
    email: string;
    expiry: Date;
  };
}

// Admin Log Related Responses
export interface AdminLogResponse {
  success: boolean;
  message: string;
  logs: AdminLog[];
  total: number;
}

// Enhanced Admin Dashboard Response
export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: {
    platformOverview: {
      userMetrics: {
        totalUsers: number;
        totalEducators: number;
        verifiedUsers: number;
      };
      courseMetrics: {
        totalCourses: number;
        activeCourses: number;
        totalCategories: number;
        totalModules: number;
        totalContent: number;
      };
      financialMetrics: {
        totalRevenue: number;
        successfulTransactions: number;
      };
      reviewMetrics: {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: {
          fiveStars: number;
          fourStars: number;
          threeStars: number;
          twoStars: number;
          oneStar: number;
        };
      };
      supportMetrics: {
        totalDoubts: number;
        resolvedDoubts: number;
      };
    };
    recentTransactions: Transaction[];
    recentLogs: AdminLog[];
  };
}

// Course Related Responses
export interface CourseResponse {
  success: boolean;
  message: string;
  course: Course & {
    educator: Pick<Educator, 'id' | 'bio' | 'about'>;
    modules?: Module[];
    reviews?: Review[];
  };
}
//Enrolled courses
export interface EnrolledCourse {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  educatorName: string;
  educatorPfp: string;
  enrollmentDate: string;
  completionRate: number;
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  courses: Course[];
  total: number;
}

export interface CourseAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    totalEnrollments: number;
    totalRevenue: number;
    averageRating: number;
    completionRate: number;
    activeStudents: number;
    totalDoubts: number;
    resolvedDoubts: number;
    contentEngagement: {
      totalViews: number;
      averageTimeSpent: number;
    };
  };
}

export interface CourseModulesResponse {
  success: boolean;
  message: string;
  modules: Module[];
  total: number;
}

export interface CourseReviewsResponse {
  success: boolean;
  message: string;
  reviews: Review[];
  total: number;
  averageRating: number;
}

export interface CourseStudentsResponse {
  success: boolean;
  message: string;
  students: Array<Pick<User, 'id' | 'name' | 'email' | 'pfp'>>;
  total: number;
}

// Module Related Responses
export interface ModuleResponse {
  success: boolean;
  message: string;
  module: Module & {
    contents: Content[];
  };
}

// Educator Related Responses
export interface EducatorResponse {
  success: boolean;
  message: string;
  educator: Educator & {
    user: Pick<User, 'id' | 'name' | 'email' | 'pfp'>;
    courses: Course[];
  };
}

// Transaction Related Responses
// export interface TransactionResponse {
//   success: boolean;
//   message: string;
//   transaction: Transaction & {
//     course: Pick<Course, 'id' | 'name' | 'price'>;
//   };
// }





