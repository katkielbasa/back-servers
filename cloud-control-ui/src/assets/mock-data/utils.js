const cavespaceExplorationOrganization = require('./organizations/cavespaceExploration');
const midnightIntelligenceOrganization = require('./organizations/midnightIntelligence');
const fjordLightingOrganization = require('./organizations/fjordLighting');

const allOrganizations = [ cavespaceExplorationOrganization, midnightIntelligenceOrganization, fjordLightingOrganization ];


module.exports = {
    getAllOrganizations: function () {
        return allOrganizations;
    },
    getServer: function ( orgId, serverId ) {
        const result = allOrganizations.filter(organization => organization.id.toLowerCase() === orgId);
        const organization = result[ 0 ];

        return organization.server.filter(server => server.id === serverId);
    }
    ,
    getOrganization: function ( orgId ) {
        return allOrganizations.filter(organization => organization.id.toLowerCase() === orgId.toLowerCase());
    }
    ,
    removeServer: function ( organization, serverId ) {
        return organization.server.filter(server => server.id !== serverId);
    }
    ,
    sendErrorReponse: function ( response, statusCode, message ) {
        return response.status(statusCode).json({message: message});
    }
    ,
    serverDoesNotExistsForOrganization: function ( orgId, serverId ) {
        const organizations = this.getOrganization(orgId);

        return (organizations.length === 0) || organizations[ 0 ].server.filter(server => server.id === serverId).length <= 0;
    }
    ,
    buildListServersResponsePayload: function ( organization ) {
        return {
            organizationId: organization.id,
            organizationName: organization.name,
            totalServerCount: organization.server.length,
            server: organization.server
        };
    }
    ,
    buildServer: function ( request ) {
        return {
            id: request.body.id,
            name: request.body.name,
            description: request.body.description,
            cpu: {
                count: request.body.count,
                speed: request.body.speed,
                coresPerSocket: request.body.coresPerSocket
            },
            memoryGb: request.body.memoryGb,
            network: {
                id: request.body.network.id,
                privateIpv4: request.body.network.privateIpv4,
                vlanId: request.body.network.vlanId,
                vlanName: request.body.network.vlanName
            },
            createTime: request.body.createTime,
            deployed: request.body.deployed,
            started: request.body.started,
            state: request.body.started
        };
    }
};
