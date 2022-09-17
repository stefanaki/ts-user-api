# User Authentication REST API

A complete user authentication and registration service built with TypeScript, using the best practices.

---

## Functionality

### User
- Register a user, and verify them using e-mail verification
- Reset a user's password, after a "forgot password" request has been made
- Get the data of the currently logged-in user

### Session

- Log-in a user by giving the an access token
- Revalidate a user's access token using a refresh token

## Tools and Libraries

- Node.js, TypeScript, Express for the HTTP server
- Typegoose for strongly-typed data modeling
- Zod for validating the request input and strongly-typing it
- Pino for console logging
- JSON Web Token for creating access and refresh tokens
- Nodemailer for sending verification and reset password e-mails to the user
- Docker for containerization

## Installation

Use docker-compose to start the MongoDB server and node to install and run the application.