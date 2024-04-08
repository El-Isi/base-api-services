import { Response, NextFunction } from 'express';
import ApiKeyExpiredError from '../../companies/useCases/companyApiKeys/errors/ApiKeyExpiredError';
import FindByCompanyAndIdUseCase from '../../companies/useCases/companyApiKeys/FindByCompanyAndIdUseCase';
import { decryptData, decryptKeys } from '../cripto';
require('../../utils/config');

const getData = (apiKeyHeader: string) => {
  const data = apiKeyHeader.split('.');
  const companyApiKeyId = decryptData(data[2]);
  const apiKey = data[1];
  return {
    apiKey,
    companyApiKeyId,
  };
};

export const authApi = () => async (req: any, res: Response, next: NextFunction) => {
  try {
    const findByCompanyAndIdUseCase = new FindByCompanyAndIdUseCase();
    const { headers } = req;
    const {
      'apikey': apiKeyHeader,
    } = headers;
    const { apiKey, companyApiKeyId } = getData(apiKeyHeader);
    const { apiKey: apiKeyHash, company: companyData, active } = await findByCompanyAndIdUseCase.exec(companyApiKeyId);
    const { _id: companyDataId } = companyData as any;
    req['payload'] = {
      validator: {
        companyId: companyDataId,
        companyApiKey: companyApiKeyId,
      }
    };
    
    if (decryptKeys(apiKeyHash) === apiKey && active) {
      next();
    } else {
      throw new ApiKeyExpiredError();
    }
  } catch (error) {
    next(error);
  }
};
