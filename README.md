# Hungry? UberEats

## [YouTube Link](https://www.youtube.com/watch?v=jzNE0T6mr6k)

UberEats is a food delivery platoform built using the MERN stack, facilitating both customers and restaurants. New users could create restaurants or food seekers can browse restaurants to deliver food! After creating an account, users can browse restaurants by location, by food type, by delivery type or by searching dish names. Customers can add dishes to cart, create an order to a restaurants. These orders could be allowed to be picked up or delivered by the restaurant. Restaurants have the capability to update the order status for each customer and view all customer orders through various filters. 

Token based authentication is configured in the backend. The application is configured with message queue middleware to handle large number of concurrent requests made to the server.

To start the application, ```.env``` files have to be created within each folder. These files should include parameters as listed below:

* Backend/.env
  * TOKEN_SECRET
  * MONGO_URI
  * MONGO_TEST_URI

* Frontend/.env
  * TOKEN_SECRET
  * REACT_APP_S3_BUCKET_NAME
  * REACT_APP_ACCESS_KEY
  * REACT_APP_SECRET_ACCESS_KEY

* kafka-backend/.env
  * TOKEN_SECRET
  * MONGO_URI

The TOKEN_SECRET has to be a randomly generated string of characters used for JWT authentication. The MONGO_URI is the URI for MongoDB cloud cluster. The Frontend folder env file consists of AWS S3 credentials where the images of the folder could be uploaded. 

After setting this up, run ```npm i``` in each of the folders. Later start the backend, kafka-backend and frontend in order. You can access the application in your browser at port 3000 on your localhost.
