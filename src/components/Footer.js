import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function GuestFooter() {
    return (
      <Paper sx={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        background: "linear-gradient(0.25turn, #21ac25, #4d88bb, #383838)",
        borderTop: "2px solid white",
      }} component="footer" square variant="outlined">
        <Container maxWidth="lg">
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              my:1
            }}
          >
          </Box>
  
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              display: "flex",
              mb: 2,
            }}
          >
            <Typography variant="caption" color="initial">
              Copyright ©Kayla Imming 2023
            </Typography>
            <a href="https://github.com/kaylajo838" className="footer-github-icon" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "8px", display: "flex", justifyContent: "center", alignItems: "center", color: "black" }}>
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </Box>
        </Container>
      </Paper>
    );
  }
