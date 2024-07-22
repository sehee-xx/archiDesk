import { IsNumber } from 'class-validator';

export class PriceRangeDto {
  @IsNumber()
  minPrice: number;

  @IsNumber()
  maxPrice: number;
}
