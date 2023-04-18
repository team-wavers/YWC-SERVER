import StoreRepository from './store.repository';

export default class UserService {
    list = async (page, size): Promise<{ rows; count }> => {
        return new StoreRepository().findAll(page, size);
    };

    search = async (q, page, size): Promise<{ rows; count }> => {
        return new StoreRepository().search(q, page, size);
    }
}
