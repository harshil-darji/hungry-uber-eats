/* eslint-disable */
import React, { useState } from 'react';
import { uploadFile } from 'react-s3';
import Sidebar from '../../components/RestSidebar';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Route, withRouter } from 'react-router';
import '../../css/Sidebar.css';
import RestaurantHome from './RestaurantHome';

function RestaurantDashboard() {
  // const REGION = 'us-east-1';

  // const config = {
  //   bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  //   accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  //   secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  //   region: REGION,
  // };
  // const [selectedFile, setSelectedFile] = useState(null);

  // const handleFileInput = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };

  // const handleUpload = async (file) => {
  //   uploadFile(file, config)
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // };

  return (
    <Container fluid>
      <Row>
        <Col xs={2} id="sidebar-wrapper">
          <Sidebar />
        </Col>
        <Col xs={10} id="page-content-wrapper">
          <>
            <Route path="/" component={RestaurantHome} />
          </>
        </Col>
      </Row>
      asdasd
    </Container>
  );
}

export default RestaurantDashboard;
