import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOneOrCreateByTitle(title: string): Promise<Category> {
    const findCategory = await this.findOne({
      where: {
        title,
      },
    });
    if (findCategory !== undefined) return findCategory;

    const category = new Category();
    category.title = title;
    await this.save(category);
    return category;
  }
}

export default CategoriesRepository;
