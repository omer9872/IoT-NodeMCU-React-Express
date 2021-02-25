# IoT-NodeMCU-React-Express-
IoT project that contains ReactJS to fetch and show data and ExpressJS to handle http requests.


Let's divide project into the three parts:

- Arduino Section

- ExpressJS Section

- ReactJS Section


# Arduino Section
With NodeMCU collected datas (which are listed below) will be posted to Express server 
  - Temperature
  - Humidity
  - Methane Value
  - Motion 

and here is our circuit(pinouts available in .ino file)

![alt text](https://github.com/omer9872/IoT-NodeMCU-React-Express/blob/main/photos/a1.jpg)


# ExpressJS Section
ExpressJS section handles incoming request from each circuit.

In this project ExpressJS will provide API.

# ReactJS Section
ReactJS section will be available on front side of project and people will interact with UI to fetch datas or update any values on screen.

Here are some photos from React App(Each component boxed)

- This is how main page looks when user request page:

  ![alt text](https://github.com/omer9872/IoT-NodeMCU-React-Express/blob/main/photos/fe2.png)

- After user searched for a device id if device founds then it shows this components:

  ![alt text](https://github.com/omer9872/IoT-NodeMCU-React-Express/blob/main/photos/fe3.png)

- User can filter data dates with this bar.

  ![alt text](https://github.com/omer9872/IoT-NodeMCU-React-Express/blob/main/photos/fe4.png)

- And user also can see datas with this plot.

  ![alt text](https://github.com/omer9872/IoT-NodeMCU-React-Express/blob/main/photos/fe5.png)
