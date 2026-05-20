"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoommateModule = void 0;
const common_1 = require("@nestjs/common");
const common_module_1 = require("../common/common.module");
const notification_module_1 = require("../notification/notification.module");
const message_module_1 = require("../message/message.module");
const roommate_repository_1 = require("./infrastructure/roommate.repository");
const roommate_query_service_1 = require("./application/queries/roommate-query.service");
const roommate_command_service_1 = require("./application/commands/roommate-command.service");
const roommate_controller_1 = require("./presentation/roommate.controller");
const group_controller_1 = require("./presentation/group.controller");
const poll_controller_1 = require("./presentation/poll.controller");
let RoommateModule = class RoommateModule {
};
exports.RoommateModule = RoommateModule;
exports.RoommateModule = RoommateModule = __decorate([
    (0, common_1.Module)({
        imports: [common_module_1.CommonModule, notification_module_1.NotificationModule, message_module_1.MessageModule],
        controllers: [roommate_controller_1.RoommateController, group_controller_1.GroupController, poll_controller_1.PollController],
        providers: [
            roommate_repository_1.RoommateRepository,
            roommate_query_service_1.RoommateQueryService,
            roommate_command_service_1.RoommateCommandService,
        ],
    })
], RoommateModule);
//# sourceMappingURL=roommate.module.js.map