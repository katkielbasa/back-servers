const express = require('express');
const bodyParser = require('body-parser');
const port = 3040;

const addServerJsonSchema = require('./schemas/add-server-schema');
const editServerJsonSchema = require('./schemas/edit-server-schema');
const utils = require('./utils');


const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;

const app = express();
app.use(bodyParser.json());

app.get('/', ( request, response ) => {
    console.info('Attempting to retrieve ALL organizations.');
    response.json({organizations: utils.getAllOrganizations()});
});

app.get('/:orgId/server', ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const organizationNotFoundErrorMessage = 'Organization id ' + orgId + ' not found.';

    console.info('Attempting to retrieve ALL servers for orgId ' + orgId + '.');

    const result = utils.getOrganization(orgId);

    if ( result.length !== 1 ) {
        return utils.sendErrorReponse(response, 404, organizationNotFoundErrorMessage);
    }

    const organization = result[ 0 ];
    return response.json(utils.buildListServersResponsePayload(organization));
});

app.get('/:orgId/server/:serverId', ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const serverId = request.params[ 'serverId' ].toLowerCase();
    const serverNotFoundErrorMessage = 'Server id ' + serverId + ' for Organization id ' + orgId + ' not found.';

    console.info('Attempting to retrieve server ' + serverId + ' for orgId ' + orgId + '.');

    if ( utils.serverDoesNotExistsForOrganization(orgId, serverId) ) {
        return utils.sendErrorReponse(response, 404, serverNotFoundErrorMessage);
    }

    const result = utils.getServer(orgId, serverId);
    const server = result[ 0 ];

    return response.json({server: server});
});


app.delete('/:orgId/server/:serverId', ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const serverId = request.params[ 'serverId' ].toLowerCase();
    const serverNotDeletedMessage = 'Unexpected error Server Id ' + serverId + ' for Organization Id ' + orgId + ' Not Deleted';
    const serverNotFoundErrorMessage = 'Server id ' + serverId + ' for Organization id ' + orgId + ' not found';

    console.info('Attempting to delete server ' + serverId + ' for orgId ' + orgId + '.');

    if ( utils.serverDoesNotExistsForOrganization(orgId, serverId) ) {
        return utils.sendErrorReponse(response, 404, serverNotFoundErrorMessage);
    }

    const organization = utils.getOrganization(orgId)[ 0 ];
    const filteredServers = utils.removeServer(organization, serverId);

    if ( filteredServers.length === organization.server.length ) {
        return utils.sendErrorReponse(response, 500, serverNotDeletedMessage);
    }

    organization.server = utils.removeServer(organization, serverId);
    return response.json({message: "Server Deleted"});
});

app.delete('/:orgId/server', ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const organizationNotFoundErrorMessage = 'Organization id ' + orgId + ' not found.';

    console.info('Attempting to delete ALL servers for orgId ' + orgId + '.');

    const result = utils.getOrganization(orgId);

    if ( result.length !== 1 ) {
        return sendErrorReponse(response, 404, organizationNotFoundErrorMessage);
    }

    const organization = result[ 0 ];
    organization.server = [];
    return response.json({message: 'All servers deleted.'});
});


app.post('/:orgId/server', validate({body: addServerJsonSchema}), ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const organizationNotFoundErrorMessage = 'Organization id ' + orgId + ' not found.';

    console.info('Attempting to add server for orgId ' + orgId + ' with payload: ' + request.body);

    const organizations = utils.getOrganization(orgId);

    if ( organizations.length !== 1 ) {
        return utils.sendErrorReponse(response, 404, organizationNotFoundErrorMessage);
    }

    if ( !utils.serverDoesNotExistsForOrganization(orgId, request.body.id) ) {
        const serverAlreadyExistsErrorMessage = 'Server id ' + request.body.id + ' for Organization id ' + orgId + ' already exists.';
        return utils.sendErrorReponse(response, 400, serverAlreadyExistsErrorMessage);
    }

    organizations[ 0 ].server.push(utils.buildServer(request));

    return response.json({message: 'Server added.'});
});


app.post('/:orgId/server/:serverId', validate({body: editServerJsonSchema}), ( request, response ) => {
    const orgId = request.params[ 'orgId' ].toLowerCase();
    const serverId = request.params[ 'serverId' ].toLowerCase();
    const serverNotFoundErrorMessage = 'Server id ' + serverId + ' for Organization id ' + orgId + ' not found';

    console.info('Attempting to edit server id ' + serverId + ' with payload: ' + request.body);

    if ( utils.serverDoesNotExistsForOrganization(orgId, serverId) ) {
        return utils.sendErrorReponse(response, 404, serverNotFoundErrorMessage);
    }

    const organizations = utils.getOrganization(orgId);
    const otherServers = organizations[ 0 ].server.filter(server => server.id !== serverId);

    const server = {
        id: serverId,
        name: request.body.name,
        description: request.body.description,
        cpu: request.body.cpu,
        memoryGb: request.body.memoryGb,
        network: request.body.network,
        createTime: request.body.createTime,
        deployed: request.body.deployed,
        started: request.body.started,
        state: request.body.state
    };

    organizations[ 0 ].server = otherServers;
    organizations[ 0 ].server.push(server);

    return response.json({message: 'Server edited.'});
});


// Error handler for validation errors
app.use(( err, req, res, next ) => {
    if ( err instanceof ValidationError ) {
        res.status(400).send(err.validationErrors.body);
        next();
    } else {
        next(err);
    } // pass error on if not a validation error
});

app.listen(port, function () {
    console.info('backend-server for cloud-control-ui app is running on port: ',port);
});
