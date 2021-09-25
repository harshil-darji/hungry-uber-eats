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
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import axiosInstance from '../../services/apiConfig';

import '../../css/Register.css';
import UberEatsSvg from '../../components/UberEatsSvg';
import {
  loginCustomerFailure,
  loginCustomerRequest,
  loginCustomerSuccess,
} from '../../actions/customer';

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

function LoginPasswd() {
  const customer = useSelector((state) => state.customer);
  const history = useHistory();
  const dispatch = useDispatch();

  const [disabled, setdisabled] = React.useState(true);
  const [passwdValue, setpasswdValue] = React.useState('');
  const [passwdIsValid, setpasswdIsValid] = React.useState(false);
  const [passwdIsVisited, setpasswdIsVisited] = React.useState(false);
  const passwdShouldShowError = !passwdIsValid && passwdIsVisited;
  const onpasswdChange = (e) => {
    setpasswdValue(e.target.value);
    setpasswdIsValid(e.target.value.length > 4);
    if (e.target.value.length > 4) setdisabled(false);
    else setdisabled(true);
  };

  const handleSubmit = async () => {
    if (passwdIsValid) {
      dispatch(loginCustomerRequest());
      try {
        const customerObj = {
          emailId: customer.emailId,
          passwd: passwdValue,
        };
        const response = await axiosInstance.post(
          'login/customers',
          customerObj,
        );
        dispatch(loginCustomerSuccess(response));
        sessionStorage.setItem('token', response.data.token);
        toast.success('Logged in successfully!');
        history.push('/dashboard');
      } catch (error) {
        dispatch(loginCustomerFailure(error.response.data.error));
        toast.error(error.response.data.error);
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
        <UberEatsSvg />
        <form
          className="widthDiv"
          onSubmit={(e) => e.preventDefault()}
          style={{ marginTop: '30px' }}
        >
          <h3>Welcome back</h3>
          <div style={{ marginTop: '40px' }}>
            <FormControl
              label="Password"
              error={
                passwdShouldShowError ? 'Please enter longer password!' : null
              }
            >
              <Input
                id="passwd"
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
                <ButtonMod
                  type="submit"
                  onClick={handleSubmit}
                  disabled={disabled}
                  style={{ width: '100%' }}
                >
                  Submit
                </ButtonMod>
              </ButtonRow>
            </ButtonContainer>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
}

export default LoginPasswd;
