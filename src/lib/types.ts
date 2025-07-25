export type Course = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  imageUrl: string;
  type: 'Course';
  studentsEnrolled: number;
};

export type Internship = {
  id: string;
  title: string;
  category: string;
  organization: string;
  description: string;
  duration: string;
  stipend: string;
  location: string;
  imageUrl: string;
  type: 'Internship';
  applicants: number;
};

export type Listing = Course | Internship;

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'instructor';
  status: 'active' | 'blocked';
  subscription: 'free' | 'premium' | 'none';
  joinedDate: string;
  imageUrl: string;
};
