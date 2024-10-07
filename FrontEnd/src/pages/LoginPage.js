import React, { useState } from 'react';
import styled from 'styled-components';

const LoginBody = styled.div`
  background: linear-gradient(135deg, #6b73ff, #000dff);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  text-align: center;
`;

const UserIcon = styled.div`
  margin-bottom: 20px;
  svg {
    fill: white;
  }
`;

const LoginForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PasswordInput = styled.input`
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  width: 300px;
  font-size: 16px;
  outline: none;
  margin-right: 10px;
`;

const LoginButton = styled.button`
  background-color: #5238f2;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  svg {
    width: 24px;
    height: 24px;
  }
`;

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'your-master-password') {
      onLogin();
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <LoginBody>
      <LoginContainer>
        <UserIcon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100px" height="100px">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12c2.7 0 4.88-2.19 4.88-4.88S14.7 2.24 12 2.24 7.12 4.43 7.12 7.12 9.3 12 12 12zm0 2.24c-2.67 0-8 1.35-8 4.02v2.12h16v-2.12c0-2.67-5.33-4.02-8-4.02z" />
          </svg>
        </UserIcon>
        <LoginForm onSubmit={handleLogin}>
          <PasswordInput
            type="password"
            placeholder="Input Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <LoginButton type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </LoginButton>
        </LoginForm>
      </LoginContainer>
    </LoginBody>
  );
}

export default LoginPage;