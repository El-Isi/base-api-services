import CompanyApiKeyRepository from '../../repository/CompanyApiKeyRepository';
import ICompanyApiKeyModel from '../../model/ICompanyApiKeyModel';
import ApiKeyNotFoundError from './errors/ApiKeyNotValidError';

class FindByClientAndIdUseCase {
  async exec(companyApiKey: string): Promise<ICompanyApiKeyModel> {
      const companyApiKeyRepository = new CompanyApiKeyRepository();
      const companyApiKeyFound = await companyApiKeyRepository.findOne({ _id: companyApiKey });
      if(!companyApiKeyFound) throw new ApiKeyNotFoundError();
      return companyApiKeyFound;
  }
}

export default FindByClientAndIdUseCase;
