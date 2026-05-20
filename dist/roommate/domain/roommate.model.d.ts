export declare enum GroupStatus {
    FORMING = "FORMING",
    ACTIVE = "ACTIVE"
}
export declare enum PollStatus {
    OPEN = "OPEN",
    PASSED = "PASSED",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    APPLIED = "APPLIED"
}
export declare enum MatchStatus {
    PENDING = "PENDING",
    LIKED = "LIKED",
    MUTUAL = "MUTUAL",
    PASSED = "PASSED"
}
export declare const POLL_EXPIRY_HOURS = 48;
export declare function computePollStatus(votes: Array<{
    decision: string;
}>, totalMembers: number): PollStatus;
export declare function canAddMember(groupStatus: string): boolean;
export declare function shouldActivateGroup(currentStatus: string, memberCount: number): boolean;
export declare function canSubmitApplication(groupStatus: string, pollStatus: string): boolean;
