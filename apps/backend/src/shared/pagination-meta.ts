import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({
    description: 'Total number of items available across all pages',
    example: 250,
    type: Number,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Number of items returned per page',
    example: 10,
    type: Number,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Current page number (starting from 1)',
    example: 3,
    type: Number,
  })
  currentPage: number;

  constructor(totalItems: number, itemsPerPage: number, currentPage: number) {
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = currentPage;
  }
}
