import { Button as MuiButton } from '@mui/material';

const Button = ({ children, variant = 'contained', ...props }) => (
  <MuiButton variant={variant} {...props}>
    {children}
  </MuiButton>
);

export default Button;