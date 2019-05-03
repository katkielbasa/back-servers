# Node and npm versions
Below are the versions of node the backend-server.js has been built with - ensure similar versions are used
when running the backend-server.js locally.

 ```
node -v
v10.15.3

npm -v
6.4.1
 ```

# Install node 
Need to install Node and NPM via https://nodejs.org/en/download/

Verify Node and NPM are available on command path after installing from https://nodejs.org/en/download/
```
node -v
npm -v
```

# Install npm dependencies
```
cd $PROJECT_HOME
npm install
```

# Start backend-server API
```
cd $PROJECT_HOME
node src/assets/mock-data/backend-server.js     // URL is http://localhost:3040
```


# Postman collection for testing backend-server API
```
https://www.getpostman.com/collections/9bcf436e20c244d57d71
```

# JSON Schemas for adding and editing servers
The JSON schema for adding a server is defined in ``` $PROJECT_HOME\cloud-control-ui\src\assets\mock-data\schemas\add-server-schema.json  ```

The JSON schema for adding a server is defined in ``` $PROJECT_HOME\cloud-control-ui\src\assets\mock-data\schemas\edit-server-schema.json  ```
