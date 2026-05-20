"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withLinks = withLinks;
exports.matchLinks = matchLinks;
exports.groupLinks = groupLinks;
exports.pollLinks = pollLinks;
exports.propertyLinks = propertyLinks;
function withLinks(data, links) {
    return { ...data, _links: links };
}
function matchLinks(matchId) {
    return {
        self: { href: `/v1/roommates/matches` },
        like: { href: `/v1/roommates/matches/${matchId}/like`, method: 'POST' },
    };
}
function groupLinks(groupId, status) {
    const links = {
        self: { href: `/v1/groups/${groupId}` },
        messages: { href: `/v1/groups/${groupId}/messages` },
        polls: { href: `/v1/groups/${groupId}/polls` },
    };
    if (status === 'FORMING' || status === 'ACTIVE') {
        links.addMember = { href: `/v1/groups/${groupId}/members`, method: 'POST' };
    }
    if (status === 'ACTIVE') {
        links.createPoll = { href: `/v1/groups/${groupId}/polls`, method: 'POST' };
        links.apply = { href: `/v1/groups/${groupId}/apply`, method: 'POST', note: 'Requires { propertyId } in body' };
    }
    return links;
}
function pollLinks(groupId, pollId, status) {
    const links = {
        self: { href: `/v1/groups/${groupId}/polls` },
        group: { href: `/v1/groups/${groupId}` },
    };
    if (status === 'OPEN') {
        links.vote = { href: `/v1/groups/${groupId}/polls/${pollId}/vote`, method: 'POST' };
    }
    if (status === 'PASSED') {
        links.apply = { href: `/v1/groups/${groupId}/apply`, method: 'POST' };
    }
    return links;
}
function propertyLinks(propertyId) {
    return {
        self: { href: `/v1/properties/${propertyId}` },
        search: { href: `/v1/properties/search` },
        groupPolls: { href: `/v1/properties/${propertyId}/group-polls` },
    };
}
//# sourceMappingURL=hateoas.helper.js.map