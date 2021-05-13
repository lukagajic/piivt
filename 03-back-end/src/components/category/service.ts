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

}

export default CategoryService;
