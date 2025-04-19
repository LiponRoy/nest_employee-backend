import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { ICompany } from './company.interface';
import { CompanyModel } from './company.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

const companyCreate = async (payload: ICompany) => {
	const { name, creator } = payload;
	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		// Check if company exists
		const company = await CompanyModel.findOne({ name }).session(session);

		if (company) {
			throw new ApiError(409, 'company already exists');
		}

		// Create the new product
		const newCompany = new CompanyModel<ICompany>({
			...payload,
			creator: creator,
		});

		// Save the product and add it to the user's product list in a single atomic operation
		await newCompany.save({ session });

		// If failed to create an company
		if (!newCompany) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Company');
		}

		// Commit the transaction
		await session.commitTransaction();

		return {
			newCompany,
		};
	} catch (error: any) {
		// Rollback the transaction in case of an error
		await session.abortTransaction();
		throw new ApiError(
			400,
			error.message || 'An error occurred while creating the company.'
		);
	} finally {
		// Ensure the session is always ended
		session.endSession();
	}
};

const getCompanyByCreator = async (currentUser: JwtPayload) => {
	const loginUser = currentUser.userId;
	const company = await CompanyModel.find({ creator: loginUser });

	if (!company) {
		throw new ApiError(409, 'company not found');
	}
	return company;
};

export const CompanyServices = {
	companyCreate,
	getCompanyByCreator,
};
