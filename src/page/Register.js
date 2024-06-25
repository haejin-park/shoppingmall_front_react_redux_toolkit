import React, { useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { userActions } from "../redux/actions/userAction";
import { userSliceActions } from '../redux/reducers/userReducer';
import "../style/register.style.css";
const Register = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);
  const {loading, error} = useSelector((state) => state.user);

  const register = (event) => {
    event.preventDefault();
    dispatch(userSliceActions.deleteUserError());
    const {email, name, password, confirmPassword, policy} = formData;
      if(password !== confirmPassword){
        setPasswordError("비밀번호가 일치하지 않습니다.");
        return;
      }
      if(!policy) {
        setPolicyError(true);
        return;
      }
      setPasswordError("");
      setPolicyError(false);
      dispatch(userActions.registerUser({email, name, password, navigate}));      
  };

  const handleChange = (event) => {
    event.preventDefault();
    const {id, value, checked} = event.target;
    if(id === "policy") {
      setFormData({...formData, [id]:checked});
    } else {
      setFormData({...formData, [id]:value});
    }
  };

  const  goBackLogin = () => {
    dispatch(userSliceActions.deleteUserError());
    navigate("/login");
  }
return (
  <Container className="register-area">
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
    <Form onSubmit={register}>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          id="email"
          placeholder="Enter email"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          placeholder="Enter name"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          placeholder="Password"
          autoComplete="off"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="off"
          onChange={handleChange}
          required
          isInvalid={passwordError}
        />
        <Form.Control.Feedback type="invalid">
          {passwordError}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="mb-3 terms-and-link-box">
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
          />
        </Form.Group>
        <div>
        <Button  variant="danger" type="submit">회원가입</Button>
        <Button className="ml-2" variant="danger" onClick={goBackLogin}>로그인으로 돌아가기</Button>
        </div>
      </div>

    </Form>
  </Container>
  );
};

export default Register;
