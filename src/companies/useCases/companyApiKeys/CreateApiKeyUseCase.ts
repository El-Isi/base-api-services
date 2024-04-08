import { v4 as uuidv4 } from 'uuid';
import ICompanyApiKey from '../../model/interfaces/ICompanyApiKey';
import CompanyApiKeyRepository from '../../repository/CompanyApiKeyRepository';
import removeAccents from 'remove-accents';
import { encryptKeys } from '../../../config/cripto';

class CreateCompanyApiKeyUseCase {
  private async findCompanyApiKey(company: string) {
    const companyApiKeyRepository = new CompanyApiKeyRepository();
    const companyFounded = await companyApiKeyRepository.findOne({ company });
    return !companyFounded;
  }

  private async hashData (text: string): Promise<string> {
    const hashText = await encryptKeys(text);
    return hashText;
  }

  sanitizeString(name) {
    const newString = name
      .toLowerCase()
      .trim()
      .replace(/\s\s+/g, ' ');
    return removeAccents.remove(newString);
  };

  async exec(company: string, name: string) {
    const existCompanyApiKey = await this.findCompanyApiKey(company);
    if (!existCompanyApiKey) {
      throw new Error('Esta compañia ya tiene apikey');
    }

    const uid = uuidv4();
    const dateNextYear = new Date();
    const apiKeyHashed = await this.hashData(uid);
    const companyHashed = await this.hashData(company);
    dateNextYear.setFullYear(dateNextYear.getFullYear() + 1);

    const companyApiKeyRepository = new CompanyApiKeyRepository();
    const _companyApiKey = {
      apiKey: apiKeyHashed,
      apiKeyPrefix: uid.substring(0, 7),
      name,
      normalizedName: this.sanitizeString(name),
      company: company,
      active: true,
      expiration: dateNextYear,
    } as ICompanyApiKey;

    const companyApiKeyCreated = await companyApiKeyRepository.create(_companyApiKey);
    return {
      _id: companyApiKeyCreated._id,
      active: companyApiKeyCreated.active,
      expiration: companyApiKeyCreated.expiration,
      company: companyApiKeyCreated.company,
      apiKey: `EASY.${uid}.${companyHashed}`,
    };
  }
}

export default CreateCompanyApiKeyUseCase;
