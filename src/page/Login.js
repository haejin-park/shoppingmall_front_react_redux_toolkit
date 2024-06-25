import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../redux/actions/userAction";
import { userSliceActions } from '../redux/reducers/userReducer';
import "../style/login.style.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading, error} = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = (event) => {
    event.preventDefault();
    dispatch(userSliceActions.deleteUserError());
    if(email && password) dispatch(userActions.loginWithEmail({email, password, navigate}));
  };

  const handleGoogleLogin = async (googleData) => {
    dispatch(userSliceActions.deleteUserError());
    dispatch(userActions.loginWithGoogle({googleToken: googleData.credential, navigate}));
  };
  
  const goRegister = () => {
    dispatch(userSliceActions.deleteUserError());
    navigate("/register");
  }

  return (
    <Container className="login-area">
      {loading && (
          <div className="spinner-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden loading-message">Loading...</span>
          </Spinner>
        </div>
      )}
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )}
      <Form className="login-form" onSubmit={loginWithEmail}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            autoComplete="off"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <div className="display-space-between login-button-area">
          <Button variant="danger" type="submit">Login</Button> 
          <Button variant="danger" onClick={goRegister}>회원가입 하기</Button>
        </div>
        <div className="diffrent-account-login">
          <p>-외부 계정으로 로그인하기-</p>
          <div className="google-login-div">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={(error) => {
                console.error(error);
              }}
            />
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
