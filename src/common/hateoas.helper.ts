/**
 * HATEOAS Helper — adds _links to API responses for discoverability.
 * Reference: Richardson Maturity Model Level 3
 */
export function withLinks<T>(data: T, links: Record<string, { href: string; method?: string }>): T & { _links: typeof links } {
  return { ...data, _links: links };
}

export function matchLinks(matchId: string) {
  return {
    self: { href: `/v1/roommates/matches` },
    like: { href: `/v1/roommates/matches/${matchId}/like`, method: 'POST' },
  };
}

export function groupLinks(groupId: string, status: string) {
  const links: Record<string, { href: string; method?: string }> = {
    self: { href: `/v1/groups/${groupId}` },
    messages: { href: `/v1/groups/${groupId}/messages` },
    polls: { href: `/v1/groups/${groupId}/polls` },
  };
  if (status === 'FORMING' || status === 'ACTIVE') {
    links.addMember = { href: `/v1/groups/${groupId}/members`, method: 'POST' };
  }
  if (status === 'ACTIVE') {
    links.createPoll = { href: `/v1/groups/${groupId}/polls`, method: 'POST' };
    links.apply = { href: `/v1/groups/${groupId}/apply`, method: 'POST', note: 'Requires { propertyId } in body' } as any;
  }
  return links;
}

export function pollLinks(groupId: string, pollId: string, status: string) {
  const links: Record<string, { href: string; method?: string }> = {
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

export function propertyLinks(propertyId: string) {
  return {
    self: { href: `/v1/properties/${propertyId}` },
    search: { href: `/v1/properties/search` },
    groupPolls: { href: `/v1/properties/${propertyId}/group-polls` },
  };
}
