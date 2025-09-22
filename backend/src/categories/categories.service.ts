import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-item.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async list(): Promise<CategoryResponseDto[]> {
    return this.prisma.categories.findMany({
      select: {
        category_id: true,
        category_name: true,
      },
    });
  }
  // create(createCategoryDto: CreateCategoryDto) {
  //   return 'This action adds a new category';
  // }
  // findAll() {
  //   return `This action returns all categories`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }
  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
