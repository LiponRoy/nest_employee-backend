import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { ICompany } from './company.interface';
import { CompanyModel } from './company.model';

const companyCreate = async (payload: ICompany) => {
	const { name } = payload;
	// Check if company exists
	const company = await CompanyModel.findOne({ name });

	if (company) {
		throw new ApiError(409, 'company already exists');
	}

	// create company
	const newCompany = await CompanyModel.create({
		...payload,
	});

	// If failed to create an company
	if (!newCompany) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Company');
	}

	return {
		newCompany,
	};
};

export const CompanyServices = {
	companyCreate,
};
