/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Table, SIZE } from 'baseui/table-semantic';
import { Display2 } from 'baseui/typography';

// eslint-disable-next-line camelcase
import axiosInstance from '../../services/apiConfig';
import customerDefaultImage from '../../assets/img/customer-default-profile.jpeg';

function CustomerProfile({ match }) {
  const [name, setName] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [profileImg, setProfileImg] = useState(customerDefaultImage);

  const fetchCustomerData = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axiosInstance.get(
        `customers/${match.params.custId}`,
        {
          headers: { Authorization: token },
        },
      );
      const { user } = response.data;
      setName(user.name);
      setProfileImg(user.profileImg ? user.profileImg : customerDefaultImage);
      // User details for table
      const tempUserArray = [];
      tempUserArray.push(['Email Address', user.emailId]);
      tempUserArray.push(['Contact Number', user.contactNo]);
      if (user.nickName) tempUserArray.push(['Nickname', user.nickName]);
      if (user.dob) {
        tempUserArray.push(['Date of birth', new Date(user.dob).toUTCString()]);
      }
      if (user.about) tempUserArray.push(['Nickname', user.about]);
      if (user.city) tempUserArray.push(['City', user.city]);
      if (user.state) tempUserArray.push(['Nickname', user.state]);
      if (user.country) tempUserArray.push(['Nickname', user.country]);
      setUserDetails(tempUserArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <Row>
      <Col xs={4}>
        <div style={{ marginTop: '30px', marginLeft: '30px' }}>
          <img
            src={profileImg || customerDefaultImage}
            alt="Customer profile"
          />
        </div>
      </Col>
      <Col>
        <div style={{ marginTop: '30px' }}>
          <Display2>{name || ''}</Display2>
          <Table columns={['', '']} data={userDetails} size={SIZE.spacious} />
        </div>
      </Col>
    </Row>
  );
}

export default CustomerProfile;
