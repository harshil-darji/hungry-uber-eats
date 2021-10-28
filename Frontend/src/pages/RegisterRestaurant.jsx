import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import toast from 'react-hot-toast';
import { validate as validateEmail } from 'email-validator';

import axiosInstance from '../services/apiConfig';

import RestaurantNavbar from '../layout/RestaurantNavbar';
import backgroundImage from '../assets/img/restaurant-background.jpg';
import '../css/RestaurantNavbar.css';
import {
  registerRestaurantFailure,
  registerRestaurantRequest,
  registerRestaurantSuccess,
} from '../actions/restaurant';

const {
  ButtonContainer,
  ButtonRow,
  ButtonMod,
} = require('../components/Button');

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

function RegisterRestaurant() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setname] = useState('');
  const [nameBlurFlag, setnameBlurFlag] = useState(false);

  const [emailValue, setEmailValue] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [emailIsVisited, setEmailIsVisited] = useState(false);
  const emailShouldShowError = !emailIsValid && emailIsVisited;
  const onEmailChange = (e) => {
    setEmailValue(e.target.value);
    setEmailIsValid(validateEmail(e.target.value));
    // setdisabled(!validateEmail(e.target.value));
  };

  const [passwdValue, setpasswdValue] = useState('');
  const [passwdIsValid, setpasswdIsValid] = useState(false);
  const [passwdIsVisited, setpasswdIsVisited] = useState(false);
  const passwdShouldShowError = !passwdIsValid && passwdIsVisited;
  const onpasswdChange = (e) => {
    setpasswdValue(e.target.value);
    setpasswdIsValid(e.target.value.length > 4);
    // if (e.target.value.length > 4) setdisabled(false);
    // else setdisabled(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === '' || emailValue === '' || passwdValue === '') {
      toast.error('Please enter all fields!');
    }
    try {
      dispatch(registerRestaurantRequest());
      const restObj = {
        name,
        emailId: emailValue,
        passwd: passwdValue,
      };
      const response = await axiosInstance.post(
        'register/restaurants',
        restObj,
      );
      dispatch(registerRestaurantSuccess(response));
      sessionStorage.setItem('token', response.data.token);
      toast.success('Restaurant added successfully!');
      history.push('/restaurant/dashboard');
    } catch (error) {
      dispatch(registerRestaurantFailure(error.message));
    }
  };

  return (
    <div>
      <RestaurantNavbar />
      <div className="imageDiv">
        <img src={backgroundImage} alt="bacground" className="bgImage" />
        <div className="formDiv">
          <div className="formElements">
            <h3>Get Started</h3>
            <ThemeProvider
              theme={createTheme(lightThemePrimitives, {
                colors: { buttonPrimaryFill: '#388B1C' },
                width: '552px',
              })}
            >
              <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                <div style={{ marginTop: '40px' }}>
                  <FormControl
                    error={
                      nameBlurFlag && !name.length ? 'Please enter name!' : null
                    }
                  >
                    <Input
                      onChange={(e) => setname(e.target.value)}
                      onBlur={() => setnameBlurFlag(true)}
                      id="name"
                      autoFocus
                      autoComplete="off"
                      placeholder="Enter restaurant name"
                      overrides={
                        (!name.length ? { After: Negative } : {},
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
                  <FormControl
                    error={
                      emailShouldShowError
                        ? 'Please input a valid email address'
                        : null
                    }
                  >
                    <Input
                      placeholder="Enter email address"
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
                  <FormControl
                    error={
                      passwdShouldShowError
                        ? 'Please enter longer password!'
                        : null
                    }
                  >
                    <Input
                      id="passwd"
                      placeholder="Enter password"
                      autoComplete="off"
                      value={passwdValue}
                      type="password"
                      onChange={onpasswdChange}
                      onBlur={() => setpasswdIsVisited(true)}
                      error={passwdShouldShowError}
                      overrides={
                        (passwdShouldShowError ? { After: Negative } : {},
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
                      <ButtonMod type="submit" style={{ width: '100%' }}>
                        Submit
                      </ButtonMod>
                    </ButtonRow>
                  </ButtonContainer>
                </div>
              </form>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterRestaurant;
