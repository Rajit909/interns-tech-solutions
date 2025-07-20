import type { Listing, User } from './types';

export const listings: Listing[] = [
  // Courses
  {
    id: 'c1',
    title: 'Advanced React for Modern Web Apps',
    category: 'Web Development',
    instructor: 'Jane Doe',
    description: 'A deep dive into React hooks, context, and performance optimization techniques for building scalable applications.',
    duration: '8 Weeks',
    price: 199.99,
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x400',
    type: 'Course',
    studentsEnrolled: 1204
  },
  {
    id: 'c2',
    title: 'Data Science with Python: Zero to Hero',
    category: 'Data Science',
    instructor: 'John Smith',
    description: 'Learn data analysis, visualization, and machine learning with Python libraries like Pandas, Matplotlib, and Scikit-learn.',
    duration: '12 Weeks',
    price: 249.99,
    rating: 4.9,
    imageUrl: 'https://placehold.co/600x400',
    type: 'Course',
    studentsEnrolled: 2587
  },
  {
    id: 'c3',
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    instructor: 'Emily White',
    description: 'Master the principles of user-centric design, from wireframing and prototyping to creating visually stunning interfaces.',
    duration: '6 Weeks',
    price: 149.99,
    rating: 4.7,
    imageUrl: 'https://placehold.co/600x400',
    type: 'Course',
    studentsEnrolled: 985
  },
  {
    id: 'c4',
    title: 'Digital Marketing Masterclass',
    category: 'Business',
    instructor: 'Michael Brown',
    description: 'Covering SEO, SEM, social media marketing, and content strategy to grow businesses online.',
    duration: '10 Weeks',
    price: 299.99,
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x400',
    type: 'Course',
    studentsEnrolled: 1743
  },
  // Internships
  {
    id: 'i1',
    title: 'Frontend Developer Intern',
    category: 'Web Development',
    organization: 'Innovate Inc.',
    description: 'Join our frontend team to build and maintain our flagship products using React and TypeScript.',
    duration: '3 Months',
    stipend: '$2000/month',
    location: 'Remote',
    imageUrl: 'https://placehold.co/600x400',
    type: 'Internship',
    applicants: 152
  },
  {
    id: 'i2',
    title: 'Data Analyst Intern',
    category: 'Data Science',
    organization: 'Data Insights Co.',
    description: 'Work with real-world datasets to generate insights and support business decisions.',
    duration: '6 Months',
    stipend: '$2500/month',
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400',
    type: 'Internship',
    applicants: 98
  },
  {
    id: 'i3',
    title: 'Product Design Intern',
    category: 'Design',
    organization: 'Creative Solutions',
    description: 'Collaborate with product managers and engineers to design intuitive and engaging user experiences.',
    duration: '3 Months',
    stipend: '$2200/month',
    location: 'Remote',
    imageUrl: 'https://placehold.co/600x400',
    type: 'Internship',
    applicants: 203
  },
  {
    id: 'i4',
    title: 'Marketing Intern',
    category: 'Business',
    organization: 'Growth Gurus',
    description: 'Assist in creating and executing marketing campaigns across various digital channels.',
    duration: '4 Months',
    stipend: '$1800/month',
    location: 'San Francisco, CA',
    imageUrl: 'https://placehold.co/600x400',
    type: 'Internship',
    applicants: 112
  }
];

export const users: User[] = [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active', subscription: 'premium', joinedDate: '2023-01-15' },
    { id: 'u2', name: 'Bob Williams', email: 'bob@example.com', role: 'student', status: 'active', subscription: 'free', joinedDate: '2023-02-20' },
    { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', status: 'blocked', subscription: 'free', joinedDate: '2023-03-10' },
    { id: 'u4', name: 'Diana Miller', email: 'diana@example.com', role: 'student', status: 'active', subscription: 'premium', joinedDate: '2023-04-05' },
    { id: 'u5', name: 'Ethan Davis', email: 'ethan@example.com', role: 'student', status: 'active', subscription: 'none', joinedDate: '2023-05-25' },
];
