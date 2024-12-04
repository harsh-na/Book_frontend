import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Grid2,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const AuthForm = ({ setToken }) => {
 
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("USER"); 
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  
  const signup = () => {
    const signupRequest = {
      email: signupEmail,
      name,
      password: signupPassword,
      userRole, 
    };

    axios
      .post("http://localhost:9000/api/auth/signup", signupRequest)
      .then(() => alert("User signed up successfully"))
      .catch((error) => console.error(error));
  };

  
  const signin = () => {
    const authRequest = { email: loginEmail, password: loginPassword };

    axios
      .post("http://localhost:9000/api/auth/login", authRequest)
      .then((res) => {
        localStorage.setItem("token", res.data.jwt); 
        setToken(res.data.jwt); 
        alert("User logged in successfully");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Paper style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Authentication
        </Typography>

       
        <Grid2 container spacing={2} direction="column">
          <Grid2 item>
            <TextField
              fullWidth
              label="Enter Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid2>
          <Grid2 item>
            <TextField
              fullWidth
              label="Enter Email"
              variant="outlined"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </Grid2>
          <Grid2 item>
            <TextField
              fullWidth
              label="Enter Password"
              variant="outlined"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </Grid2>
          <Grid2 item>
            <FormControl fullWidth>
              <InputLabel>User Role</InputLabel>
              <Select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                label="User Role"
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={signup}
            >
              Sign Up
            </Button>
          </Grid2>

         
          <Grid2 item style={{ marginTop: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Or Login
            </Typography>
          </Grid2>
          <Grid2 item>
            <TextField
              fullWidth
              label="Enter Email"
              variant="outlined"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </Grid2>
          <Grid2 item>
            <TextField
              fullWidth
              label="Enter Password"
              variant="outlined"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </Grid2>
          <Grid2 item>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={signin}
            >
              Sign In
            </Button>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default AuthForm;
