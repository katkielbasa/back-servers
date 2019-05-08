const cavespaceExplorationOrganization = require('../../assets/organizations/cavespaceExploration');
const midnightIntelligenceOrganization = require('../../assets/organizations/midnightIntelligence');
const fjordLightingOrganization = require('../../assets/organizations/fjordLighting');

const allOrganizations = [ cavespaceExplorationOrganization, midnightIntelligenceOrganization, fjordLightingOrganization ];


module.exports = {
    getAllOrganizations: () => {
        return allOrganizations;
    },
    getServer: ( orgId, serverId ) => {
        const result = allOrganizations.filter(organization => organization.id.toLowerCase() === orgId);
        const organization = result[ 0 ];

        return organization.server.filter(server => server.id === serverId);
    }
    ,
    getOrganization: function ( orgId ) {
        return allOrganizations.filter(organization => organization.id.toLowerCase() === orgId.toLowerCase());
    }
    ,
    removeServer: ( organization, serverId ) => {
        return organization.server.filter(server => server.id !== serverId);
    }
    ,
    sendErrorReponse: ( response, statusCode, message ) => {
        return response.status(statusCode).json({message: message});
    }
    ,
    serverDoesNotExistsForOrganization: ( orgId, serverId ) => {
        const organizations = allOrganizations.filter(organization => organization.id.toLowerCase() === orgId.toLowerCase());

        return (organizations.length === 0) || organizations[ 0 ].server.filter(server => server.id === serverId).length <= 0;
    }
    ,
    buildListServersResponsePayload: ( organization ) => {
        return {
            organizationId: organization.id,
            organizationName: organization.name,
            totalServerCount: organization.server.length,
            server: organization.server
        };
    }
    ,
    buildServer: ( request ) => {
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
            state: request.body.state
        };
    }
};
