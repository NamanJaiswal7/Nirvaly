"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_EXPIRY_HOURS = exports.MatchStatus = exports.PollStatus = exports.GroupStatus = void 0;
exports.computePollStatus = computePollStatus;
exports.canAddMember = canAddMember;
exports.shouldActivateGroup = shouldActivateGroup;
exports.canSubmitApplication = canSubmitApplication;
var GroupStatus;
(function (GroupStatus) {
    GroupStatus["FORMING"] = "FORMING";
    GroupStatus["ACTIVE"] = "ACTIVE";
})(GroupStatus || (exports.GroupStatus = GroupStatus = {}));
var PollStatus;
(function (PollStatus) {
    PollStatus["OPEN"] = "OPEN";
    PollStatus["PASSED"] = "PASSED";
    PollStatus["FAILED"] = "FAILED";
    PollStatus["EXPIRED"] = "EXPIRED";
    PollStatus["APPLIED"] = "APPLIED";
})(PollStatus || (exports.PollStatus = PollStatus = {}));
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["PENDING"] = "PENDING";
    MatchStatus["LIKED"] = "LIKED";
    MatchStatus["MUTUAL"] = "MUTUAL";
    MatchStatus["PASSED"] = "PASSED";
})(MatchStatus || (exports.MatchStatus = MatchStatus = {}));
exports.POLL_EXPIRY_HOURS = 48;
function computePollStatus(votes, totalMembers) {
    if (votes.some((v) => v.decision === 'PASS')) {
        return PollStatus.FAILED;
    }
    if (votes.length === totalMembers &&
        votes.every((v) => v.decision === 'LIKE')) {
        return PollStatus.PASSED;
    }
    return PollStatus.OPEN;
}
function canAddMember(groupStatus) {
    return groupStatus === GroupStatus.FORMING || groupStatus === GroupStatus.ACTIVE;
}
function shouldActivateGroup(currentStatus, memberCount) {
    return currentStatus === GroupStatus.FORMING && memberCount >= 2;
}
function canSubmitApplication(groupStatus, pollStatus) {
    return groupStatus === GroupStatus.ACTIVE && pollStatus === PollStatus.PASSED;
}
//# sourceMappingURL=roommate.model.js.map