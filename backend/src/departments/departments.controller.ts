import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { DepartmentResponseDto } from './dto/department-info.dto';
@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}
  //Get list department
  @ApiOperation({ summary: 'Get list deparment' })
  @ApiOkResponse({ type: DepartmentResponseDto })
  @Get()
  async list(): Promise<DepartmentResponseDto[]> {
    return this.departmentsService.list();
  }
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
