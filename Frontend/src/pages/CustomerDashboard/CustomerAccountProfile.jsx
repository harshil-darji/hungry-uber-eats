/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
import { FormControl } from 'baseui/form-control';
import { Input, MaskedInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { useStyletron } from 'baseui';
import { Alert } from 'baseui/icon';
import { DatePicker } from 'baseui/datepicker';
import { FileUploader } from 'baseui/file-uploader';
import { uploadFile } from 'react-s3';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';

import axiosInstance from '../../services/apiConfig';
import CustomerProfileMenu from '../../components/CustomerProfileMenu';
import {
  updateCustomerFailure,
  updateCustomerRequest,
  updateCustomerSuccess,
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

function CustomerAccountProfile() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [emailId, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [dob, setDob] = useState('');
  const [nickName, setNickName] = useState('');
  const [about, setAbout] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);

  const [contactNoBlurFlag, setcontactNoBlurFlag] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const contactNoRegex = /^\([\d]{3}\) [\d]{3}-[\d]{4}$/;

  const calCities = [
    'Fresno',
    'Las Vegas',
    'Los Angeles',
    'Oakland',
    'Sacramento',
    'San Diego',
    'San Jose',
    'San Francisco',
    'Santa Clara',
  ];

  const nevCities = ['Reno', 'Fallon', 'Sparks', 'Carson City'];

  const checkProperties = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete obj[key];
      }
    });
  };

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}`, {
        headers: { Authorization: token },
      });
      const { user } = response.data;
      setName(user.name);
      setEmail(user.emailId);
      setContactNo(user.contactNo);
      setNickName(user.nickName ? user.nickName : '');
      setDob(user.dob ? new Date(user.dob) : '');
      setAbout(user.about ? user.about : '');
      setCity(user.city ? [{ city: user.city }] : []);
      setState(user.state ? [{ state: user.state }] : []);
      setCountry(user.country ? [{ country: user.country }] : []);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/customer');
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contactNoBlurFlag && !contactNoRegex.test(contactNo)) {
      toast.error('Enter valid contact number!');
      return;
    }
    dispatch(updateCustomerRequest());
    try {
      const custObj = {
        name,
        contactNo,
        dob: dob.length > 0 ? dob[0] : '',
        nickName,
        about,
        city: city.length > 0 ? city[0].city : '',
        state: state ? state.state : '',
        country: country.length > 0 ? country[0].country : '',
      };
      checkProperties(custObj);
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.put(
        `customers/${decoded.id}`,
        custObj,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(updateCustomerSuccess(response.data.user));
      toast.success('Details updated!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/');
        }
        dispatch(updateCustomerFailure(error.response.data.error));
        toast.error(error.response.data.error);
      }
    }
  };

  const REGION = 'us-east-1';
  const config = {
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: REGION,
  };

  const uploadFileAndUpdateTable = (acceptedFiles) => {
    setIsUploading(true);
    uploadFile(acceptedFiles[0], config)
      .then(async (data) => {
        dispatch(updateCustomerRequest());
        try {
          const custObj = {
            profileImg: data.location,
          };
          checkProperties(custObj);
          const token = sessionStorage.getItem('token');
          const decoded = jwt_decode(token);
          const response = await axiosInstance.put(
            `customers/${decoded.id}`,
            custObj,
            {
              headers: { Authorization: token },
            },
          );
          dispatch(updateCustomerSuccess(response.data.user));
          toast.success('Image uploaded!');
          setIsUploading(false);
          setModalIsOpen(false);
        } catch (error) {
          if (error.hasOwnProperty('response')) {
            if (error.response.status === 403) {
              toast.error('Session expired. Please login again!');
              history.push('/login/restaurant');
            }
            dispatch(updateCustomerFailure(error.response.data.error));
            setIsUploading(false);
            toast.error(error.response.data.error);
          }
        }
      })
      .catch((err) => toast.error(err));
  };

  return (
    <>
      <Modal onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}>
        <ModalHeader>Upload new profile picture</ModalHeader>
        <ModalBody>
          <FileUploader
            onCancel={() => {
              setIsUploading(false);
              setModalIsOpen(false);
            }}
            onDrop={(acceptedFiles) => {
              uploadFileAndUpdateTable(acceptedFiles);
            }}
            progressMessage={isUploading ? 'Uploading... hang tight.' : ''}
          />
        </ModalBody>
        <ModalFooter>
          <ModalButton kind="tertiary" onClick={() => setModalIsOpen(false)}>
            Cancel
          </ModalButton>
        </ModalFooter>
      </Modal>
      <div style={{ marginTop: '30px' }}>
        <div onClick={() => setModalIsOpen(true)} style={{ width: '552px' }}>
          <CustomerProfileMenu showViewAccount={false} />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: '30px' }}
          className="widthDiv"
        >
          <h5>Update details below</h5>
          <div style={{ marginTop: '40px' }}>
            <FormControl label="Name">
              <Input
                id="name"
                autoComplete="off"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl label="Email address">
              <Input disabled id="emailId" autoComplete="off" value={emailId} />
            </FormControl>

            <FormControl label="About">
              <Input
                id="about"
                autoComplete="off"
                placeholder="Tell something about yourself"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </FormControl>

            <FormControl
              label="Contact number"
              error={
                contactNoBlurFlag && !contactNoRegex.test(contactNo)
                  ? 'Please enter valid contact number!'
                  : null
              }
            >
              <MaskedInput
                placeholder="Enter phone number"
                mask="(999) 999-9999"
                id="contactNo"
                value={contactNo}
                onBlur={() => setcontactNoBlurFlag(true)}
                onChange={(e) => setContactNo(e.target.value)}
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

            <FormControl label="Date of birth">
              <DatePicker
                maxDate={new Date('2010-01-01T07:00:00.000Z')}
                minDate={new Date('1960-01-01T07:00:00.000Z')}
                value={dob}
                onChange={({ date }) =>
                  setDob(Array.isArray(date) ? date : [date])
                }
              />
            </FormControl>

            <FormControl label="Nick name">
              <Input
                id="nickName"
                autoComplete="off"
                placeholder="Preferred nick name"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </FormControl>

            <FormControl label="City">
              <Select
                options={[
                  { city: 'Carson City' },
                  { city: 'Fallon' },
                  { city: 'Fresno' },
                  { city: 'Las Vegas' },
                  { city: 'Los Angeles' },
                  { city: 'Oakland' },
                  { city: 'Reno' },
                  { city: 'Sacramento' },
                  { city: 'San Diego' },
                  { city: 'San Francisco' },
                  { city: 'San Jose' },
                  { city: 'Santa Clara' },
                  { city: 'Sparks' },
                ]}
                valueKey="city"
                labelKey="city"
                onChange={({ value }) => {
                  setCity(value);
                  if (value[0].hasOwnProperty('city')) {
                    if (calCities.includes(value[0].city)) {
                      setState({ state: 'California' });
                    } else if (nevCities.includes(value[0].city)) {
                      setState({ state: 'Nevada' });
                    }
                  }
                }}
                value={city}
              />
            </FormControl>

            <FormControl label="State">
              <Select
                options={[{ state: 'California' }, { state: 'Nevada' }]}
                disabled
                placeholder=""
                valueKey="state"
                labelKey="state"
                value={state}
              />
            </FormControl>

            <FormControl label="Country">
              <Select
                options={[
                  { country: 'USA' },
                  { country: 'Canada' },
                  { country: 'India' },
                  { country: 'Australia' },
                ]}
                placeholder=""
                valueKey="country"
                labelKey="country"
                value={country}
                onChange={({ value }) => setCountry(value)}
              />
            </FormControl>

            <ButtonContainer>
              <ButtonRow>
                <ButtonMod
                  type="submit"
                  style={{ width: '100%', marginBottom: '10px' }}
                >
                  Submit
                </ButtonMod>
              </ButtonRow>
            </ButtonContainer>
          </div>
        </form>
      </div>
    </>
  );
}

export default CustomerAccountProfile;
