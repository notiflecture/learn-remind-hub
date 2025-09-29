-- Insert sample lectures using existing course IDs
WITH course_ids AS (
  SELECT id, course_code FROM courses WHERE is_active = true
)
INSERT INTO lectures (course_id, title, description, scheduled_at, duration_minutes, location, meeting_url) 
SELECT 
  c.id,
  CASE c.course_code
    WHEN 'CS101' THEN 'Introduction to Programming Fundamentals'
    WHEN 'CS102' THEN 'Object-Oriented Programming Concepts'
    WHEN 'CS201' THEN 'Data Structures Overview'
    WHEN 'CS301' THEN 'Database Design Principles'
    WHEN 'MATH101' THEN 'Limits and Continuity'
    WHEN 'MATH102' THEN 'Introduction to Derivatives'
    WHEN 'MATH201' THEN 'Integration Techniques'
    WHEN 'PHYS101' THEN 'Newton''s Laws of Motion'
    WHEN 'PHYS201' THEN 'Electric Fields and Potential'
    WHEN 'CHEM101' THEN 'Atomic Structure and Bonding'
    WHEN 'CHEM201' THEN 'Organic Reactions Overview'
    WHEN 'BIO101' THEN 'Cell Structure and Function'
    WHEN 'BIO201' THEN 'Mendelian Genetics'
    WHEN 'ENG101' THEN 'Engineering Design Process'
    WHEN 'ENG201' THEN 'Statics and Force Analysis'
    ELSE 'General Lecture'
  END,
  CASE c.course_code
    WHEN 'CS101' THEN 'Basic programming concepts, variables, and control structures'
    WHEN 'CS102' THEN 'Classes, objects, inheritance, and polymorphism'
    WHEN 'CS201' THEN 'Arrays, linked lists, stacks, and queues'
    WHEN 'CS301' THEN 'Normalization, ER diagrams, and schema design'
    WHEN 'MATH101' THEN 'Understanding limits and continuous functions'
    WHEN 'MATH102' THEN 'Basic differentiation rules and applications'
    WHEN 'MATH201' THEN 'Various methods of integration'
    WHEN 'PHYS101' THEN 'Understanding force, mass, and acceleration'
    WHEN 'PHYS201' THEN 'Coulomb''s law and electric field calculations'
    WHEN 'CHEM101' THEN 'Electron configuration and chemical bonds'
    WHEN 'CHEM201' THEN 'Introduction to organic chemistry reactions'
    WHEN 'BIO101' THEN 'Prokaryotic and eukaryotic cell components'
    WHEN 'BIO201' THEN 'Basic principles of inheritance'
    WHEN 'ENG101' THEN 'Problem-solving methodology in engineering'
    WHEN 'ENG201' THEN 'Equilibrium of particles and rigid bodies'
    ELSE 'General lecture content'
  END,
  CASE c.course_code
    WHEN 'CS101' THEN '2024-10-01 09:00:00+00'::timestamptz
    WHEN 'CS102' THEN '2024-10-02 10:30:00+00'::timestamptz
    WHEN 'CS201' THEN '2024-10-01 14:00:00+00'::timestamptz
    WHEN 'CS301' THEN '2024-10-04 11:00:00+00'::timestamptz
    WHEN 'MATH101' THEN '2024-10-01 08:00:00+00'::timestamptz
    WHEN 'MATH102' THEN '2024-10-02 08:00:00+00'::timestamptz
    WHEN 'MATH201' THEN '2024-10-03 13:00:00+00'::timestamptz
    WHEN 'PHYS101' THEN '2024-10-01 10:00:00+00'::timestamptz
    WHEN 'PHYS201' THEN '2024-10-02 15:00:00+00'::timestamptz
    WHEN 'CHEM101' THEN '2024-10-01 11:30:00+00'::timestamptz
    WHEN 'CHEM201' THEN '2024-10-03 10:00:00+00'::timestamptz
    WHEN 'BIO101' THEN '2024-10-02 09:30:00+00'::timestamptz
    WHEN 'BIO201' THEN '2024-10-04 14:30:00+00'::timestamptz
    WHEN 'ENG101' THEN '2024-10-01 13:00:00+00'::timestamptz
    WHEN 'ENG201' THEN '2024-10-03 15:30:00+00'::timestamptz
    ELSE '2024-10-01 10:00:00+00'::timestamptz
  END,
  CASE c.course_code
    WHEN 'CS101' THEN 90
    WHEN 'CS102' THEN 120
    WHEN 'MATH101' THEN 75
    WHEN 'MATH102' THEN 75
    ELSE 90
  END,
  CASE c.course_code
    WHEN 'CS101' THEN 'Room A101'
    WHEN 'CS102' THEN 'Room A102'
    WHEN 'CS201' THEN 'Room B201'
    WHEN 'CS301' THEN 'Room C301'
    WHEN 'MATH101' THEN 'Room M101'
    WHEN 'MATH102' THEN 'Room M102'
    WHEN 'MATH201' THEN 'Room M201'
    WHEN 'PHYS101' THEN 'Physics Lab A'
    WHEN 'PHYS201' THEN 'Physics Lab B'
    WHEN 'CHEM101' THEN 'Chemistry Lab 1'
    WHEN 'CHEM201' THEN 'Chemistry Lab 2'
    WHEN 'BIO101' THEN 'Biology Lab A'
    WHEN 'BIO201' THEN 'Biology Lab B'
    WHEN 'ENG101' THEN 'Engineering Hall A'
    WHEN 'ENG201' THEN 'Engineering Hall B'
    ELSE 'General Classroom'
  END,
  'https://zoom.us/j/' || lower(c.course_code) || '-lecture'
FROM course_ids c;