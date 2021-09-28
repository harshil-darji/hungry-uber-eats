/* eslint-disable operator-linebreak */
/* eslint-disable */
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
  const [restData, setRestData] = useState({ rest: null });

  const [name, setname] = useState('');
  const [emailId, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [contactNo, setcontactNo] = useState('');
  const [restType, setRestType] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [profileImg, setProfileImg] = useState(
    'https://avatars.dicebear.com/api/human/override.svg?width=285&mood=happy',
  );
  const [isUploading, setIsUploading] = useState(false);
  // TODO: Use below as inputs for form
  // const [startTime, setStartTime] = useState('');
  // const [endTime, setEndTIme] = useState('');
  // TODO: Add code for updating profile pic

  const [contactNoBlurFlag, setcontactNoBlurFlag] = useState(false);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const contactNoRegex = /^\([\d]{3}\) [\d]{3}-[\d]{4}$/;

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
        address,
        city,
        state,
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
          // history.push('/login/restaurant');
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
      setRestData({ rest: response.data.rest });
      setname(response.data.rest.name);
      setEmail(response.data.rest.emailId);
      setDescription(
        response.data.rest.description ? response.data.rest.description : '',
      );
      setcontactNo(
        response.data.rest.contactNo ? response.data.rest.contactNo : '',
      );
      setProfileImg(
        response.data.rest.profileImg
          ? response.data.rest.profileImg
          : profileImg,
      );
      setRestType(response.data.rest.restaurantTypes);
      setAddress(response.data.rest.address ? response.data.rest.address : '');
      setCity(response.data.rest.city ? response.data.rest.city : '');
      setState(response.data.rest.state ? response.data.rest.state : '');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
    }
  }, []);

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
        console.log(data);
        setProfileImg(data.location);
        try {
          dispatch(updateRestaurantRequest());
          const restObj = {
            profileImg: data.location,
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
          toast.success('Image uploaded!');
          setIsUploading(false);
        } catch (error) {
          if (error.hasOwnProperty('response')) {
            if (error.response.status === 403) {
              toast.error('Session expired. Please login again!');
              // history.push('/login/restaurant');
            }
            console.log(error);
            setIsUploading(false);
            dispatch(updateRestaurantFailure(error.response.data.error));
            toast.error(error.response.data.error);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  return (
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
                src={profileImg} // width = 285
              />
            )}
            {profileImg ===
            'https://avatars.dicebear.com/api/human/override.svg?width=285&mood=happy' ? (
              <div style={{ marginTop: '20px' }}>
                <FileUploader
                  onCancel={() => setIsUploading(false)}
                  onDrop={(acceptedFiles) => {
                    uploadFileAndUpdateTable(acceptedFiles);
                  }}
                  progressMessage={
                    isUploading ? 'Uploading... hang tight.' : ''
                  }
                />
              </div>
            ) : (
              <>
                <div style={{ marginTop: '25px' }}>
                  <ButtonContainer>
                    <ButtonRow>
                      <ButtonMod
                        type="submit"
                        style={{ width: '100%' }}
                        onClick={() => setModalIsOpen(true)}
                      >
                        Upload new picture
                      </ButtonMod>
                    </ButtonRow>
                  </ButtonContainer>
                </div>
                <Modal
                  onClose={() => setModalIsOpen(false)}
                  isOpen={modalIsOpen}
                >
                  <ModalHeader>Upload new profile picture</ModalHeader>
                  <ModalBody>
                    <FileUploader
                      onCancel={() => {
                        setIsUploading(false);
                        setModalIsOpen(false);
                      }}
                      onDrop={(acceptedFiles) => {
                        uploadFileAndUpdateTable(acceptedFiles);
                        setModalIsOpen(false);
                      }}
                      progressMessage={
                        isUploading ? 'Uploading... hang tight.' : ''
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <ModalButton
                      kind="tertiary"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Cancel
                    </ModalButton>
                    <ModalButton onClick={() => setModalIsOpen(false)}>
                      Upload
                    </ModalButton>
                  </ModalFooter>
                </Modal>
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '-5px',
              marginLeft: '35px',
            }}
          >
            <h1 style={{ fontWeight: 'bolder' }}>Update restaurant details</h1>
            {/* <h1 style={{ fontWeight: 'bolder' }}>{restData.rest?.name}</h1> */}
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
                    onChange={(e) => setname(e.target.value)}
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

                <FormControl label="Restaurant Type">
                  <Select
                    creatable
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
                  <Input
                    id="city"
                    autoComplete="off"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormControl>

                <FormControl label="State">
                  <Input
                    id="state"
                    autoComplete="off"
                    placeholder="Enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
        </div>
      </div>
    </Container>
  );
}

export default RestaurantSettings;
