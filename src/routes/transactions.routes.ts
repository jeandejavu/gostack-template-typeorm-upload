import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();
  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post(
  '/',
  async ({ body: { title, value, type, category } }, response) => {
    const service = new CreateTransactionService();
    return response.json(
      await service.execute({ title, value, type, category }),
    );
  },
);

transactionsRouter.delete('/:id', async ({ params: { id } }, response) => {
  const service = new DeleteTransactionService();
  await service.execute({ id });
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async ({ file }, response) => {
    const service = new ImportTransactionsService();
    const transactions = await service.execute({ csvFilePath: file.path });

    return response.json(transactions);
  },
);

export default transactionsRouter;
