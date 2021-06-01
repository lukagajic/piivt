import IModel from '../../common/IModel.interface';
import ServiceModel from '../service/model';
class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    isActive: boolean;
    services: ServiceModel[] = []; 
}

export default CategoryModel;
