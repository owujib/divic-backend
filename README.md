# Divic Backend
This is a GraphQL authentication service using NestJS. It includes features like biometric login setup, user registration, and login.
 
## Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose

## Setup

1. **Clone the repository:**  

```bash
  #clone project from https://github.com/owujib/divic-backend 

  cd divic-backend

  #run installation 
  npm install

```
**Rename .env-sample to .env* and .env.test.local-sample to .env.test.local**

2. **Build the Docker Images and Start Containers**

    Use Docker Compose to build the images and start the containers:

    ```bash
    docker-compose up -d
    ```

    This command will:
    - Build the Docker images for your application.
    - Start the application and database containers.
    - The application will be available at `http://localhost:3000/graphql`
      

3. **Running Tests with Docker**

    Ensure you connect using the connection string in the env file and creat the `test_db` and the `main_db` database

    ```bash
      npm run test
    ```

4. **GraphQL Mutations & Queries**
    This project provides several GraphQL mutations and queries to handle user authentication, biometric login setup, and retrieving user details. Below is a description of each mutation and query, along with example usage.

    Mutations
      - Login 
          **Description**: Authenticates a user with their email and password, returning an access token if successful.
          ```graphql
              mutation {
                login(loginInput: {email: "owujibfavour@gmail.com", password: "password123"}) {
                  accessToken
                  error {
                    message
                  }
                }
              }
          ```
      - Register
        **Description**: Registers a new user with an email and password, returning the user's details if successful.
        ```graphql
            mutation {
              register(registerInput: {email: "owujibfavours@gmail.com", password: "password123"}) {
                user {
                  id
                  email
                  createdAt
                }
                error {
                  message
                }
              }
            }
        ```
      - Register
        **Description**: RDescription: Sets up biometric login for a user by accepting a `biometricKey`. Returns a success message if the setup is successful.
        ```graphql
            mutation {
              setBiometricLogin(biometricInput: {biometricKey: "1223"}) {
                message
                error {
                  message
                }
              }
            }
        ```
      - Register
        **Description**: Authenticates a user using biometric data and returns an access token if successful.
        ```graphql
            mutation {
              biometricLogin(biometricInput: {biometricKey: "1223"}) {
                accessToken
                error {
                  message
                  code
                }
              }
            }
        ```