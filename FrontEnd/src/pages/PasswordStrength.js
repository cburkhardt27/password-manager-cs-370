import React, { useState } from 'react';
// import styled from 'styled-components';

/*
const CheckBody = styled.div`
  display: flex;
  background: #897F8F;
`;
*/

// Implement CSS

function PasswordStrength() {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const checkLength = (password) => password.length >= 8;
  const checkUppercase = (password) => /[A-Z]/.test(password);
  const checkLowercase = (password) => /[a-z]/.test(password);
  const checkNumbers = (password) => /\d/.test(password);
  const checkSpecialChars = (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div>
      <h2>Password Strength Checker</h2>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password"
      />

      <ul>
        <li style={{ color: checkLength(password) ? 'white' : 'red' }}>
          {checkLength(password) ? '✔' : '✘'} Must be at least 8 characters long
        </li>
        <li style={{ color: checkUppercase(password) ? 'white' : 'red' }}>
          {checkUppercase(password) ? '✔' : '✘'} Must contain an uppercase letter
        </li>
        <li style={{ color: checkLowercase(password) ? 'white' : 'red' }}>
          {checkLowercase(password) ? '✔' : '✘'} Must contain a lowercase letter
        </li>
        <li style={{ color: checkNumbers(password) ? 'white' : 'red' }}>
          {checkNumbers(password) ? '✔' : '✘'} Must contain a number
        </li>
        <li style={{ color: checkSpecialChars(password) ? 'white' : 'red' }}>
          {checkSpecialChars(password) ? '✔' : '✘'} Must contain a special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrength;