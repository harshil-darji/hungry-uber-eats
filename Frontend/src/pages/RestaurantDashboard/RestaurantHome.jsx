/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
// import { Avatar } from 'baseui/avatar';
import '../../../node_modules/react-responsive-carousel/lib/styles/carousel.css';

import axiosInstance from '../../services/apiConfig';
import RestaurantDishes from './RestaurantDishes';

const { Carousel } = require('react-responsive-carousel');

function RestaurantHome() {
  const history = useHistory();
  const [restData, setRestData] = useState({ rest: null });
  const [restImages, setRestImages] = useState(null);

  const fetchRestaurantData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`/restaurants/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setRestData({ rest: response.data.rest });
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
          // history.push('/login/restaurant');
        }
        toast.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    getRestaurantImages();
    fetchRestaurantData();
  }, []);

  return (
    <div style={{ marginLeft: '25px', marginTop: '25px' }}>
      {/* Restaurant Avatar, Title and address div */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Carousel dynamicHeight width="500px" showIndicators showThumbs={false}>
          {
            restImages
              ? restImages.map((ele) => (
                  <div key={ele.restImageId}>
                    <img src={ele.imageLink} alt="Restaurant profile" />
                  </div>
                ))
              : null
            // <Avatar
            //   overrides={{
            //     Avatar: {
            //       style: ({ $theme }) => ({
            //         borderTopLeftRadius: $theme.borders.radius100,
            //         borderTopRightRadius: $theme.borders.radius100,
            //         borderBottomRightRadius: $theme.borders.radius100,
            //         borderBottomLeftRadius: $theme.borders.radius100,
            //       }),
            //     },
            //     Root: {
            //       style: ({ $theme }) => ({
            //         borderTopLeftRadius: $theme.borders.radius100,
            //         borderTopRightRadius: $theme.borders.radius100,
            //         borderBottomRightRadius: $theme.borders.radius100,
            //         borderBottomLeftRadius: $theme.borders.radius100,
            //       }),
            //     },
            //   }}
            //   name="user name #3"
            //   size="318px"
            //   src="https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy"
            // />
          }
        </Carousel>
        {/* Restaurant Avatar */}
        {/* Restaurant Title and address div */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '35px',
            marginTop: '-5px',
          }}
        >
          <h1 style={{ fontWeight: 'bolder' }}>{restData.rest?.name}</h1>
          {restData.rest?.address ? (
            <div style={{ display: 'flex' }}>
              <i
                className="fa fa-map-marker"
                aria-hidden="true"
                style={{ fontSize: '1.2em', marginTop: -2 }}
              />
              <h6 style={{ marginBottom: 0, fontSize: '1.2em' }}>
                {restData.rest?.address}
              </h6>
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <i
                className="fa fa-map-marker"
                aria-hidden="true"
                style={{ fontSize: '1.2em', marginTop: 2, color: 'grey' }}
              />
              <h6 style={{ marginBottom: 0, fontSize: '1.2em', color: 'grey' }}>
                Please input address
              </h6>
            </div>
          )}
          {/* {profileImg ===
          'https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy' ? (
            <h5 style={{ marginTop: '10px' }}>
              Update restaurant details in settings
            </h5>
          ) : null} */}
        </div>
      </div>
      <hr />
      <h1>Dishes</h1>
      <RestaurantDishes />
    </div>
  );
}

export default RestaurantHome;
