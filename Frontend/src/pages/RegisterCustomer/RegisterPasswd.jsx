/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
import { useDispatch } from 'react-redux';

import '../../css/Register.css';
import UberEatsSvg from '../../components/UberEatsSvg';
import { setCustomerPasswd } from '../../actions/customer';

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

function RegisterPasswd() {
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

  const handleSubmit = () => {
    if (passwdIsValid) {
      dispatch(setCustomerPasswd(passwdValue));
      history.push('/register/customer/submit');
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
          <h3>Think of a spicy password!</h3>
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

export default RegisterPasswd;
