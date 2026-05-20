"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const roommate_module_1 = require("./roommate/roommate.module");
const property_module_1 = require("./property/property.module");
const user_module_1 = require("./user/user.module");
const notification_module_1 = require("./notification/notification.module");
const message_module_1 = require("./message/message.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            roommate_module_1.RoommateModule,
            property_module_1.PropertyModule,
            user_module_1.UserModule,
            notification_module_1.NotificationModule,
            message_module_1.MessageModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map