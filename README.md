# Hungry? UberEats

## [YouTube Link](https://www.youtube.com/watch?v=jzNE0T6mr6k)

UberEats is a food delivery platoform built using the MERN stack, facilitating both customers and restaurants. New users could create restaurants or food seekers can browse restaurants to deliver food! After creating an account, users can browse restaurants by location, by food type, by delivery type or by searching dish names. Customers can add dishes to cart, create an order to a restaurants. These orders could be allowed to be picked up or delivered by the restaurant. Restaurants have the capability to update the order status for each customer and view all customer orders through various filters. 

Token based authentication is configured in the backend. The application is configured with message queue middleware to handle large number of concurrent requests made to the server.

![image](https://user-images.githubusercontent.com/41537302/146697153-b13c2051-ea00-43c4-9d97-2a9ec183d0aa.png)

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

## Screenshots

![Screenshot from 2021-10-10 23-51-56](https://user-images.githubusercontent.com/41537302/146697215-33382e93-eda4-4d6f-8018-fff83b559a13.png)
![Screenshot from 2021-10-10 23-52-20](https://user-images.githubusercontent.com/41537302/146697213-f1964744-175f-4115-9230-52445ab1768a.png)
![Screenshot from 2021-10-10 23-52-34](https://user-images.githubusercontent.com/41537302/146697211-81b6a10a-21fb-402e-b435-d259cf827bfd.png)
![Screenshot from 2021-10-10 23-52-44](https://user-images.githubusercontent.com/41537302/146697210-7b7a143b-78b1-44d7-b8e0-efe15be2f1ea.png)
![Screenshot from 2021-10-10 23-52-59](https://user-images.githubusercontent.com/41537302/146697207-23148443-14ce-42d0-b6c5-9172f6f84778.png)
![Screenshot from 2021-10-10 23-53-10](https://user-images.githubusercontent.com/41537302/146697205-ac96dfee-baaf-47c4-9d5d-654d23972f8a.png)
![Screenshot from 2021-10-10 23-53-45](https://user-images.githubusercontent.com/41537302/146697204-19218771-b763-4e05-8aa9-b74fd6e27140.png)
![Screenshot from 2021-10-10 23-53-53](https://user-images.githubusercontent.com/41537302/146697203-3e7503c1-143e-493a-af22-00ec2120d416.png)
![Screenshot from 2021-10-10 23-54-00](https://user-images.githubusercontent.com/41537302/146697202-04afe617-0ef6-44f9-9f35-2a5e2f606de8.png)
![Screenshot from 2021-10-10 23-54-09](https://user-images.githubusercontent.com/41537302/146697201-cf0b80a8-7e6b-4ac3-8983-c6e1fbafbe4b.png)
