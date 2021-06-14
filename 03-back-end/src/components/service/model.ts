import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';
class ServiceModel implements IModel {
    serviceId: number;
    name: string;
    description: string;
    catalogueCode: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
    category: CategoryModel | null = null;
    isActive: boolean;
}

export default ServiceModel;
