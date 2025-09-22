import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentResponseDto } from './dto/department-info.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  async list(): Promise<DepartmentResponseDto[]> {
    const departments = await this.prisma.departments.findMany();
    return departments.map((dept) => ({
      department_id: dept.department_id,
      department_name: dept.department_name,
    }));
  }
  // create(createDepartmentDto: CreateDepartmentDto) {
  //   return 'This action adds a new department';
  // }
  // findAll() {
  //   return `This action returns all departments`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} department`;
  // }
  // update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
  //   return `This action updates a #${id} department`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} department`;
  // }
}
