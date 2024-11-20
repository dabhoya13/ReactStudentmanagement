import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import SignInImage from "../assets/Images/signin-image.jpg";
import LogoImage from "../assets/Images/logo2.svg";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CallLoginAPI } from "../APICall/callApi.ts";
import { getUserFromToken } from "../Utils/Auth/Auth.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setAuthenticated: (auth: boolean) => void;
}



const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [invalidUsernamePassword, setInvlidUsernamePassword] = useState<string>();
  const validationSchema = Yup.object({
    Username: Yup.string().required("Please Enter Username"),
    Password: Yup.string()
      .min(6, "Enter Password must at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must have at least 8 characters, one uppercase, one lowercase, one digit, and one special character"
      )
      .required("Please Enter Password"),
  });

  const formik = useFormik({
    initialValues: {
      Username: "",
      Password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let studentModel = {
        UserName: values.Username,
        Password: values.Password,
      };

      const formData = {
        ControllerName: "Login",
        MethodName: "CheckLoginDetails",
        DataObject: JSON.stringify(studentModel),
      };

      var response = await CallLoginAPI(formData);
      if (response.result != null && response.result.data.jwtToken != null) {
        var token = response.result.data.jwtToken;
        sessionStorage.setItem("token", token);
        setAuthenticated(true);
        const user = getUserFromToken();
        if (user?.Role == "1") {
          navigate("/admin/adminDashboard");
        }else{
          navigate("/student/dashboard");
        }
      }else{
        setInvlidUsernamePassword("Invalid Username or Password");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "98vh",
        gap: 15,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#d7d7ee",
          height: "100%",
          width: "400px",
          position: "absolute",
          right: 0,
        }}
      ></Box>
      {/* <Box>
        <h1>
          <span>Welcome to Student Portal</span>
          <br />
          Please Login
        </h1>
      </Box> */}
      <Box
        sx={{
          zIndex: 9999,
          display: "flex",
          flexDirection: {
            sm: "column",
            xs: "column",
            md: "row",
            lg: "row",
            xl: "row",
          },
          backgroundColor: {
            sm: "transparent",
            xs: "transparent",
            md: "white",
            lg: "white",
          },
          boxShadow: "0 0 11px rgba(33,33,33,.2)",
          borderRadius: 3,
          width: { sm: "80%", xs: "80%", md: "80%", lg: "60%", xl: "40%" },
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Box
          sx={{
            display: { sx: "none", xs: "none", md: "block", xl: "block" },
          }}
        >
          
          <img src={SignInImage} alt="signin-img" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: { sm: "100%", xs: "100%" },
          }}
        >
          <img src={LogoImage} alt="Logo-Image" />
          <Box sx={{ marginTop: 5 }}>
            <h3 className="welcome-h3">Welcome Back 👋</h3>Please Sign-in to
            your Account
          </Box>
          <form className="login-form" onSubmit={formik.handleSubmit}>
          <Typography sx={{color:"red",marginTop:2}}>{invalidUsernamePassword}</Typography>
            <Box
              sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}
            >
              <span>USERNAME</span>
              <TextField
                margin="normal"
                required
                className="login-textfield"
                fullWidth
                id="username"
                label="Username"
                name="Username"
                value={formik.values.Username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Username && !!formik.errors.Username}
                helperText={formik.touched.Username && formik.errors.Username}
                autoFocus
                sx={{
                  marginTop: 1,
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />
            </Box>
            <Box
              sx={{ marginTop: 3, display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <span>PASSWORD</span>
                <Link sx={{ textDecoration: "none" }}>Forgot Password?</Link>
              </Box>
              <TextField
                required
                fullWidth
                className="login-textfield"
                id="password"
                label="Password"
                name="Password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Password && !!formik.errors.Password}
                helperText={formik.touched.Password && formik.errors.Password}
                sx={{
                  marginTop: 1,
                  "& .MuiFormHelperText-root": { color: "red" },
                }}
              />
            </Box>
            <Button
              fullWidth
              type="submit"
              sx={{ backgroundColor: "#6a6cf6", color: "white", marginTop: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
