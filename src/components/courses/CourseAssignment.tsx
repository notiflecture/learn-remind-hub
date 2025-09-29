import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserCheck } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  course_code: string;
  department: string;
  level: string;
  lecturer_name?: string;
}

interface Lecturer {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

interface CourseAssignmentProps {
  onSuccess?: () => void;
}

const CourseAssignment: React.FC<CourseAssignmentProps> = ({ onSuccess }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch courses with current lecturer info
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          course_code,
          department,
          level,
          lecturer_id,
          profiles!courses_lecturer_id_fkey(full_name)
        `)
        .eq('is_active', true)
        .order('title');

      if (coursesError) throw coursesError;

      const transformedCourses = coursesData?.map(course => ({
        ...course,
        lecturer_name: course.profiles?.full_name || 'Unassigned'
      }));

      setCourses(transformedCourses || []);

      // Fetch lecturers
      const { data: lecturersData, error: lecturersError } = await supabase
        .from('profiles')
        .select('id, full_name, email, department')
        .eq('role', 'lecturer')
        .order('full_name');

      if (lecturersError) throw lecturersError;
      setLecturers(lecturersData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAssignment = async () => {
    if (!selectedCourse || !selectedLecturer) {
      toast({
        title: "Error",
        description: "Please select both a course and a lecturer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('courses')
        .update({ lecturer_id: selectedLecturer })
        .eq('id', selectedCourse);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lecturer assigned to course successfully",
      });

      // Reset selections
      setSelectedCourse('');
      setSelectedLecturer('');
      
      // Refresh data
      fetchData();
      onSuccess?.();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Assign Lecturer to Course
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course">Select Course</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.course_code} • {course.department} • {course.level}
                      {course.lecturer_name !== 'Unassigned' && ` • Currently: ${course.lecturer_name}`}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourseData && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium">{selectedCourseData.title}</h4>
            <p className="text-sm text-muted-foreground">
              {selectedCourseData.course_code} • {selectedCourseData.department} • {selectedCourseData.level}
            </p>
            <p className="text-sm">
              Current lecturer: <span className="font-medium">{selectedCourseData.lecturer_name}</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="lecturer">Select Lecturer</Label>
          <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a lecturer" />
            </SelectTrigger>
            <SelectContent>
              {lecturers.map((lecturer) => (
                <SelectItem key={lecturer.id} value={lecturer.id}>
                  {lecturer.full_name} ({lecturer.department})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAssignment} 
          disabled={loading || !selectedCourse || !selectedLecturer}
          className="w-full"
        >
          {loading ? 'Assigning...' : 'Assign Lecturer'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseAssignment;