-- Create 3 lectures per course
WITH course_ids AS (
  SELECT id, course_code FROM courses WHERE is_active = true
),
lecture_data AS (
  SELECT 
    c.id as course_id,
    c.course_code,
    generate_series(1, 3) as lecture_number
  FROM course_ids c
)
INSERT INTO lectures (course_id, title, description, scheduled_at, duration_minutes, location, meeting_url) 
SELECT 
  ld.course_id,
  CASE ld.course_code
    WHEN 'CS101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Introduction to Programming Fundamentals'
      WHEN 2 THEN 'Variables and Data Types'
      WHEN 3 THEN 'Control Structures and Loops'
    END
    WHEN 'CS102' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Object-Oriented Programming Concepts'
      WHEN 2 THEN 'Classes and Objects'
      WHEN 3 THEN 'Inheritance and Polymorphism'
    END
    WHEN 'CS201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Data Structures Overview'
      WHEN 2 THEN 'Arrays and Linked Lists'
      WHEN 3 THEN 'Stacks and Queues'
    END
    WHEN 'CS301' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Database Design Principles'
      WHEN 2 THEN 'Normalization and ER Diagrams'
      WHEN 3 THEN 'SQL Queries and Optimization'
    END
    WHEN 'MATH101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Limits and Continuity'
      WHEN 2 THEN 'Derivatives Introduction'
      WHEN 3 THEN 'Applications of Derivatives'
    END
    WHEN 'MATH102' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Introduction to Derivatives'
      WHEN 2 THEN 'Chain Rule and Product Rule'
      WHEN 3 THEN 'Implicit Differentiation'
    END
    WHEN 'MATH201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Integration Techniques'
      WHEN 2 THEN 'Integration by Parts'
      WHEN 3 THEN 'Definite Integrals'
    END
    WHEN 'PHYS101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Newton''s Laws of Motion'
      WHEN 2 THEN 'Force and Acceleration'
      WHEN 3 THEN 'Energy and Work'
    END
    WHEN 'PHYS201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Electric Fields and Potential'
      WHEN 2 THEN 'Capacitance and Dielectrics'
      WHEN 3 THEN 'Electric Current and Resistance'
    END
    WHEN 'CHEM101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Atomic Structure and Bonding'
      WHEN 2 THEN 'Chemical Reactions'
      WHEN 3 THEN 'Stoichiometry'
    END
    WHEN 'CHEM201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Organic Reactions Overview'
      WHEN 2 THEN 'Functional Groups'
      WHEN 3 THEN 'Reaction Mechanisms'
    END
    WHEN 'BIO101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Cell Structure and Function'
      WHEN 2 THEN 'Cell Division and Mitosis'
      WHEN 3 THEN 'DNA and RNA Structure'
    END
    WHEN 'BIO201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Mendelian Genetics'
      WHEN 2 THEN 'Gene Expression'
      WHEN 3 THEN 'Population Genetics'
    END
    WHEN 'ENG101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Engineering Design Process'
      WHEN 2 THEN 'Problem Solving Methods'
      WHEN 3 THEN 'Engineering Ethics'
    END
    WHEN 'ENG201' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Statics and Force Analysis'
      WHEN 2 THEN 'Equilibrium of Structures'
      WHEN 3 THEN 'Trusses and Frames'
    END
    ELSE 'General Lecture ' || ld.lecture_number
  END,
  CASE ld.course_code
    WHEN 'CS101' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Basic programming concepts and introduction to coding'
      WHEN 2 THEN 'Understanding different data types and variable declaration'
      WHEN 3 THEN 'If statements, loops, and conditional logic'
    END
    WHEN 'CS102' THEN CASE ld.lecture_number
      WHEN 1 THEN 'Introduction to object-oriented programming paradigm'
      WHEN 2 THEN 'Creating classes, objects, and methods'
      WHEN 3 THEN 'Inheritance relationships and polymorphic behavior'
    END
    ELSE 'Detailed lecture content for ' || ld.course_code || ' lecture ' || ld.lecture_number
  END,
  CASE ld.course_code
    WHEN 'CS101' THEN ('2024-10-0' || ld.lecture_number || ' 09:00:00+00')::timestamptz
    WHEN 'CS102' THEN ('2024-10-0' || ld.lecture_number || ' 10:30:00+00')::timestamptz
    WHEN 'CS201' THEN ('2024-10-0' || ld.lecture_number || ' 14:00:00+00')::timestamptz
    WHEN 'CS301' THEN ('2024-10-0' || ld.lecture_number || ' 11:00:00+00')::timestamptz
    WHEN 'MATH101' THEN ('2024-10-0' || ld.lecture_number || ' 08:00:00+00')::timestamptz
    WHEN 'MATH102' THEN ('2024-10-0' || ld.lecture_number || ' 08:00:00+00')::timestamptz
    WHEN 'MATH201' THEN ('2024-10-0' || ld.lecture_number || ' 13:00:00+00')::timestamptz
    WHEN 'PHYS101' THEN ('2024-10-0' || ld.lecture_number || ' 10:00:00+00')::timestamptz
    WHEN 'PHYS201' THEN ('2024-10-0' || ld.lecture_number || ' 15:00:00+00')::timestamptz
    WHEN 'CHEM101' THEN ('2024-10-0' || ld.lecture_number || ' 11:30:00+00')::timestamptz
    WHEN 'CHEM201' THEN ('2024-10-0' || ld.lecture_number || ' 10:00:00+00')::timestamptz
    WHEN 'BIO101' THEN ('2024-10-0' || ld.lecture_number || ' 09:30:00+00')::timestamptz
    WHEN 'BIO201' THEN ('2024-10-0' || ld.lecture_number || ' 14:30:00+00')::timestamptz
    WHEN 'ENG101' THEN ('2024-10-0' || ld.lecture_number || ' 13:00:00+00')::timestamptz
    WHEN 'ENG201' THEN ('2024-10-0' || ld.lecture_number || ' 15:30:00+00')::timestamptz
    ELSE ('2024-10-0' || ld.lecture_number || ' 10:00:00+00')::timestamptz
  END,
  CASE ld.course_code
    WHEN 'CS101' THEN 90
    WHEN 'CS102' THEN 120
    WHEN 'MATH101' THEN 75
    WHEN 'MATH102' THEN 75
    ELSE 90
  END,
  CASE ld.course_code
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
  'https://zoom.us/j/' || lower(ld.course_code) || '-lecture-' || ld.lecture_number
FROM lecture_data ld;