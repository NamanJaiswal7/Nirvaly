export declare class CreateGroupDto {
    name: string;
    preferences?: string[];
}
export declare class AddMemberDto {
    userId: string;
}
export declare class CreatePollDto {
    propertyId: string;
}
export declare class VotePropertyDto {
    decision: 'LIKE' | 'PASS';
}
