import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Main = (props) => {
  const { title, description, children } = props;
  return (
    <HelmetProvider>
      <Helmet
        titleTemplate="%s"
        defaultTitle="Uber Eats | Food Delivery and Takeout | Order Online from Restaurants Near You"
        defer={false}
      >
        {title && <title>{title}</title>}
        <meta name="description" content={description} />
      </Helmet>
      <div id="wrapper">
        <Navbar />
        <div id="main">{children}</div>
      </div>
    </HelmetProvider>
  );
};

export default Main;
