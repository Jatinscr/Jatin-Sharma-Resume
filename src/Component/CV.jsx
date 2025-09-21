import React, { useState, useRef, useEffect } from 'react';
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
  Link,
  useTheme
} from '@mui/material';
import { Download, Brightness4, Brightness7 } from '@mui/icons-material';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Link as PDFLink } from '@react-pdf/renderer';

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
      work: `Designed and developed responsive websites using React JavaScript and Material UI,
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
          default: '#f8fafc',
          paper: '#ffffff',
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
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
        lineHeight: 1.5,
      },
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: '0.8rem',
        lineHeight: 1.5,
      },
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '@media (max-width:600px)': {
            borderRadius: 8,
            boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          '@media (max-width:600px)': {
            fontSize: '0.7rem',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            paddingLeft: '12px',
            paddingRight: '12px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            minHeight: '40px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            padding: '6px 12px',
          },
        },
      },
    },
  },
});

// PDF Styles - Mobile optimized
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    paddingTop: 50,
    justifyContent: 'flex-between',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    border: '2px solid #2563eb',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#111827',
  },
  jobTitle: {
    fontSize: 12,
    color: '#2563eb',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 10,
    gap: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563eb',
    borderBottom: '1px solid #2563eb',
    paddingBottom: 2,
  },
  educationItem: {
    marginBottom: 16,
  },
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  institution: {
    fontSize: 12,
    marginBottom: 4,
  },
  duration: {
    fontSize: 8,
    color: '#374151',
  },
  certificationItem: {
    marginBottom: 14,
  },
  certificationName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  certificationIssuer: {
    fontSize: 12,
    marginBottom: 4,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  language: {
    fontSize: 10,
    fontWeight: 'bold',

  },
  proficiency: {
    fontSize: 8,
    color: '#374151',
  },
  summary: {
    fontSize: 12,
    lineHeight: 1.3,
    textAlign: 'justify',
    marginBottom: 18,
  },
  experienceItem: {
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  company: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,

  },
  durationText: {
    fontSize: 9,
    color: '#374151',
  },
  role: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 12,
    lineHeight: 1.2,
    textAlign: 'justify',
  },
  skillChip: {
    fontSize: 10,
    margin: 1.5,
    padding: '2 4',
    border: '1px solid #ccc',
    borderRadius: 2,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  interestChip: {
    fontSize: 10,
    padding: '2 4',
    border: '1px solid #ccc',
    borderRadius: 2,
  },
  twoColumn: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: '38%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '62%',
    paddingLeft: 10,
  },
  divider: {
    borderBottom: '1px solid #eee',
    marginVertical: 6,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: 10,
    marginTop: 1,
  }
});

// Function to convert image to base64
const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

// PDF Document Component
const CVPDFDocument = ({ imageData }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Header Section */}
      <View style={pdfStyles.header}>
        {imageData && (
          <Image
            style={pdfStyles.avatar}
            src={imageData}
          />
        )}
        <View style={pdfStyles.headerText}>
          <Text style={pdfStyles.name}>{cvData.personalInfo.name}</Text>
          <Text style={pdfStyles.jobTitle}>{cvData.personalInfo.jobTitle}</Text>
          <View style={pdfStyles.contactInfo}>
            <Text>{cvData.personalInfo.email}</Text>
            <Text>•</Text>
            <Text>{cvData.personalInfo.phone}</Text>
            <Text>•</Text>
            <PDFLink src={cvData.personalInfo.linkedin} style={pdfStyles.link}>
              LinkedIn - Jatin-Developer
            </PDFLink>
          </View>
        </View>
      </View>

      <View style={pdfStyles.twoColumn}>
        {/* Left Column */}
        <View style={pdfStyles.leftColumn}>
          {/* Education Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Education</Text>
            {cvData.education.map((edu, index) => (
              <View key={index} style={pdfStyles.educationItem}>
                <Text style={pdfStyles.degree}>{edu.degree}</Text>
                <Text style={pdfStyles.institution}>{edu.institution}</Text>
                <Text style={pdfStyles.duration}>{edu.duration}</Text>
              </View>
            ))}
          </View>

          {/* Certifications Section */}
          {cvData.certifications.length > 0 && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.sectionTitle}>Certifications</Text>
              {cvData.certifications.map((cert, index) => (
                <View key={index} style={pdfStyles.certificationItem}>
                  <Text style={pdfStyles.certificationName}>{cert.name}</Text>
                  <Text style={pdfStyles.certificationIssuer}>{cert.issuer}, {cert.year}</Text>
                  {cert.link && (
                    <PDFLink src={cert.link} style={pdfStyles.link}>
                      View Certificate
                    </PDFLink>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Languages Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Languages</Text>
            {cvData.languages.map((lang, index) => (
              <View key={index} style={pdfStyles.languageItem}>
                <Text style={pdfStyles.language}>{lang.language}</Text>
                <Text style={pdfStyles.proficiency}>({lang.proficiency})</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right Column */}
        <View style={pdfStyles.rightColumn}>
          {/* Professional Summary */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Professional Summary</Text>
            <Text style={pdfStyles.summary}>{cvData.personalInfo.summary}</Text>
          </View>

          {/* Experience Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Professional Experience</Text>
            {cvData.experience.map((exp, index) => (
              <View key={index} style={pdfStyles.experienceItem}>
                <View style={pdfStyles.companyRow}>
                  <Text style={pdfStyles.company}>{exp.company}</Text>
                  <Text style={pdfStyles.durationText}>{exp.duration}</Text>
                </View>
                <Text style={pdfStyles.role}>{exp.role}</Text>
                <Text style={pdfStyles.workDescription}>{exp.work}</Text>
                {index < cvData.experience.length - 1 && <View style={pdfStyles.divider} />}
              </View>
            ))}
          </View>

          {/* Skills Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cvData.skills.map((skill, index) => (
                <Text key={index} style={pdfStyles.skillChip}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>

          {/* Interests Section */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Interests</Text>
            <View style={pdfStyles.interestsContainer}>
              {cvData.interests.map((interest, index) => (
                <Text key={index} style={pdfStyles.interestChip}>
                  {interest}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const CVApp = () => {
  const [mode, setMode] = useState('light'); // Default to light mode
  const cvRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const muiTheme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Handle download as PDF using @react-pdf/renderer
  const handleDownloadPDF = async () => {
    try {
      // Convert image to base64 for PDF
      const dataUrl = await toDataURL(cvData.personalInfo.profileImage);
      const blob = await pdf(<CVPDFDocument imageData={dataUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback without image if there's an error
      const blob = await pdf(<CVPDFDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{
        py: isMobile ? 2 : 4,
        px: isMobile ? 1.5 : 2,
      }}>
        {/* Action buttons - placed side by side */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
          mb: isMobile ? 2 : 3,
        }}>
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            sx={{
              borderRadius: 1,
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 1.5,
              background: 'linear-gradient(45deg, #2563eb 30%, #0d9488 90%)',
              boxShadow: '0 3px 5px 2px rgba(37, 99, 235, .3)',
              fontSize: isMobile ? '0.8rem' : '0.875rem',
              minHeight: isMobile ? '40px' : 'auto',
            }}
          >
            Download CV
          </Button>
        </Box>

        {/* CV Content */}
        <Box ref={cvRef} sx={{
          p: isMobile ? 1 : 4,
          backgroundColor: 'background.default',
        }}>
          <Paper elevation={2} sx={{
            p: isMobile ? 2 : 4,
            backgroundColor: 'background.paper',
            borderRadius: isMobile ? 2 : 3,
          }}>
            {/* Header Section */}
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: isMobile ? 2 : 3,
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <Avatar
                    src={cvData.personalInfo.profileImage}
                    sx={{
                      width: isMobile ? 90 : 120,
                      height: isMobile ? 90 : 120,
                      border: `4px solid ${muiTheme.palette.primary.main}`
                    }}
                  />
                  <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {cvData.personalInfo.name}
                    </Typography>
                    <Typography variant="h6" component="h2" color="primary" gutterBottom>
                      {cvData.personalInfo.jobTitle}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 1,
                      justifyContent: isMobile ? 'center' : 'flex-start'
                    }}>
                      <Typography variant="body2">{cvData.personalInfo.email}</Typography>
                      <Typography variant="body2">•</Typography>
                      <Typography variant="body2">{cvData.personalInfo.phone}</Typography>
                      <Typography variant="body2">•</Typography>
                      <Link href={cvData.personalInfo.linkedin} target="_blank" rel="noopener" variant="body2">
                        LinkedIn - Jatin-Developer
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Single column layout for mobile */}
              {isMobile ? (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Professional Summary */}
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                          Professional Summary
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
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
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {exp.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: isMobile ? 0.5 : 0 }}>
                                  {exp.duration}
                                </Typography>
                              </Box>
                              <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic' }}>
                                {exp.role}
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {exp.work}
                              </Typography>
                              {index < cvData.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Skills Section */}
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                          Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {cvData.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              variant="outlined"
                              sx={{
                                mb: 1,
                                mr: 0.5,
                                borderColor: 'primary.main',
                                color: 'text.primary',
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>

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
                            <Typography variant="body2" color="text.secondary">
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

                    {/* Interests Section */}
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom color="primary">
                          Interests
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {cvData.interests.map((interest, index) => (
                            <Chip
                              key={index}
                              label={interest}
                              size="small"
                              variant="outlined"
                              sx={{
                                mb: 1,
                                mr: 0.5,
                                borderColor: 'secondary.main',
                                color: 'text.primary',
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ) : (
                /* Desktop layout (unchanged) */
                <>
                  <Grid item xs={12} md={4}>
                    {/* Left Column */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                              <Typography variant="body2" color="text.secondary">
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
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
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
                              <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {exp.company}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {exp.duration}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic' }}>
                                  {exp.role}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                  {exp.work}
                                </Typography>
                                {index < cvData.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
                              </>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Skills Section */}
                      <Card>
                        <CardContent>
                          <Typography variant="h5" component="h3" gutterBottom color="primary">
                            Skills
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {cvData.skills.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                variant="outlined"
                                sx={{
                                  mb: 1,
                                  mr: 1,
                                  borderColor: 'primary.main',
                                  color: 'text.primary',
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>

                      {/* Interests Section */}
                      <Card>
                        <CardContent>
                          <Typography variant="h5" component="h3" gutterBottom color="primary">
                            Interests
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {cvData.interests.map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest}
                                size="small"
                                variant="outlined"
                                sx={{
                                  mb: 1,
                                  mr: 1,
                                  borderColor: 'secondary.main',
                                  color: 'text.primary',
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Box>

        <Box
          sx={{
            mt: 4,
            mb: 2,
            p: isMobile ? 1.5 : 2,
            textAlign: "center",
            color: "text.secondary",
            fontStyle: "italic",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
            border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
            maxWidth: 600,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            '@media print': {
              display: 'none',
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography component="span" sx={{ fontSize: isMobile ? "1.2rem" : "1.2rem", position: "relative", top: "-4px", lineHeight: 0 }}>🌐</Typography>
            <Typography variant="body2" component="span" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
              This profile is best experienced online for design and interactivity.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem", textAlign: "center" }}>
            If you require a standardized version for recruitment or applicant tracking systems, please use the {" "}
            <Box
              component="span"
              onClick={handleDownloadPDF}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "primary.main",
                textDecoration: "underline"
              }}
            >
              Download CV
            </Box>{" "}
            option above.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CVApp;