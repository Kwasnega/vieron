import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';

interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Stack>
);

interface UserProfileModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, open, onClose }) => {
  if (!user) return null;

  // Function to map user fields - correctly maps database fields
  const mapUserFields = (user: any) => ({
    fullName: user.full_name || user.name || 'N/A',
    email: user.email || 'N/A',
    studentId: user.studentId || user.studentID || user.student_id || 'N/A',
    faculty: user.faculty || user.department || 'N/A',
    group: user.group || user.student_group || 'N/A',
    programme: user.programme || user.program || user.course || 'N/A',
    level: user.level || user.academic_year || 'N/A',
    semester: user.semester || user.current_semester || 'N/A',
    session: user.session || user.time_session || 'N/A'
  });

  const mappedUser = mapUserFields(user);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Student Profile</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Stack direction="row" spacing={4}>
              <ProfileField label="Full Name" value={mappedUser.fullName} />
              <ProfileField label="Email" value={mappedUser.email} />
            </Stack>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>Academic Information</Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={4}>
                <ProfileField label="Student ID" value={mappedUser.studentId} />
                <ProfileField label="Faculty" value={mappedUser.faculty} />
              </Stack>
              <Stack direction="row" spacing={4}>
                <ProfileField label="Group" value={mappedUser.group} />
                <ProfileField label="Programme" value={mappedUser.programme} />
              </Stack>
              <Stack direction="row" spacing={4}>
                <ProfileField label="Level" value={mappedUser.level} />
                <ProfileField label="Semester" value={mappedUser.semester} />
              </Stack>
              <Stack direction="row" spacing={4}>
                <ProfileField label="Session" value={mappedUser.session} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileModal;