import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  /** GET /v1/properties/search?q=&city=&min=&max= — public endpoint */
  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('city') city?: string,
    @Query('min') min?: string,
    @Query('max') max?: string,
  ) {
    return this.propertyService.searchProperties(
      q,
      city,
      min ? parseInt(min, 10) : undefined,
      max ? parseInt(max, 10) : undefined,
    );
  }

  /** GET /v1/properties/:id — public endpoint */
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.propertyService.getPropertyById(id);
  }

  /**
   * GET /v1/properties/:id/group-polls — authenticated
   * Returns poll status for this property across user's groups
   * Powers the "Apply as Group" button
   */
  @Get(':id/group-polls')
  @UseGuards(AuthGuard)
  getGroupPolls(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.propertyService.getPropertyGroupPolls(id, userId);
  }
}
