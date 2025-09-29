import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Course {
  id: string;
  title: string;
  course_code: string;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  location: string;
  meeting_url: string;
  course_id: string;
}

interface LectureSchedulingProps {
  onSuccess?: () => void;
}

const LectureScheduling: React.FC<LectureSchedulingProps> = ({ onSuccess }) => {
  const { profile, isAdmin, isLecturer } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [formData, setFormData] = useState({
    scheduled_at: '',
    duration_minutes: 90,
    location: '',
    meeting_url: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [profile]);

  useEffect(() => {
    if (selectedCourse) {
      fetchLectures();
    } else {
      setLectures([]);
      setSelectedLecture('');
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedLecture) {
      const lecture = lectures.find(l => l.id === selectedLecture);
      if (lecture) {
        const scheduledDate = new Date(lecture.scheduled_at);
        const localDateTime = new Date(scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        
        setFormData({
          scheduled_at: localDateTime,
          duration_minutes: lecture.duration_minutes,
          location: lecture.location || '',
          meeting_url: lecture.meeting_url || ''
        });
      }
    }
  }, [selectedLecture, lectures]);

  const fetchCourses = async () => {
    try {
      let query = supabase
        .from('courses')
        .select('id, title, course_code')
        .eq('is_active', true);

      if (isLecturer && !isAdmin) {
        query = query.eq('lecturer_id', profile?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchLectures = async () => {
    try {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', selectedCourse);

      if (error) throw error;
      setLectures(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLecture) {
      toast({
        title: "Error",
        description: "Please select a lecture to schedule",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('lectures')
        .update({
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
          duration_minutes: formData.duration_minutes,
          location: formData.location,
          meeting_url: formData.meeting_url
        })
        .eq('id', selectedLecture);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lecture scheduled successfully",
      });

      // Reset form
      setSelectedCourse('');
      setSelectedLecture('');
      setFormData({
        scheduled_at: '',
        duration_minutes: 90,
        location: '',
        meeting_url: ''
      });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Lecture</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course_code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <div className="space-y-2">
              <Label htmlFor="lecture">Lecture</Label>
              <Select value={selectedLecture} onValueChange={setSelectedLecture}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lecture" />
                </SelectTrigger>
                <SelectContent>
                  {lectures.map((lecture) => (
                    <SelectItem key={lecture.id} value={lecture.id}>
                      {lecture.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedLecture && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Date & Time</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="15"
                    max="480"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Room/Building"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting_url">Meeting URL</Label>
                  <Input
                    id="meeting_url"
                    type="url"
                    value={formData.meeting_url}
                    onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                    placeholder="https://zoom.us/..."
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Updating...' : 'Update Lecture Schedule'}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LectureScheduling;