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
exports.RoommateController = void 0;
const common_1 = require("@nestjs/common");
const roommate_query_service_1 = require("../application/queries/roommate-query.service");
const roommate_command_service_1 = require("../application/commands/roommate-command.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let RoommateController = class RoommateController {
    queries;
    commands;
    constructor(queries, commands) {
        this.queries = queries;
        this.commands = commands;
    }
    getMatches(userId) {
        return this.queries.getMatches(userId);
    }
    likeMatch(matchId, userId) {
        return this.commands.likeMatch(matchId, userId);
    }
};
exports.RoommateController = RoommateController;
__decorate([
    (0, common_1.Get)('matches'),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoommateController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Post)('matches/:id/like'),
    (0, roles_decorator_1.Roles)('TENANT', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RoommateController.prototype, "likeMatch", null);
exports.RoommateController = RoommateController = __decorate([
    (0, common_1.Controller)('roommates'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [roommate_query_service_1.RoommateQueryService,
        roommate_command_service_1.RoommateCommandService])
], RoommateController);
//# sourceMappingURL=roommate.controller.js.map