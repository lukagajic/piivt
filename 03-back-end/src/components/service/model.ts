import IModel from '../../../dist/common/IModel.interface';
import CategoryModel from '../../../dist/components/category/model';

class ServiceModel implements IModel {
    serviceId: number;
    name: string;
    description: string;
    price: number;
    priceForChildren: number;
    priceForSeniors: number;
    categoryId: number;
    category: CategoryModel | null = null;
}

export default ServiceModel;
