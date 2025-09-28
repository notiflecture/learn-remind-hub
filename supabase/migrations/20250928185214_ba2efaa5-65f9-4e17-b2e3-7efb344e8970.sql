-- Insert 10 sample courses assigned to existing lecturers
INSERT INTO public.courses (title, course_code, description, department, level, color, is_active, lecturer_id) VALUES
  ('Introduction to Computer Science', 'CS101', 'Fundamental concepts of programming and computer science', 'Computer Science', 'ND 1', '#3B82F6', true, 'b2aa993c-26da-4b57-8f2c-eee7aa23e53a'),
  ('Advanced Database Systems', 'CS301', 'In-depth study of database design, optimization, and administration', 'Computer Science', 'HND 1', '#8B5CF6', true, 'ffd7c299-8705-4330-99a7-96c6b053b023'),
  ('Web Development Fundamentals', 'CS201', 'HTML, CSS, JavaScript, and modern web frameworks', 'Computer Science', 'ND 2', '#10B981', true, 'b2aa993c-26da-4b57-8f2c-eee7aa23e53a'),
  ('Data Structures and Algorithms', 'CS202', 'Essential data structures and algorithmic problem solving', 'Computer Science', 'ND 2', '#F59E0B', true, 'ffd7c299-8705-4330-99a7-96c6b053b023'),
  ('Machine Learning Basics', 'CS401', 'Introduction to ML algorithms and applications', 'Computer Science', 'HND 2', '#EF4444', true, 'b2aa993c-26da-4b57-8f2c-eee7aa23e53a'),
  ('Business Strategy and Management', 'BUS101', 'Core principles of business management and strategic planning', 'Business Administration', 'ND 1', '#6366F1', true, 'ffd7c299-8705-4330-99a7-96c6b053b023'),
  ('Financial Accounting', 'ACC201', 'Fundamentals of accounting principles and financial reporting', 'Accounting', 'ND 2', '#EC4899', true, 'b2aa993c-26da-4b57-8f2c-eee7aa23e53a'),
  ('Digital Marketing', 'BUS301', 'Modern marketing strategies in the digital age', 'Business Administration', 'HND 1', '#14B8A6', true, 'ffd7c299-8705-4330-99a7-96c6b053b023'),
  ('Engineering Mathematics', 'ENG101', 'Mathematical foundations for engineering disciplines', 'Engineering', 'ND 1', '#F97316', true, 'b2aa993c-26da-4b57-8f2c-eee7aa23e53a'),
  ('Software Engineering Principles', 'ENG301', 'Software development lifecycle and engineering practices', 'Engineering', 'HND 1', '#84CC16', true, 'ffd7c299-8705-4330-99a7-96c6b053b023');