import { Controller } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // @Post()
  // create(@Body() createDepartmentDto: CreateDepartmentDto) {
  //   return this.departmentsService.create(createDepartmentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.departmentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.departmentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDepartmentDto: UpdateDepartmentDto,
  // ) {
  //   return this.departmentsService.update(+id, updateDepartmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.departmentsService.remove(+id);
  // }
}
