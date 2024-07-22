import { Test, TestingModule } from '@nestjs/testing';
import { DeskController } from './desk.controller';

describe('DeskController', () => {
  let controller: DeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeskController],
    }).compile();

    controller = module.get<DeskController>(DeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
