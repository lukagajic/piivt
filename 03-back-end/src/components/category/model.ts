import IModel from '../../common/IModel.interface';
import ServiceModel from '../service/model';
class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    services: ServiceModel[] = []; 
}

export default CategoryModel;
