# Support Backend Project

This project implements a Node.js service to meet the given criteria.
&nbsp;

## Postman Documentation

https://documenter.getpostman.com/view/17492278/2s93si1Vga

## Installation and Configuration

To install and configure the project's prerequisites and dependencies, please follow these steps:

1. Make sure you have Node.js and npm (Node Package Manager) installed on your machine.

2. Clone the project repository from GitHub:

```shell
  git clone https://github.com/zainaboyedeji/fincratest.git
```

3. Navigate to the project's root directory:
```shell
  cd fincratest
```
4. Install the required dependencies using npm:
```shell
  npm install
```

5. Create a .env file in the project's root directory and provide the necessary environment variables as specified in the .env.example file.

&nbsp;
&nbsp;
## Database Initialization

If the project requires a database, please follow these steps to create and initialize it:

1. Make sure you have MongoDB installed and running on your machine.

2. Update the MongoDB connection details in the `.env` file with your MongoDB configuration.

3. Check src/seed_data directory and import the collection into MongoDB database (https://www.mongodb.com/compatibility/json-to-mongodb)

4. The default admin username is `babaramon` and password is `password`
  

&nbsp;
&nbsp;

## Testing

```shell
  npm run test
```

&nbsp;
&nbsp;

## Running

To start the project locally, run

```shell
  npm run start:dev
```
&nbsp;
&nbsp;
## Assumptions

During the implementation of this project, the following assumptions were made:

1. The database connection details are already provided and the database is running.

2. The required environment variables specified in the `.env.example` file are properly configured.

&nbsp;
&nbsp;

## Requirements Not Covered

The following requirements have not been covered in this submission:

1. Some part of the tests were ommited due to time constraint
2. Logging was not implemented due to time constraint






