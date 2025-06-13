import React, { useState } from "react";
import "./Login.css";
import Iridescence from "./Iridescence";
import FacebookLogo from "./FacebookLogo";
import GooglePlusLogo from "./GooglePlusLogo";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [showFirst, setShowFirst] = useState(true);
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
                  onSubmit={(values) => console.log(values)}
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
                  onSubmit={(values) => console.log("Sign Up:", values)}
                >
                  {({ isSubmitting }) => (
                    <Form className="formik-login-form">
                      <div className="sign-up-inputs-container">
                        <div className="sign-up-inputs-container-name">
                          <Field
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="login-error-message"
                          />
                          <Field
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="surname"
                            component="div"
                            className="login-error-message"
                          />
                        </div>
                        <div className="sign-up-inputs-container-phone">
                          <Field
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="login-error-message"
                          />
                          <Field
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="login-error-message"
                          />
                        </div>
                        <div className="sign-up-inputs-container-email">
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="login-error-message"
                          />
                        </div>
                        <div className="sign-up-inputs-container-password">
                          <Field
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="login-error-message"
                          />
                          <Field
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="sign-up-input-small"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="login-error-message"
                          />
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
