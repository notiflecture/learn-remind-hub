import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  course_code: string;
  department: string;
  level: string;
  lecturer_id: string;
  color: string;
  lecturer_name?: string;
}

interface Lecturer {
  id: string;
  full_name: string;
  email: string;
  department: string;
}

interface CourseManagementProps {
  refreshTrigger?: number;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ refreshTrigger }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses with lecturer names
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          course_code,
          department,
          level,
          lecturer_id,
          color,
          profiles!courses_lecturer_id_fkey(full_name)
        `)
        .eq('is_active', true)
        .order('title');

      if (coursesError) throw coursesError;

      // Transform the data to include lecturer name
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (courseId: string, currentLecturerId: string) => {
    setEditingCourse(courseId);
    setSelectedLecturer(currentLecturerId);
  };

  const handleSave = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ lecturer_id: selectedLecturer })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course lecturer updated successfully",
      });

      setEditingCourse(null);
      fetchData(); // Refresh the data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
    setSelectedLecturer('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Management</h3>
        <p className="text-sm text-muted-foreground">
          {courses.length} course{courses.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: course.color }}
                  />
                  <div>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.course_code} • {course.department} • {course.level}
                    </p>
                  </div>
                </div>
                {editingCourse === course.id ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(course.id)}
                      className="h-8 px-3"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-8 px-3"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditClick(course.id, course.lecturer_id)}
                    className="h-8 px-3"
                  >
                    <PenTool className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Assigned to:</span>
                {editingCourse === course.id ? (
                  <Select
                    value={selectedLecturer}
                    onValueChange={setSelectedLecturer}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.full_name} ({lecturer.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="secondary" className="text-sm">
                    {course.lecturer_name}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No courses found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseManagement;