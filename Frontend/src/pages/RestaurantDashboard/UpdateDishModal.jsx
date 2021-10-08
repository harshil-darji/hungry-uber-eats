/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
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
import { Select, SIZE } from 'baseui/select';
import toast from 'react-hot-toast';
import jwt_decode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from 'react-s3';
import { Avatar } from 'baseui/avatar';
import { ThemeProvider, createTheme, lightThemePrimitives } from 'baseui';
import { Spinner } from 'baseui/spinner';

import axiosInstance from '../../services/apiConfig';
import {
  addDishImageFailure,
  addDishImageRequest,
  addDishImageSuccess,
  setDeleteDishFlag,
  setDishUpdateFlag,
} from '../../actions/dish';

const { Carousel } = require('react-responsive-carousel');

class ModalStateContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmationOpen: false,
    };
  }

  toggleConfirm = (open = !this.state.isConfirmationOpen, cb = () => {}) => {
    this.setState({ isConfirmationOpen: open }, cb);
  };

  render() {
    return this.props.children({
      isConfirmationOpen: this.state.isConfirmationOpen,
      toggleConfirm: this.toggleConfirm,
    });
  }
}

function UpdateDishModal(props) {
  // eslint-disable-next-line object-curly-newline
  const { modalIsOpen, setModalIsOpen, dishes, selectedDishId } = props;
  const history = useHistory();
  const dishesFromState = useSelector((state) => state.dish);

  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [category, setCategory] = useState([]);
  const [dishType, setDishType] = useState([]);

  const [filesToUpload, setFilesToUpload] = useState([]);

  const [dishImages, setDishImages] = useState(null);

  const dispatch = useDispatch();

  const REGION = 'us-east-1';
  const config = {
    bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: REGION,
  };

  const handleSubmit = async () => {
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
      let response = await axiosInstance.put(
        `restaurants/${decoded.id}/dishes/${selectedDishId}`,
        dishObj,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(setDishUpdateFlag(true));
      toast.success('Dish updated successfully!');
      const { dishId } = response.data.updatedDish;
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
                setFilesToUpload([]);
                toast.success('Dish images added!');
                setIsUploading(false);
              } catch (error) {
                if (error.hasOwnProperty('response')) {
                  if (error.response.status === 403) {
                    toast.error('Session expired. Please login again!');
                    // history.push('/login/restaurant');
                  }
                  setIsUploading(false);
                  dispatch(addDishImageFailure(error.response.data.error));
                  toast.error(error.response.data.error);
                }
              }
            })
            .catch((err) => {
              setIsUploading(false);
              toast.error(err);
            });
        });
      }
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
        setIsUploading(false);
        toast.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    if (dishes && selectedDishId) {
      let selectedDish = dishes.filter(
        (dish) => dish.dishId === selectedDishId,
      );
      if (selectedDish.length > 0) {
        [selectedDish] = selectedDish;
        setIsUploading(false);
        setName(selectedDish.name);
        setDescription(
          selectedDish.description ? selectedDish.description : '',
        );
        setDishPrice(selectedDish.dishPrice ? selectedDish.dishPrice : '');
        if (selectedDish.ingreds) {
          const ingredientsArr = selectedDish.ingreds.split(',');
          const selectedIngreds = ingredientsArr.map((element) => ({
            ingredients: element,
          }));
          const filteredIngreds = selectedIngreds.filter(
            (el) =>
              // eslint-disable-next-line implicit-arrow-linebreak
              el.ingredients !== undefined &&
              el.ingredients !== null &&
              el.ingredients !== '',
          );
          setIngredients(filteredIngreds);
        }
        setCategory(
          selectedDish.category ? [{ category: selectedDish.category }] : [],
        );
        setDishType(
          selectedDish.category ? [{ dishType: selectedDish.dishType }] : [],
        );
        setDishImages(selectedDish.dishImages ? selectedDish.dishImages : []);
      }
    }
  }, [selectedDishId, dishesFromState, dishes]);

  const deleteDish = async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      await axiosInstance.delete(
        `restaurants/${decoded.id}/dishes/${selectedDishId}`,
        {
          headers: { Authorization: token },
        },
      );
      dispatch(setDeleteDishFlag());
      toast.success('Dish deleted successfully!');
    } catch (error) {
      if (error.hasOwnProperty('response')) {
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!');
          history.push('/login/restaurant');
        }
      }
      toast.error(error.response.data.error);
    }
  };

  return (
    <ModalStateContainer>
      {({ isConfirmationOpen, toggleConfirm }) => (
        <>
          <Modal
            unstable_ModalBackdropScroll
            onClose={() => {
              setModalIsOpen(false);
            }}
            isOpen={modalIsOpen}
            overrides={{
              Dialog: {
                style: {
                  width: '40vw',
                  height: '93vh',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'fixed',
                },
              },
            }}
          >
            <ModalHeader>Update dish details</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={4}>
                  {isUploading ? (
                    <Spinner />
                  ) : (
                    <Carousel
                      dynamicHeight
                      showIndicators
                      showThumbs={false}
                      key={dishes}
                    >
                      {dishImages ? (
                        dishImages.map((ele) => (
                          <div key={ele.restImageId}>
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
                                  borderTopRightRadius:
                                    $theme.borders.radius100,
                                  borderBottomRightRadius:
                                    $theme.borders.radius100,
                                  borderBottomLeftRadius:
                                    $theme.borders.radius100,
                                }),
                              },
                              Root: {
                                style: ({ $theme }) => ({
                                  borderTopLeftRadius: $theme.borders.radius100,
                                  borderTopRightRadius:
                                    $theme.borders.radius100,
                                  borderBottomRightRadius:
                                    $theme.borders.radius100,
                                  borderBottomLeftRadius:
                                    $theme.borders.radius100,
                                }),
                              },
                            }}
                            name="user name #3"
                            size="300px"
                            src={dishImages} // width = 285
                          />
                        </div>
                      )}
                    </Carousel>
                  )}

                  <hr />
                  <FileUploader
                    onCancel={() => {
                      setIsUploading(false);
                      setFilesToUpload([]);
                    }}
                    onDrop={(acceptedFiles) => {
                      setFilesToUpload(acceptedFiles);
                      // setModalIsOpen(false);
                    }}
                    progressMessage={
                      isUploading ? 'Uploading... hang tight.' : ''
                    }
                  />
                  <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    Upload dish image
                  </p>
                  {filesToUpload.length > 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>
                      Images selected:
                      {filesToUpload.map((file) => (
                        // eslint-disable-next-line react/jsx-one-expression-per-line
                        <p key={file.name}>{file.name} </p>
                      ))}
                    </p>
                  ) : null}
                </Col>
                <Col>
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
                      size={SIZE.compact}
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
                      size={SIZE.compact}
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
                      size={SIZE.compact}
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
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <div style={{ position: 'absolute', float: 'left' }}>
                <ThemeProvider
                  theme={createTheme(lightThemePrimitives, {
                    colors: { buttonPrimaryFill: '#E73E33' },
                  })}
                >
                  <ModalButton onClick={() => toggleConfirm(true)}>
                    Delete Dish
                  </ModalButton>
                </ThemeProvider>
              </div>

              <ModalButton
                kind="tertiary"
                onClick={() => {
                  setName('');
                  setDescription('');
                  setDishPrice('');
                  setIngredients([]);
                  setCategory([]);
                  setDishType([]);
                  setFilesToUpload([]);
                  setModalIsOpen(false);
                }}
              >
                Cancel
              </ModalButton>

              <ModalButton onClick={handleSubmit} isLoading={isUploading}>
                Update
              </ModalButton>
            </ModalFooter>
          </Modal>
          <Modal
            onClose={() => toggleConfirm(false)}
            isOpen={isConfirmationOpen}
          >
            <ModalHeader>Confirm?</ModalHeader>
            <ModalBody>
              Are you sure you want to delete
              {` ${name}?`}
            </ModalBody>
            <ModalFooter>
              <ModalButton kind="tertiary" onClick={() => toggleConfirm(false)}>
                Cancel
              </ModalButton>
              <ThemeProvider
                theme={createTheme(lightThemePrimitives, {
                  colors: { buttonPrimaryFill: '#E73E33' },
                })}
              >
                <ModalButton
                  onClick={async () => {
                    toggleConfirm(false, () => setModalIsOpen(false));
                    deleteDish();
                  }}
                >
                  Delete
                </ModalButton>
              </ThemeProvider>
              {/* <ModalButton
                onClick={() => {
                  toggleConfirm(false, () => setModalIsOpen(false));
                }}
              >
                Yes
              </ModalButton> */}
            </ModalFooter>
          </Modal>
        </>
      )}
    </ModalStateContainer>
  );
}

export default UpdateDishModal;
