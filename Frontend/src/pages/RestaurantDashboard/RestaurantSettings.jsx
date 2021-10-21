/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Avatar } from 'baseui/avatar';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';
import { FormControl } from 'baseui/form-control';
import { FileUploader } from 'baseui/file-uploader';
import { Input, MaskedInput } from 'baseui/input';
import { Select } from 'baseui/select';
import { useStyletron } from 'baseui';
import { Alert } from 'baseui/icon';
import { uploadFile } from 'react-s3';
import { Spinner } from 'baseui/spinner';
import { TimePicker } from 'baseui/timepicker';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';

import axiosInstance from '../../services/apiConfig';
import {
  updateRestaurantFailure,
  updateRestaurantRequest,
  updateRestaurantSuccess,
} from '../../actions/restaurant';

const { Carousel } = require('react-responsive-carousel');

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

function RestaurantSettings() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [emailId, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [restType, setRestType] = useState([]);
  const [deliveryType, setDeliveryType] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [restImages, setRestImages] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [contactNoBlurFlag, setcontactNoBlurFlag] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contactNoBlurFlag && !contactNoRegex.test(contactNo)) {
      toast.error('Enter valid contact number!');
      return;
    }
    const restTypes = [];
    console.log(restType);
    restType.forEach((ele) => {
      restTypes.push(ele.restType);
    });
    try {
      dispatch(updateRestaurantRequest());
      const restObj = {
        name,
        emailId,
        description,
        contactNo,
        restType: restTypes,
        deliveryType: deliveryType[0].deliveryType,
        address,
        city: city[0].city,
        state: state.state,
        startTime,
        endTime,
      };
      checkProperties(restObj);
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.put(
        `restaurants/${decoded.id}`,
        restObj,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(updateRestaurantSuccess(response));
      toast.success('Restaurant details updated!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
          return;
        }
        dispatch(updateRestaurantFailure(error.response.data.error));
        toast.error(error.response.data.error);
      }
    }
  };

  const fetchRestaurantData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`/restaurants/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setName(response.data.rest.name);
      setEmail(response.data.rest.emailId);
      setDescription(
        response.data.rest.description ? response.data.rest.description : '',
      );
      setcontactNo(
        response.data.rest.contactNo ? response.data.rest.contactNo : '',
      );
      const restTypes = [];
      if (response.data.rest.restType) {
        response.data.rest.restType.forEach((ele) => {
          restTypes.push({ restType: ele });
        });
      }
      setRestType(restTypes);
      setDeliveryType(
        response.data.rest.deliveryType
          ? [{ deliveryType: response.data.rest.deliveryType }]
          : [],
      );
      setAddress(response.data.rest.address ? response.data.rest.address : '');
      setCity(
        response.data.rest.city ? [{ city: response.data.rest.city }] : [],
      );
      setState(
        response.data.rest.state ? [{ state: response.data.rest.state }] : [],
      );
      setStartTime(
        response.data.rest.startTime
          ? new Date(response.data.rest.startTime)
          : '',
      );
      setEndTime(
        response.data.rest.endTime ? new Date(response.data.rest.endTime) : '',
      );
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
    }
  }, []);

  const getRestaurantImages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      const response = await axiosInstance.get(
        `restaurants/${decoded.id}/images`,
        {
          headers: { Authorization: token },
        },
      );
      setRestImages(response.data.restImages);
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
          return;
        }
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
        try {
          dispatch(updateRestaurantRequest());
          const restObj = {
            imageLink: data.location,
          };
          checkProperties(restObj);
          const token = sessionStorage.getItem('token');
          const decoded = jwt_decode(token);
          const response = await axiosInstance.post(
            `restaurants/${decoded.id}/images`,
            restObj,
            {
              headers: { Authorization: token },
            },
          );
          dispatch(updateRestaurantSuccess(response));
          toast.success('Image uploaded!');
          setIsUploading(false);
          setModalIsOpen(false);
          getRestaurantImages();
        } catch (error) {
          if (error.hasOwnProperty('response')) {
            if (error.response.status === 403) {
              toast.error('Session expired. Please login again!');
              history.push('/login/restaurant');
              return;
            }
            setIsUploading(false);
            dispatch(updateRestaurantFailure(error.response.data.error));
            toast.error(error.response.data.error);
          }
        }
      })
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    getRestaurantImages();
    fetchRestaurantData();
  }, []);

  const deleteRestaurantProfilePicture = async (restImageId) => {
    try {
      const token = sessionStorage.getItem('token');
      const decoded = jwt_decode(token);
      await axiosInstance.delete(
        `restaurants/${decoded.id}/images/${restImageId}`,
        {
          headers: { Authorization: token },
        },
      );
      toast.success('Image deleted!');
      getRestaurantImages();
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
          return;
        }
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <>
      <Modal onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}>
        <ModalHeader>Upload profile picture</ModalHeader>
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
      <Container fluid>
        <div style={{ marginLeft: '15px', marginTop: '25px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {isUploading ? (
                <Spinner />
              ) : (
                <Carousel
                  dynamicHeight
                  width="500px"
                  showIndicators
                  showThumbs={false}
                >
                  {restImages ? (
                    restImages.map((ele) => (
                      <div
                        key={ele.restImageId}
                        id={ele.restImageId}
                        onClick={(e) =>
                          deleteRestaurantProfilePicture(e.target.id)
                        }
                      >
                        <img src={ele.imageLink} alt="Restaurant profile" />
                      </div>
                    ))
                  ) : (
                    <div>
                      <Avatar
                        overrides={{
                          Avatar: {
                            style: ({ $theme }) => ({
                              borderTopLeftRadius: $theme.borders.radius100,
                              borderTopRightRadius: $theme.borders.radius100,
                              borderBottomRightRadius: $theme.borders.radius100,
                              borderBottomLeftRadius: $theme.borders.radius100,
                            }),
                          },
                          Root: {
                            style: ({ $theme }) => ({
                              borderTopLeftRadius: $theme.borders.radius100,
                              borderTopRightRadius: $theme.borders.radius100,
                              borderBottomRightRadius: $theme.borders.radius100,
                              borderBottomLeftRadius: $theme.borders.radius100,
                            }),
                          },
                        }}
                        name="user name #3"
                        size="300px"
                        src={restImages} // width = 285
                      />
                    </div>
                  )}
                </Carousel>
              )}
              <div style={{ marginTop: '25px' }}>
                {restImages?.length > 0 ? (
                  <p>Click on image to delete it</p>
                ) : null}
                <ButtonContainer>
                  <ButtonRow>
                    <ButtonMod
                      type="submit"
                      style={{ width: '100%' }}
                      onClick={() => setModalIsOpen(true)}
                    >
                      Upload new profile picture
                    </ButtonMod>
                  </ButtonRow>
                </ButtonContainer>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-5px',
                marginLeft: '35px',
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{ marginTop: '30px' }}
                className="widthDiv"
              >
                <h5>Update details below</h5>
                <div style={{ marginTop: '40px' }}>
                  <FormControl label="Restaurant Name">
                    <Input
                      id="name"
                      autoComplete="off"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl label="Email address">
                    <Input
                      disabled
                      id="emailId"
                      autoComplete="off"
                      value={emailId}
                    />
                  </FormControl>

                  <FormControl label="Description">
                    <Input
                      id="description"
                      autoComplete="off"
                      placeholder="Enter Restaurant description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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

                  <FormControl label="Delivery Type">
                    <Select
                      options={[
                        { deliveryType: 'Pickup' },
                        { deliveryType: 'Delivery' },
                        { deliveryType: 'Both' },
                      ]}
                      valueKey="deliveryType"
                      labelKey="deliveryType"
                      onChange={({ value }) => setDeliveryType(value)}
                      value={deliveryType}
                    />
                  </FormControl>

                  <FormControl label="Restaurant Type">
                    <Select
                      multi
                      options={[
                        { restType: 'Veg' },
                        { restType: 'Non-veg' },
                        { restType: 'Vegan' },
                      ]}
                      valueKey="restType"
                      labelKey="restType"
                      onChange={({ value }) => setRestType(value)}
                      value={restType}
                    />
                  </FormControl>

                  <FormControl label="Address">
                    <Input
                      id="address"
                      autoComplete="off"
                      placeholder="Enter Restaurant address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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

                  <FormControl label="Restaurant start time">
                    <TimePicker
                      value={startTime}
                      onChange={(date) => setStartTime(date)}
                      step={1800}
                      // minTime={new Date('2021-09-28T07:00:00.000Z')}
                    />
                  </FormControl>

                  <FormControl label="Restaurant end time">
                    <TimePicker
                      value={endTime}
                      onChange={(date) => setEndTime(date)}
                      step={1800}
                      // minTime={new Date('2021-09-28T07:00:00.000Z')}
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
          </div>
        </div>
      </Container>
    </>
  );
}

export default RestaurantSettings;
