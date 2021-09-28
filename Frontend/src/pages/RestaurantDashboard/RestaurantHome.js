/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import jwt_decode from 'jwt-decode';
import { Avatar } from 'baseui/avatar';

import axiosInstance from '../../services/apiConfig';
import RestaurantDish from './RestaurantDish';

function RestaurantHome() {
  const history = useHistory();
  const [restData, setRestData] = useState({ rest: null });
  console.log(restData);
  const [profileImg, setProfileImg] = useState(
    'https://avatars.dicebear.com/api/human/1.svg?width=285&mood=happy',
  );

  const fetchRestaurantData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`/restaurants/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setRestData({ rest: response.data.rest });
      setProfileImg(
        response.data.rest.profileImg
          ? response.data.rest.profileImg
          : profileImg,
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

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  return (
    <div style={{ marginLeft: '25px', marginTop: '25px' }}>
      {/* Restaurant Avatar, Title and address div */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {/* Restaurant Avatar */}
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
          src={profileImg}
        />
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
                style={{ fontSize: '1.2em', marginTop: 2 }}
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
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginTop: '25px',
        }}
      >
        <RestaurantDish />
      </div>
    </div>
  );
}

export default RestaurantHome;
