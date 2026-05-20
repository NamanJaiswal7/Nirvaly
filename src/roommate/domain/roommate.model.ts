/// Domain Model — Lab 3 Figure 3.5: Core domain aggregates
/// Pure business rules, no framework dependencies

export enum GroupStatus {
  FORMING = 'FORMING',
  ACTIVE = 'ACTIVE',
}

export enum PollStatus {
  OPEN = 'OPEN',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  APPLIED = 'APPLIED',
}

export enum MatchStatus {
  PENDING = 'PENDING',
  LIKED = 'LIKED',
  MUTUAL = 'MUTUAL',
  PASSED = 'PASSED',
}

/** Business rule: Poll expires after 48 hours — Lab 3 Figure 3.6 State Machine */
export const POLL_EXPIRY_HOURS = 48;

/** Business rule: Determine poll outcome based on votes — Lab 3 Figure 3.6 */
export function computePollStatus(
  votes: Array<{ decision: string }>,
  totalMembers: number,
): PollStatus {
  // AnyMemberVotesPass → FAILED
  if (votes.some((v) => v.decision === 'PASS')) {
    return PollStatus.FAILED;
  }
  // AllMembersVoteLike → PASSED
  if (
    votes.length === totalMembers &&
    votes.every((v) => v.decision === 'LIKE')
  ) {
    return PollStatus.PASSED;
  }
  return PollStatus.OPEN;
}

/** Business rule: Can a member be added to a group? — only when ACTIVE */
export function canAddMember(groupStatus: string): boolean {
  return groupStatus === GroupStatus.FORMING || groupStatus === GroupStatus.ACTIVE;
}

/** Business rule: Should group transition to ACTIVE? (FORMING + ≥2 members) */
export function shouldActivateGroup(
  currentStatus: string,
  memberCount: number,
): boolean {
  return currentStatus === GroupStatus.FORMING && memberCount >= 2;
}

/** Business rule: Can an application be submitted for a specific property? */
export function canSubmitApplication(
  groupStatus: string,
  pollStatus: string,
): boolean {
  return groupStatus === GroupStatus.ACTIVE && pollStatus === PollStatus.PASSED;
}
