import Transaction from '../models/Transaction';
import loadCSV from '../utils/loadCSV';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  csvFilePath: string;
}
class ImportTransactionsService {
  async execute({ csvFilePath }: Request): Promise<Transaction[]> {
    const transactionsFile = await loadCSV(csvFilePath);
    const createService = new CreateTransactionService();

    const transactions: Transaction[] = [];

    for (let i = 0; i < transactionsFile.length; i += 1) {
      const [title, type, value, category] = transactionsFile[i];
      /* eslint-disable no-await-in-loop */
      transactions.push(
        await createService.execute({ title, type, value, category }),
      );
      /* eslint-enable no-await-in-loop */
    }

    return transactions;
  }
}

export default ImportTransactionsService;
