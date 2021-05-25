import CategoryService from '../components/category/service';
import ServiceService from '../components/service/service';
import DoctorService from '../components/doctor/service';
import PatientService from '../components/patient/service';

export default interface IServices {
    categoryService: CategoryService,
    serviceService: ServiceService,
    doctorService: DoctorService,
    patientService: PatientService
}
