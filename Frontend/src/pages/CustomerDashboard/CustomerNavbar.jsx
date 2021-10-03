/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line object-curly-newline
import React, { useCallback, useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
// import { StyledLink } from 'baseui/link';
import { Layer } from 'baseui/layer';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
// eslint-disable-next-line object-curly-newline
import { ChevronDown, Delete, Upload, Overflow } from 'baseui/icon';
import { AppNavBar, setItemActive } from 'baseui/app-nav-bar';
import { Row } from 'react-bootstrap';
import Menu from 'baseui/icon/menu';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';

import axiosInstance from '../../services/apiConfig';

import UberEatsSvg from '../../components/UberEatsSvg';
import { logoutCustomer } from '../../actions/customer';

export default function CustomerNavbar() {
  const [css] = useStyletron();
  const [mainItems, setMainItems] = useState([
    { icon: Upload, label: 'Primary A' },
    { icon: Upload, label: 'Primary B' },
    {
      icon: ChevronDown,
      label: 'Primary C',
      navExitIcon: Delete,
      children: [
        { icon: Upload, label: 'Secondary A' },
        { icon: Upload, label: 'Secondary B' },
        { icon: Upload, label: 'Secondary C' },
        { icon: Upload, label: 'Secondary D' },
      ],
    },
    {
      icon: ChevronDown,
      label: 'Primary D',
      navExitIcon: Delete,
      children: [
        {
          icon: ChevronDown,
          label: 'Secondary E',
          children: [
            { icon: Upload, label: 'Tertiary A' },
            { icon: Upload, label: 'Tertiary B' },
          ],
        },
        { icon: Upload, label: 'Secondary F' },
      ],
    },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [userItems, setUserItems] = useState([
    { icon: Overflow, label: 'Sign out' },
  ]);
  const [userDetails, setUserDetails] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const navLogoItems = (
    <Row
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '15vw',
      }}
    >
      <Menu size={32} />
      <UberEatsSvg />
    </Row>
  );

  function handleMainItemSelect(item) {
    setMainItems((prev) => setItemActive(prev, item));
  }

  const fetchCustomerData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const decoded = jwt_decode(token);
    try {
      const response = await axiosInstance.get(`customers/${decoded.id}`, {
        headers: { Authorization: token },
      });
      setUserDetails(response.data.user);
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

  return (
    <>
      <Layer>
        <div
          className={css({
            boxSizing: 'border-box',
            width: '100vw',
            position: 'fixed',
            top: '0',
            left: '0',
          })}
        >
          <AppNavBar
            title={navLogoItems}
            mainItems={mainItems}
            userItems={userItems}
            onMainItemSelect={handleMainItemSelect}
            onUserItemSelect={(item) => {
              console.log(item);
              if (item.label === 'Sign out') {
                console.log('bruhehehehe');
                dispatch(logoutCustomer());
                history.push('/');
              }
            }}
            username={userDetails?.name ? userDetails?.name : ''}
            usernameSubtitle="5.0"
            userImgUrl=""
          />
        </div>
      </Layer>
    </>
  );
}
