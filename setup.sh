#!/bin/bash

# Ensure npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install Node.js and npm first."
    exit
fi

# Install create-react-app if not installed
if ! command -v create-react-app &> /dev/null
then
    echo "Installing create-react-app..."
    npm install -g create-react-app
fi

# Create a new React app if not already created
if [ ! -d "node_modules" ]; then
    echo "Creating new React app..."
    npx create-react-app .
else
    echo "React app already exists. Skipping creation."
fi

# Install required dependencies
echo "Installing required dependencies..."
npm install react-markdown

# Create the components directory if it does not exist
if [ ! -d "src/components" ]; then
    mkdir -p src/components
fi

echo "Setup complete. You can now run your React application using 'npm start'."