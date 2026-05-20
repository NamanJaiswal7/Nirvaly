"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const roommate_query_service_1 = require("../application/queries/roommate-query.service");
const roommate_command_service_1 = require("../application/commands/roommate-command.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roommate_dto_1 = require("../dto/roommate.dto");
const hateoas_helper_1 = require("../../common/hateoas.helper");
let GroupController = class GroupController {
    queries;
    commands;
    constructor(queries, commands) {
        this.queries = queries;
        this.commands = commands;
    }
    getMyGroups(userId) {
        return this.queries.getGroupsForUser(userId);
    }
    async createGroup(dto, userId) {
        const group = await this.commands.createGroup(dto.name, userId);
        const data = JSON.parse(JSON.stringify(group));
        return { ...data, _links: (0, hateoas_helper_1.groupLinks)(data.id, data.status) };
    }
    getGroup(id) {
        return this.queries.getGroupById(id);
    }
    async addMember(groupId, dto, userId) {
        const group = await this.commands.addMember(groupId, dto.userId, userId);
        const data = JSON.parse(JSON.stringify(group));
        return { ...data, _links: (0, hateoas_helper_1.groupLinks)(data.id, data.status) };
    }
    submitApplication(groupId, body, userId) {
        return this.commands.submitGroupApplication(groupId, body.propertyId, userId);
    }
};
exports.GroupController = GroupController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "getMyGroups", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [roommate_dto_1.CreateGroupDto, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "getGroup", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, roommate_dto_1.AddMemberDto, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addMember", null);
__decorate([
    (0, common_1.Post)(':id/apply'),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "submitApplication", null);
exports.GroupController = GroupController = __decorate([
    (0, common_1.Controller)('groups'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [roommate_query_service_1.RoommateQueryService,
        roommate_command_service_1.RoommateCommandService])
], GroupController);
//# sourceMappingURL=group.controller.js.map