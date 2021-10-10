/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
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
import { useHistory } from 'react-router';
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

function RegisterEmail() {
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

  const handleSubmit = async () => {
    if (emailIsValid) {
      try {
        const response = await axiosInstance.post('/register/email', {
          emailId: emailValue,
        });
        if (response.status === 200) {
          dispatch(setCustomerEmail(emailValue));
          history.push('/register/customer/passwd');
        }
      } catch (error) {
        toast.error('Email already registered! Please sign in.');
      }
    }
  };

  return (
    <ThemeProvider
      theme={createTheme(lightThemePrimitives, {
        colors: { buttonPrimaryFill: '#388B1C' },
        width: '552px',
      })}
    >
      <div className="centerColumn">
        <div className="emptyDiv" />
        <div onClick={() => history.push('/')}>
          <UberEatsSvg />
        </div>
        <form
          className="widthDiv"
          onSubmit={(e) => e.preventDefault()}
          style={{ marginTop: '30px' }}
        >
          <h3>Let&apos;s get started</h3>
          <div style={{ marginTop: '40px' }}>
            <FormControl
              label="Enter your email address"
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
                  onClick={handleSubmit}
                  disabled={disabled}
                  style={{ width: '100%' }}
                >
                  Next
                </ButtonMod>
              </ButtonRow>
            </ButtonContainer>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
}

export default RegisterEmail;
