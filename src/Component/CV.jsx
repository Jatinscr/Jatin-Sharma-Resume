import React, { useState, useRef } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  Divider,
  Chip,
  Avatar,
  Link
} from '@mui/material';
import { Print, Download, Brightness4, Brightness7 } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Demo data for the CV
const cvData = {
  personalInfo: {
    name: "Jatin Sharma",
    jobTitle: "Frontend Developer | React.js MUI Specialist",
    email: "jatin200336@gmail.com",
    phone: "+91 8860133659",
    linkedin: "https://www.linkedin.com/in/jatin-developer/",
    profileImage: "/myimage.jpg",
    summary: "Frontend Developer with 6 months of hands-on experience in building responsive and user-friendly web applications using React, JavaScript, and Material UI. Currently contributing to live projects, gaining strong exposure to modern development practices. Passionate about clean code, problem-solving, and continuously improving technical expertise to deliver impactful solutions."
  },
  skills: [
    "JavaScript (ES6+)", "React.js", "Material-UI", "HTML5/CSS3",
    "REST APIs", "Git/GitHub",
    "Responsive Design", "Jest/Testing Library", "Webpack"
  ],
  experience: [
    {
      company: "SainiCollection",
      role: "Frontend Developer",
      duration: "Feb 2025 - Present",
      work: `Designed and developed responsive websites using React, JavaScript, and Material UI,
Contributed to UI/UX improvements, ensuring modern and user-friendly designs,
Managed code and collaborated via GitHub, following version control best practices,
Performed basic testing and debugging to maintain application performance,
Actively learning and applying new web technologies to improve project outcomes.`,
    },
  ],
  education: [
    {
      institution: "Santoshi High School Gurgaon Haryana",
      degree: "10th",
      duration: "2019",
    },
    {
      institution: "Govt Sr. Secondary School Gurgaon Haryana",
      degree: "11th - 12th",
      duration: "2021",
    },
    {
      degree: "B.A Pass",
      institution: "Maharaja Agresen Himalayan Garwal University Uttrakhand",
      duration: "2021 - 2024",
    },
    {
      degree: "MBA in IT",
      institution: "Subharti University Merrut Utter Pradesh",
      duration: "2024 - Present",
    }
  ],
  certifications: [
    {
      name: "Responsive Web Design",
      issuer: "Free Code Camp",
      year: "2025",
      link: "https://www.freecodecamp.org/certification/fcc-d65d8880-3e86-46d8-9aff-cba3843de38e/responsive-web-design"
    },
  ],
  languages: [
    { language: "Hindi", proficiency: "Native" },
    { language: "English", proficiency: "Intermediate" }
  ],
  interests: ["Fitness & meditation", "Yoga", "Hiking", "Tech Meetups"]
};

// Theme configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Light theme
        primary: { main: '#2563eb' },
        secondary: { main: '#0d9488' },
        background: {
          default: '#ffffff',
          paper: '#f3f4f6',
        },
        text: {
          primary: '#111827',
          secondary: '#374151',
        },
      }
      : {
        // Dark theme
        primary: { main: '#60a5fa' },
        secondary: { main: '#7dd3fc' },
        background: {
          default: '#1f2937',
          paper: '#374151',
        },
        text: {
          primary: '#f9fafb',
          secondary: '#e5e7eb',
        },
      }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

const CVApp = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const cvRef = useRef();

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV`,
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  // Handle download as PDF using html2canvas and jsPDF
  const handleDownloadPDF = () => {
    const input = cvRef.current;
    html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 3 }}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            sx={{ display: { print: 'none' } }}
          >
            PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ display: { print: 'none' } }}
          >
            Print
          </Button>
        </Box>

        {/* CV Content */}
        <Box ref={cvRef} sx={{
          p: { xs: 2, md: 4 },
          backgroundColor: 'background.default',
          '@media print': {
            p: 0,
            backgroundColor: 'white',
            '& .MuiCard-root': {
              boxShadow: 'none',
              backgroundColor: 'white',
            },
            '& .MuiPaper-root': {
              boxShadow: 'none',
              backgroundColor: 'white',
            }
          }
        }}>
          <Paper elevation={0} sx={{
            p: { xs: 2, md: 4 },
            backgroundColor: 'background.paper',
            '@media print': {
              boxShadow: 'none',
              backgroundColor: 'white',
            }
          }}>
            {/* Header Section */}
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={cvData.personalInfo.profileImage}
                    sx={{ width: 120, height: 120, border: `4px solid ${theme.palette.primary.main}` }}
                  />
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {cvData.personalInfo.name}
                    </Typography>
                    <Typography variant="h6" component="h2" color="primary" gutterBottom>
                      {cvData.personalInfo.jobTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      <Typography variant="body2">{cvData.personalInfo.email}</Typography>
                      <Typography variant="body2">•</Typography>
                      <Typography variant="body2">{cvData.personalInfo.phone}</Typography>
                      <Typography variant="body2">•</Typography>
                      <Typography variant="body2">{cvData.personalInfo.linkedin}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                {/* Left Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  
                  {/* Education Section */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary">
                        Education
                      </Typography>
                      {cvData.education.map((edu, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {edu.degree}
                          </Typography>
                          <Typography variant="body2">
                            {edu.institution}
                          </Typography>
                          <Typography variant="body2">
                            {edu.duration}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Certifications Section */}
                  {cvData.certifications.length > 0 && (
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                          Certifications
                        </Typography>
                        {cvData.certifications.map((cert, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {cert.name}
                            </Typography>
                            <Typography variant="body2">
                              {cert.issuer}, {cert.year}
                            </Typography>
                            {cert.link && (
                              <Link
                                href={cert.link}
                                target="_blank"
                                rel="noopener"
                                variant="body2"
                                sx={{ display: 'block', mt: 0.5 }}
                              >
                                View Certificate
                              </Link>
                            )}
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Languages Section */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary">
                        Languages
                      </Typography>
                      {cvData.languages.map((lang, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{lang.language}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ({lang.proficiency})
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                {/* Right Column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Professional Summary */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary">
                        Professional Summary
                      </Typography>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                        {cvData.personalInfo.summary}
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Experience Section */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary">
                        Professional Experience
                      </Typography>
                      {cvData.experience.map((exp, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {exp.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {exp.duration}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontStyle="italic" gutterBottom>
                            {exp.role}
                          </Typography>
                          <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                            {exp.work}
                          </Typography>
                          {index < cvData.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary" mt={3}>
                        Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {cvData.skills.map((skill, index) => (
                          <Chip key={index} label={skill} variant="outlined" sx={{ mb: 1 }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="h3" gutterBottom color="primary">
                        Interests
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {cvData.interests.map((interest, index) => (
                          <Chip key={index} label={interest} size="small" variant="outlined" sx={{ mb: 1 }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CVApp;