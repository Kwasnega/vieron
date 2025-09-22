import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Stack,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock data for preview - updated to match actual database structure
const mockUsers = [
  {
    uid: 'tSTJEW7A2TY8XMqYFlatQ5AWiyB3',
    name: 'Lord Mensah',
    full_name: 'Lord Mensah',
    studentId: '2425400843',
    studentID: '2425400843',
    email: '2425400843@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems (FoCIS)',
    department: 'Faculty of Computing & Information Systems (FoCIS)',
    programme: 'BSc Computer Science (Cybersecurity option)',
    group: 'Group D',
    level: 'Level 100',
    academic_year: 'Level 100',
    semester: 'Second Semester',
    session: 'Evening',
    timestamp: Date.now() - 86400000
  },
  {
    uid: '2',
    name: 'Jane Smith',
    full_name: 'Jane Smith',
    studentId: '2425400844',
    studentID: '2425400844',
    email: '2425400844@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing and Information Systems',
    department: 'Information Technology',
    programme: 'BSc Information Technology',
    group: 'IT-B',
    level: '300',
    academic_year: '300',
    semester: 'Second Semester',
    session: '2024/2025',
    timestamp: Date.now() - 172800000
  }
];

const mockComplaints = [
  {
    id: 'comp1',
    subject: 'Academic Issue',
    type: 'Academic',
    status: 'Queued',
    student_id: '2425400843',
    description: 'Having issues with course registration system',
    date_submitted: Date.now() - 86400000,
    admin_logs: ['Admin started review process'],
    recipient: 'HOD',
    recipient_email: 'hod@gctu.edu.gh',
    admin_route: 'hod'
  },
  {
    id: 'comp2',
    subject: 'Technical Problem',
    type: 'Technical',
    status: 'in_progress',
    student_id: '2425400844',
    description: 'Portal login not working properly',
    date_submitted: Date.now() - 172800000,
    admin_logs: ['Admin assigned to technical team', 'Under investigation'],
    recipient: 'Registrar',
    recipient_email: 'registrar@gctu.edu.gh',
    admin_route: 'registrar'
  },
  {
    id: 'comp3',
    subject: 'Examination Issue',
    type: 'Academic',
    status: 'Queued',
    student_id: '2425400843',
    description: 'Missing exam schedule information',
    date_submitted: Date.now() - 259200000,
    admin_logs: ['Complaint received'],
    recipient: 'Exam',
    recipient_email: 'exam@gctu.edu.gh',
    admin_route: 'exam'
  },
  {
    id: 'comp4',
    subject: 'General Inquiry',
    type: 'Administrative',
    status: 'Queued',
    student_id: '2425400844',
    description: 'General administrative question',
    date_submitted: Date.now() - 345600000,
    admin_logs: ['Complaint received'],
    recipient: 'General',
    recipient_email: null,
    admin_route: 'general'
  }
];

const mockResultIssues = [
  {
    id: 'result1',
    course_code: 'CS201',
    student_id: '2425400843',
    description: 'Missing grade for final exam',
    status: 'Queued',
    date_submitted: Date.now() - 86400000
  }
];

