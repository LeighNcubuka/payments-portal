International Payments Portal
A robust web application designed for international payment processing, built with a React frontend and a Node.js backend. This portal provides a seamless experience for customers to register, log in, submit payments, and for employees to verify transactions, all secured with HTTPS.
Setup Instructions
Prerequisites

Node.js and npm installed (Node version 20.x recommended)
OpenSSL (for generating SSL certificates)

Backend

Navigate to the backend directory:cd backend


Install dependencies:npm install


Start the backend:node server.js

The backend runs on https://localhost:5000.

Frontend

Navigate to the frontend directory:cd frontend


Install dependencies:npm install


Start the frontend:npm start

The frontend runs on https://localhost:3000.

SSL Configuration

The application uses a self-signed SSL certificate for local HTTPS. Certificates (cert.pem and key.pem) are generated and placed in the project root.
For production, a trusted Certificate Authority (e.g., Let’s Encrypt) should be used.

CircleCI

The project is integrated with CircleCI for automated builds and tests.
The configuration file (.circleci/config.yml) orchestrates the build and test processes for both frontend and backend, ensuring continuous integration.
Pipeline results can be viewed on the CircleCI dashboard.

SonarQube

SonarQube is integrated for continuous code quality inspection, analyzing the frontend and backend for bugs, vulnerabilities, and code smells.
The setup includes a local SonarQube server and scanner configuration, with results accessible at http://localhost:9000 when the server is running.
For production, SonarQube is planned to be hosted on a public server (e.g., AWS EC2).

Features

Unified Login: Secure login for both customers and employees.
Customer Registration: Users can register and manage their accounts.
Payment Submission: Customers can submit international payments.
Employee Dashboard: Employees can log in to verify and manage transactions.
HTTPS Security: End-to-end encryption with a self-signed certificate.

Project Structure
payments-portal/
├── frontend/
│   ├── src/         # React application source code
│   ├── package.json # Frontend dependencies
│   └── ...
├── backend/
│   ├── server.js    # Node.js server
│   ├── package.json # Backend dependencies
│   └── ...
├── .circleci/
│   └── config.yml   # CircleCI configuration
├── sonar-project.properties # SonarQube configuration
├── cert.pem         # SSL certificate
├── key.pem          # SSL private key
└── README.md

Contributing
Feel free to fork this repository and submit pull requests. Ensure your code adheres to the project’s quality standards as analyzed by SonarQube.
License
This project is licensed under the MIT License - see the LICENSE file for details.
