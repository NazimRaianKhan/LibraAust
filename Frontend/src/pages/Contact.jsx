// src/pages/ContactUs.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

// Material UI imports
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactUs = () => {
  const [librarians, setLibrarians] = useState([]);

  const fetchLibrarians = async () => {
    try {
      const response = await api.get("/librarian");
      setLibrarians(response.data);
    } catch (error) {
      console.error("Failed to fetch librarians:", error);
    }
  };

  useEffect(() => {
    fetchLibrarians();
  }, []);

  return (
    <Box sx={{ bgcolor: "grey.50", py: 8, minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Get in touch with our library team for assistance
          </Typography>
        </Box>

        <Divider>
          <Chip label="Our Librarians" color="primary" />
        </Divider>

        {/* Librarian Cards */}
        <Grid container spacing={4} mt={2}>
          {librarians.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No librarians available at the moment.
              </Typography>
            </Grid>
          ) : (
            librarians.map((librarian) => (
              <Grid item xs={12} md={6} key={librarian.librarian_id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {librarian.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {librarian.designation}
                    </Typography>

                    <Box mt={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon color="action" fontSize="small" />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={1}
                        >
                          {librarian.email}
                        </Typography>
                      </Box>

                      {librarian.phone && (
                        <Box display="flex" alignItems="center">
                          <PhoneIcon color="action" fontSize="small" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            ml={1}
                          >
                            {librarian.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
