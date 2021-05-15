import CategoryModel from "./model";

class CategoryService {

    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];

        lista.push({
            categoryId: 1,
            name: "Category A"
        });

        lista.push({
            categoryId: 2,
            name: "Category B"
        });

        return lista;
    }

    public async getById(categoryId: number): Promise<CategoryModel | null> {
        if (categoryId === 1 || categoryId === 2) {
            if (categoryId === 1) {
                return {
                    categoryId: 1,
                    name: "Category A"
                }
            }
            if (categoryId === 2) {
                return {
                    categoryId: 2,
                    name: "Category B"
                }
            }
        } else {
            return null;
        } 
    }

}

export default CategoryService;
