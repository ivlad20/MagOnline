import React, { useState } from "react";
import "./Login.css";
import Iridescence from "./Iridescence";
import FacebookLogo from "./FacebookLogo";
import GooglePlusLogo from "./GooglePlusLogo";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Configure axios defaults for CORS
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';


// Request interceptor to add token to all requests
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle 401/403 errors
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       // Token might be expired or invalid
//       localStorage.removeItem('token');
//       // Redirect to login or show login modal
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

const Login = () => {
  const [showFirst, setShowFirst] = useState(true);

  const navigate = useNavigate();

  const signInValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const signUpValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    surname: Yup.string().required("Surname is required"),
    username: Yup.string().min(4).required("Username is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const handleSignUp = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const userPayload = {
        name: values.name,
        surname: values.surname,
        username: values.username,
        phone: values.phone,
        email: values.email,
        password: values.password,
        address: null,
      };

      const response = await axios.post(
        "http://localhost:8080/users",
        userPayload,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("User created:", response.data);
      alert("Account created successfully!");
      resetForm();
      setShowFirst(true);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response) {
        setErrors({ email: `Error: ${error.response.data || 'Failed to create account'}` });
      } else {
        setErrors({ email: "Network error. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/users/login",
      {
        email: values.email,
        password: values.password,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const token = response.data.token;
    localStorage.setItem("token", token);
    
    // alert("Login successful!");
    navigate("/")
    console.log("Token saved:", token);

  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.status === 401) {
      setErrors({ password: "Invalid email or password." });
    } else if (error.response) {
      setErrors({ password: `Error: ${error.response.data || 'Login failed'}` });
    } else {
      setErrors({ password: "Network error. Please try again." });
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div>
      {/* Uncomment this to add a toggle button */}
      {/* <button onClick={() => setShowFirst(!showFirst)}>Toggle</button> */}

      {showFirst ? (
        <div className="login-container">
          <div className="login-container-main">
            <div className="login-container-main-left">
              <div className="login-container-main-left-sign-in-text">
                <h1>Sign in</h1>
              </div>
              <div className="login-container-main-left-login-options">
                <div className="login-icon-circle">
                  <FacebookLogo />
                </div>
                <div className="login-icon-circle">
                  <GooglePlusLogo />
                </div>
              </div>
              <div className="login-use-your-account">Or use your account</div>
              <div className="login-container-form">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={signInValidationSchema}
                  onSubmit={handleLogin}
                >
                  {({ isSubmitting }) => (
                    <Form className="formik-login-form">
                      <div>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Email"
                          className="login-input"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="login-error-message"
                        />
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Password"
                          className="login-input"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="login-error-message"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="login-container-button"
                      >
                        <b>Sign in</b>
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
            <div className="login-container-main-right">
              <Iridescence
                color={[0.141, 0.325, 0.831]}
                mouseReact={true}
                amplitude={0.1}
                speed={1.0}
              >
                <div className="login-container-main-right-centered">
                  <div className="login-container-main-right-welcome">
                    <b>Welcome back!</b>
                  </div>
                  <div className="login-container-main-right-no-account">
                    <button
                      className="login-container-signup-button"
                      onClick={() => setShowFirst(false)}
                    >
                      No account? Sign up!
                    </button>
                  </div>
                </div>
              </Iridescence>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <div className="login-container-main">
            <div className="login-container-main-right">
              <Iridescence
                color={[0.141, 0.325, 0.831]}
                mouseReact={true}
                amplitude={0.1}
                speed={1.0}
              >
                <div className="login-container-main-right-centered">
                  <div className="login-container-main-right-welcome">
                    <b>Welcome back!</b>
                  </div>
                  <div className="login-container-main-right-no-account">
                    <button
                      className="login-container-signup-button"
                      onClick={() => setShowFirst(true)}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </Iridescence>
            </div>
            {/* Changes start here for sign up */}
            <div className="login-container-main-left">
              <div className="sign-up-container-main-left-sign-up-text">
                <h1>Sign up</h1>
              </div>
              <div className="login-container-form">
                <Formik
                  initialValues={{
                    name: "",
                    surname: "",
                    username: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validationSchema={signUpValidationSchema}
                  onSubmit={handleSignUp}
                >
                  {({ isSubmitting }) => (
                    <Form className="formik-login-form">
                      <div className="sign-up-inputs-container">
                        <div className="sign-up-inputs-container-name">
                          <div className="form-plus-error-container">
                            <Field
                              type="text"
                              name="name"
                              placeholder="Name"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                          <div className="form-plus-error-container">
                            <Field
                              type="text"
                              name="surname"
                              placeholder="Surname"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="surname"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                        </div>
                        <div className="sign-up-inputs-container-phone">
                          <div className="form-plus-error-container">
                            <Field
                              type="text"
                              name="username"
                              placeholder="Username"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="username"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                          <div className="form-plus-error-container">
                            <Field
                              type="text"
                              name="phone"
                              placeholder="Phone"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                        </div>
                        <div className="sign-up-inputs-container-email">
                          <div className="form-plus-error-container">
                            <Field
                              type="email"
                              name="email"
                              placeholder="Email"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                        </div>
                        <div className="sign-up-inputs-container-password">
                          <div className="form-plus-error-container">
                            <Field
                              type="password"
                              name="password"
                              placeholder="Password"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                          <div className="form-plus-error-container">
                            <Field
                              type="password"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              className="sign-up-input-small"
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="signup-error-message"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="login-container-button"
                      >
                        <b>Sign up</b>
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
