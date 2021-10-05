import React from 'react';
import { useHistory } from 'react-router';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import {
  useStyletron,
  ThemeProvider,
  createTheme,
  lightThemePrimitives,
} from 'baseui';
import { Alert } from 'baseui/icon';
import { validate as validateEmail } from 'email-validator';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import axiosInstance from '../../services/apiConfig';
import { setCustomerEmail } from '../../actions/customer';

import '../../css/Register.css';
import UberEatsSvg from '../../components/UberEatsSvg';

const {
  ButtonContainer,
  ButtonRow,
  ButtonMod,
} = require('../../components/Button');

function Negative() {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        paddingRight: theme.sizing.scale500,
        color: theme.colors.negative400,
      })}
    >
      <Alert size="18px" />
    </div>
  );
}

function LoginEmail() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [disabled, setdisabled] = React.useState(true);
  const [emailValue, setEmailValue] = React.useState('');
  const [emailIsValid, setEmailIsValid] = React.useState(false);
  const [emailIsVisited, setEmailIsVisited] = React.useState(false);
  const emailShouldShowError = !emailIsValid && emailIsVisited;
  const onEmailChange = (e) => {
    setEmailValue(e.target.value);
    setEmailIsValid(validateEmail(e.target.value));
    setdisabled(!validateEmail(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('login/email', {
        emailId: emailValue,
      });
      if (response.status === 200) {
        dispatch(setCustomerEmail(emailValue));
        history.push('/login/customer/passwd');
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  // TODO: Add logic to sign in automatically if token exists and has not expired
  return (
    <ThemeProvider
      theme={createTheme(lightThemePrimitives, {
        colors: { buttonPrimaryFill: '#388B1C' },
        width: '552px',
      })}
    >
      <div className="centerColumn">
        <div className="emptyDiv" />
        <UberEatsSvg />
        <form
          className="widthDiv"
          onSubmit={handleSubmit}
          style={{ marginTop: '30px' }}
        >
          <h3>Welcome back</h3>
          <div style={{ marginTop: '40px' }}>
            <FormControl
              label="Sign in with your email address"
              error={
                emailShouldShowError
                  ? 'Please input a valid email address'
                  : null
              }
            >
              <Input
                autoComplete="off"
                id="emailId"
                value={emailValue}
                onChange={onEmailChange}
                onBlur={() => setEmailIsVisited(true)}
                error={emailShouldShowError}
                overrides={
                  (emailShouldShowError ? { After: Negative } : {},
                  {
                    InputContainer: {
                      style: ({ $theme }) => ({
                        outline: `${$theme.colors.black} solid`,
                        backgroundColor: $theme.colors.white,
                      }),
                    },
                  })
                }
                required
              />
            </FormControl>
            <ButtonContainer>
              <ButtonRow>
                <ButtonMod
                  type="submit"
                  disabled={disabled}
                  style={{ width: '100%' }}
                >
                  Next
                </ButtonMod>
              </ButtonRow>
            </ButtonContainer>
          </div>
        </form>
        <h5 style={{ marginTop: '25px' }}>
          New to Uber?
          <a href="/register/customer" style={{ color: '#388B1C' }}>
            {' '}
            Create an account
          </a>
        </h5>
      </div>
    </ThemeProvider>
  );
}

export default LoginEmail;
