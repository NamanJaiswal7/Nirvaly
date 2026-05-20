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
exports.PropertyController = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const auth_guard_1 = require("../common/guards/auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let PropertyController = class PropertyController {
    propertyService;
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    search(q, city, min, max) {
        return this.propertyService.searchProperties(q, city, min ? parseInt(min, 10) : undefined, max ? parseInt(max, 10) : undefined);
    }
    getById(id) {
        return this.propertyService.getPropertyById(id);
    }
    getGroupPolls(id, userId) {
        return this.propertyService.getPropertyGroupPolls(id, userId);
    }
};
exports.PropertyController = PropertyController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('min')),
    __param(3, (0, common_1.Query)('max')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(':id/group-polls'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PropertyController.prototype, "getGroupPolls", null);
exports.PropertyController = PropertyController = __decorate([
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [property_service_1.PropertyService])
], PropertyController);
//# sourceMappingURL=property.controller.js.map