const mockInactiveItems = [
  {
    id: 'inactive1',
    type: 'complaint',
    subject: 'Library Access Issue',
    student_id: '2425400843',
    description: 'Cannot access digital library resources',
    status: 'inactive',
    date_submitted: Date.now() - 172800000,
    date_deleted: Date.now() - 86400000,
    days_until_permanent_deletion: 29
  },
  {
    id: 'inactive2',
    type: 'result_issue',
    course_code: 'IT301',
    student_id: '2425400844',
    description: 'Incorrect GPA calculation',
    status: 'inactive',
    date_submitted: Date.now() - 259200000,
    date_deleted: Date.now() - 172800000,
    days_until_permanent_deletion: 28
  }
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [selectedResultIssue, setSelectedResultIssue] = useState<any>(null);
  const [userSearch, setUserSearch] = useState('');
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [resultSearch, setResultSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('SuperAdmin');
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    role: 'Admin',
    password: ''
  });

  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Function to filter complaints based on admin role
  const getFilteredComplaintsByRole = (complaints: any[], role: string) => {
    if (role === 'SuperAdmin') {
      return complaints; // SuperAdmin sees all complaints
    }
    
    // Map admin roles to their corresponding admin_route values
    const roleRouteMap: { [key: string]: string } = {
      'HOD': 'hod',
      'Dean': 'dean', 
      'Exam': 'exam',
      'Registrar': 'registrar'
    };
    
    const adminRoute = roleRouteMap[role];
    if (!adminRoute) {
      return complaints.filter(c => c.admin_route === 'general'); // Default to general complaints
    }
    
    // Return complaints assigned to this admin role + general complaints
    return complaints.filter(c => c.admin_route === adminRoute || c.admin_route === 'general');
  };

  // Simulate admin role detection
  useEffect(() => {
    // In a real app, this would check the current user's role from Firebase
    // For demo purposes, we'll simulate different admin roles
    const mockAdminRoles = ['SuperAdmin', 'HOD', 'Dean', 'Exam', 'Registrar'];
    const randomRole = mockAdminRoles[Math.floor(Math.random() * mockAdminRoles.length)];
    setAdminRole(randomRole);
    setIsSuperAdmin(randomRole === 'SuperAdmin'); // Only SuperAdmin can access admin management
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'queued':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'deleted':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  // Function to map user fields like in the HTML version
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

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.studentId.includes(userSearch)
  );

  const filteredComplaints = getFilteredComplaintsByRole(mockComplaints, adminRole).filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(complaintSearch.toLowerCase()) ||
      complaint.student_id.includes(complaintSearch);
    const matchesFilter = complaintFilter === 'all' || complaint.status === complaintFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredResultIssues = mockResultIssues.filter(issue => {
    const matchesSearch = issue.course_code.toLowerCase().includes(resultSearch.toLowerCase()) ||
      issue.student_id.includes(resultSearch);
    const matchesFilter = resultFilter === 'all' || issue.status === resultFilter;
    return matchesSearch && matchesFilter;
  });

  const UserProfileModal = () => (
    <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="md" fullWidth>
      <DialogTitle>Student Profile</DialogTitle>
      <DialogContent>
        {selectedUser && (() => {
          const mappedUser = mapUserFields(selectedUser);
          return (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{mappedUser.fullName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{mappedUser.email}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Academic Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Student ID</Typography>
                    <Typography variant="body1">{mappedUser.studentId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Faculty</Typography>
                    <Typography variant="body1">{mappedUser.faculty}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Group</Typography>
                    <Typography variant="body1">{mappedUser.group}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Programme</Typography>
                    <Typography variant="body1">{mappedUser.programme}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Level</Typography>
                    <Typography variant="body1">{mappedUser.level}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Semester</Typography>
                    <Typography variant="body1">{mappedUser.semester}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Session</Typography>
                    <Typography variant="body1">{mappedUser.session}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          );
        })()}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedUser(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const ComplaintModal = () => (
    <Dialog open={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} maxWidth="md" fullWidth>
      <DialogTitle>Complaint Details</DialogTitle>
      <DialogContent>
        {selectedComplaint && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Subject</Typography>
                <Typography variant="body1">{selectedComplaint.subject || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedComplaint.type || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedComplaint.status || 'pending'} 
                  color={getStatusColor(selectedComplaint.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Date Submitted</Typography>
                <Typography variant="body1">
                  {selectedComplaint.date_submitted ? new Date(selectedComplaint.date_submitted).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body1">{selectedComplaint.description || 'No description provided'}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Student Information</Typography>
              {(() => {
                const student = mockUsers.find(u => u.studentId === selectedComplaint.student_id);
                return student ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{student.full_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Student ID</Typography>
                      <Typography variant="body1">{student.studentId || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{student.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Department</Typography>
                      <Typography variant="body1">{student.department || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">Student profile not found</Typography>
                );
              })()}
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Admin Logs</Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {selectedComplaint.admin_logs && selectedComplaint.admin_logs.length > 0 ? (
                  selectedComplaint.admin_logs.map((log: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {log}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No admin activity yet.</Typography>
                )}
              </Paper>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedComplaint(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src="/gctu.png" alt="GCTU Logo" style={{ width: 40, height: 40, marginRight: 16, borderRadius: '50%' }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  QUEUEUP Admin ({adminRole})
                </Typography>
                <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
                  GCTU
                </Typography>
              </Box>
            </Box>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button color="inherit" startIcon={<LogoutIcon />}>
              Log out
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Dashboard Overview" />
            <Tab label="User Management" />
            <Tab label="Complaints" />
            <Tab label="Inactive" />
            <Tab label="Result Issues" />
            {isSuperAdmin && <Tab label="Admin Management" />}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Total Users</Typography>
                    <Typography variant="h3" color="primary">{mockUsers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>My Queue</Typography>
                    <Typography variant="h3" color="primary">
                      {getFilteredComplaintsByRole(mockComplaints, adminRole).length + mockResultIssues.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>My Pending Complaints</Typography>
                    <Typography variant="h3" color="primary">
                      {getFilteredComplaintsByRole(mockComplaints, adminRole).filter(c => c.status === 'pending' || c.status === 'Queued').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                    <Box sx={{ height: 200, overflow: 'auto' }}>
                      <Typography variant="body2" color="text.secondary">
                        New complaint: Academic Issue
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date().toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Users ({filteredUsers.length})</Typography>
                  <TextField
                    size="small"
                    placeholder="Search by name or ID..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    sx={{ width: 300 }}
                  />
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Join Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.uid}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.studentId}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{new Date(user.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Complaints ({filteredComplaints.length})</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      size="small"
                      placeholder="Search subject or student id..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      sx={{ width: 300 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={complaintFilter}
                        onChange={(e) => setComplaintFilter(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="deleted">Deleted</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.subject}</TableCell>
                          <TableCell>{complaint.student_id}</TableCell>
                          <TableCell>{complaint.type}</TableCell>
                          <TableCell>
                            <Chip 
                              label={complaint.status} 
                              color={getStatusColor(complaint.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(complaint.date_submitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                View
                              </Button>
                              <Button size="small" startIcon={<EditIcon />} color="primary">
                                In Progress
                              </Button>
                              <Button size="small" startIcon={<CheckCircleIcon />} color="success">
                                Resolve
                              </Button>
                              <Button size="small" startIcon={<DeleteIcon />} color="error">
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Inactive Items ({mockInactiveItems.length})</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Complaints and result issues that have been marked as inactive. Items will be automatically permanently deleted after 30 days. You can restore items before they are permanently deleted.
                </Alert>
                {mockInactiveItems.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Subject/Course</TableCell>
                          <TableCell>Student</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Days Until Deletion</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockInactiveItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Chip 
                                label={item.type === 'complaint' ? 'Complaint' : 'Result Issue'} 
                                color={item.type === 'complaint' ? 'primary' : 'secondary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {item.type === 'complaint' ? item.subject : item.course_code}
                            </TableCell>
                            <TableCell>{item.student_id}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                              <Chip 
                                label={`${item.days_until_permanent_deletion} days`}
                                color={item.days_until_permanent_deletion <= 7 ? 'error' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                  // Handle restore functionality
                                  console.log('Restoring item:', item.id);
                                }}
                              >
                                Restore
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No inactive items found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Result Issues ({filteredResultIssues.length})</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      size="small"
                      placeholder="Search course or student id..."
                      value={resultSearch}
                      onChange={(e) => setResultSearch(e.target.value)}
                      sx={{ width: 300 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Queued">Queued</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Issue</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredResultIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>{issue.course_code}</TableCell>
                          <TableCell>{issue.student_id}</TableCell>
                          <TableCell>{issue.description}</TableCell>
                          <TableCell>
                            <Chip 
                              label={issue.status} 
                              color={getStatusColor(issue.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(issue.date_submitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setSelectedResultIssue(issue)}
                              >
                                View
                              </Button>
                              <Button size="small" startIcon={<EditIcon />} color="primary">
                                In Progress
                              </Button>
                              <Button size="small" startIcon={<CheckCircleIcon />} color="success">
                                Resolve
                              </Button>
                              <Button size="small" startIcon={<DeleteIcon />} color="error">
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>

          {isSuperAdmin && (
            <TabPanel value={tabValue} index={5}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">Admin Management</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => setCreateAdminOpen(true)}
                      startIcon={<EditIcon />}
                    >
                      Create New Admin
                    </Button>
                  </Stack>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>admin@gctu.edu.gh</TableCell>
                          <TableCell>SuperAdmin</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>2024-01-01</TableCell>
                          <TableCell>
                            <Button size="small" startIcon={<EditIcon />}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>hod@gctu.edu.gh</TableCell>
                          <TableCell>HOD</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>2024-01-15</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" startIcon={<EditIcon />}>
                                Edit
                              </Button>
                              <Button size="small" startIcon={<DeleteIcon />} color="error">
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </TabPanel>
          )}
        </Container>

        <UserProfileModal 
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
        <ComplaintModal />
        
        {/* Create Admin Modal */}
        <Dialog open={createAdminOpen} onClose={() => setCreateAdminOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                placeholder="admin@gctu.edu.gh"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({...newAdminData, role: e.target.value})}
                  label="Role"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="HOD">Head of Department</MenuItem>
                  <MenuItem value="Exam Officer">Exam Officer</MenuItem>
                  <MenuItem value="Dean">Dean</MenuItem>
                  <MenuItem value="Registrar">Registrar</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Temporary Password"
                type="password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                placeholder="Temporary password"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateAdminOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                console.log('Creating admin:', newAdminData);
                setCreateAdminOpen(false);
                setNewAdminData({ email: '', role: 'Admin', password: '' });
              }}
            >
              Create Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;