/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';
import { FileUploader } from 'baseui/file-uploader';
import { Col, Row } from 'react-bootstrap';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import toast from 'react-hot-toast';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { uploadFile } from 'react-s3';
import { useHistory } from 'react-router';

import axiosInstance from '../../services/apiConfig';
import {
  addDishImageFailure,
  addDishImageRequest,
  addDishImageSuccess,
  setDishUpdateFlag,
} from '../../actions/dish';

function AddDishModal(props) {
  const { modalIsOpen, setModalIsOpen } = props;

  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState([]);
  const [dishType, setDishType] = useState([]);

  const [filesToUpload, setFilesToUpload] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();

  const REGION = 'us-east-1';
  const config = {
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: REGION,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ingreds = '';
    ingredients.forEach((ele) => {
      ingreds += `${ele.ingredients},`;
    });
    try {
      const dishObj = {
        name,
        description,
        dishPrice: parseFloat(dishPrice),
        ingreds,
        category: category[0].category,
        dishType: dishType[0].dishType,
      };
      let token = sessionStorage.getItem('token');
      let decoded = jwt_decode(token);
      let response = await axiosInstance.post(
        `restaurants/${decoded.id}/dishes`,
        dishObj,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(setDishUpdateFlag(true));
      const { dishId } = response.data.newDish;
      if (filesToUpload.length > 0) {
        setIsUploading(true);
        await filesToUpload.forEach((file) => {
          dispatch(addDishImageRequest());
          uploadFile(file, config)
            .then(async (data) => {
              try {
                const dishImageObj = {
                  imageLink: data.location,
                };
                token = sessionStorage.getItem('token');
                decoded = jwt_decode(token);
                response = await axiosInstance.post(
                  `restaurants/${decoded.id}/dishes/${dishId}/images`,
                  dishImageObj,
                  {
                    headers: { Authorization: token },
                  },
                );
                dispatch(addDishImageSuccess(response.data.dishImage));
              } catch (error) {
                if (error.hasOwnProperty('response')) {
                  if (error.response.status === 403) {
                    toast.error('Session expired. Please login again!');
                    history.push('/login/restaurant');
                    return;
                  }
                  setIsUploading(false);
                  dispatch(addDishImageFailure(error.response.data.error));
                  toast.error(error.response.data.error);
                }
              }
            })
            .catch((err) => {
              toast.error(err);
            });
        });
        setIsUploading(false);
        setModalIsOpen(false);
        setName('');
        setDescription('');
        setDishPrice('');
        setIngredients([]);
        setCategory([]);
        setDishType([]);
        toast.success('Dish created successfully!');
      }
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

  // const uploadFileAndUpdateTable = (acceptedFiles) => {
  // setIsUploading(true);
  // uploadFile(acceptedFiles[0], config)
  //   .then(async (data) => {
  //     try {
  //       const restObj = {
  //         imageLink: data.location,
  //       };
  //       const token = sessionStorage.getItem('token');
  //       const decoded = jwt_decode(token);
  //       const response = await axiosInstance.post(
  //         `restaurants/${decoded.id}/images`,
  //         restObj,
  //         {
  //           headers: { Authorization: token },
  //         },
  //       );
  //       toast.success('Image uploaded!');
  //       setIsUploading(false);
  //       setModalIsOpen(false);
  //       getRestaurantImages();
  //     } catch (error) {
  //       if (error.hasOwnProperty('response')) {
  //         if (error.response.status === 403) {
  //           toast.error('Session expired. Please login again!');
  //           // history.push('/login/restaurant');
  //         }
  //         setIsUploading(false);
  //         dispatch(updateRestaurantFailure(error.response.data.error));
  //         toast.error(error.response.data.error);
  //       }
  //     }
  //   })
  //   .catch((err) => toast.error(err));
  // };

  return (
    <Modal
      unstable_ModalBackdropScroll
      onClose={() => setModalIsOpen(false)}
      isOpen={modalIsOpen}
      overrides={{
        Dialog: {
          style: {
            width: '40vw',
            height: '97vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
          },
        },
      }}
    >
      <ModalHeader>Add new dish details</ModalHeader>
      <ModalBody>
        <Row>
          <Col xs={4}>
            <FileUploader
              onCancel={() => {
                setIsUploading(false);
                setFilesToUpload([]);
              }}
              onDrop={(acceptedFiles) => {
                setFilesToUpload(acceptedFiles);
                // setModalIsOpen(false);
              }}
              progressMessage={isUploading ? 'Uploading... hang tight.' : ''}
            />
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              Upload dish image
            </p>
            {filesToUpload.length > 0 ? (
              <p style={{ textAlign: 'center', marginTop: '10px' }}>
                Images selected:{' '}
                {filesToUpload.map((file) => (
                  <p key={file.name}>{file.name} </p>
                ))}
              </p>
            ) : null}
          </Col>
          <Col>
            <form onSubmit={handleSubmit}>
              <FormControl label="Dish Name">
                <Input
                  required
                  id="name"
                  autoComplete="off"
                  placeholder="Enter dish name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl label="Dish Description">
                <Input
                  required
                  id="description"
                  autoComplete="off"
                  placeholder="Enter dish description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormControl label="Dish Price">
                <Input
                  required
                  startEnhancer="$"
                  id="dishPrice"
                  autoComplete="off"
                  placeholder="Enter dish price"
                  type="number"
                  value={dishPrice}
                  onChange={(e) => setDishPrice(e.target.value)}
                />
              </FormControl>
              <FormControl label="Add dish ingredients">
                <Select
                  placeholder="Type in your ingredients and press enter"
                  creatable
                  multi
                  options={[{ ingredients: 'Bread' }]}
                  valueKey="ingredients"
                  labelKey="ingredients"
                  onChange={({ value }) => setIngredients(value)}
                  value={ingredients}
                />
              </FormControl>
              <FormControl label="Dish Type">
                <Select
                  placeholder="Select dish type"
                  options={[
                    { dishType: 'Appetizer' },
                    { dishType: 'Beverage' },
                    { dishType: 'Dessert' },
                    { dishType: 'Main course' },
                    { dishType: 'Salad' },
                  ]}
                  valueKey="dishType"
                  labelKey="dishType"
                  onChange={({ value }) => setDishType(value)}
                  value={dishType}
                />
              </FormControl>
              <FormControl label="Dish Category">
                <Select
                  placeholder="Select dish category"
                  options={[
                    { category: 'Veg' },
                    { category: 'Non-veg' },
                    { category: 'Vegan' },
                  ]}
                  valueKey="category"
                  labelKey="category"
                  onChange={({ value }) => setCategory(value)}
                  value={category}
                />
              </FormControl>
            </form>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <ModalButton
          kind="tertiary"
          onClick={() => {
            setName('');
            setDescription('');
            setDishPrice('');
            setIngredients([]);
            setCategory([]);
            setDishType([]);
            setModalIsOpen(false);
          }}
        >
          Cancel
        </ModalButton>
        <ModalButton onClick={handleSubmit}>Create</ModalButton>
      </ModalFooter>
    </Modal>
  );
}

export default AddDishModal;
