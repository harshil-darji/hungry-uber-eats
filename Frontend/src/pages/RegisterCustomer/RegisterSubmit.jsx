/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import {
  useStyletron,
  ThemeProvider,
  createTheme,
  lightThemePrimitives,
} from 'baseui';
import { useHistory } from 'react-router';
import { Alert } from 'baseui/icon';

import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import axiosInstance from '../../services/apiConfig';
import {
  registerCustomerFailure,
  registerCustomerRequest,
  registerCustomerSuccess,
} from '../../actions/customer';

import UberEatsSvg from '../../components/UberEatsSvg';
import '../../css/Register.css';

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

function RegisterSubmit(props) {
  const customer = useSelector((state) => state.customer);
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setname] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [nameBlurFlag, setnameBlurFlag] = useState(false);
  const [contactNoBlurFlag, setcontactNoBlurFlag] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customer.emailId === '' || customer.passwd === '') {
        toast.error('Please go back and enter all fields first!');
        return;
      }
      dispatch(registerCustomerRequest());
      const customerObj = {
        contactNo,
        name,
        emailId: customer.emailId,
        passwd: customer.passwd,
      };
      const response = await axiosInstance.post(
        'register/customers',
        customerObj,
      );
      dispatch(registerCustomerSuccess(response));
      sessionStorage.setItem('token', response.data.token);
      toast.success('Account created successfully!');
      props.history.push('/customer/dashboard');
    } catch (error) {
      dispatch(registerCustomerFailure(error.response.data.error));
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
          onSubmit={handleSubmit}
          style={{ marginTop: '30px' }}
          className="widthDiv"
        >
          <h3>Enter your details</h3>
          <div style={{ marginTop: '40px' }}>
            <FormControl
              label="Name"
              error={nameBlurFlag && !name.length ? 'Please enter name!' : null}
            >
              <Input
                autoFocus
                required
                id="name"
                autoComplete="off"
                placeholder="Enter name"
                onChange={(e) => setname(e.target.value)}
                onBlur={() => setnameBlurFlag(true)}
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
              />
            </FormControl>

            <FormControl
              label="Contact number"
              error={
                contactNoBlurFlag && !contactNo.length
                  ? 'Please enter contact number!'
                  : null
              }
            >
              <MaskedInput
                required
                placeholder="Enter phone number"
                mask="(999) 999-9999"
                id="contactNo"
                onBlur={() => setcontactNoBlurFlag(true)}
                onChange={(e) => setcontactNo(e.target.value)}
                // error={errors.contactNo}
                overrides={
                  (!contactNo.length ? { After: Negative } : {},
                  {
                    InputContainer: {
                      style: ({ $theme }) => ({
                        outline: `${$theme.colors.black} solid`,
                        backgroundColor: $theme.colors.white,
                      }),
                    },
                  })
                }
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
      </div>
    </ThemeProvider>
  );
}

export default RegisterSubmit;
