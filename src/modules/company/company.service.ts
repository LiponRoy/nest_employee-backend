import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { ICompany } from './company.interface';
import { CompanyModel } from './company.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import cloudinary from '../../utils/cloudinary';

const companyCreate = async (payload: ICompany, photoFile: any) => {
	const { name, creator } = payload;

	console.log('pp creator', creator);
	console.log('pp payload', payload);
	console.log('pp photoFile', photoFile);

	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		// Check if company exists
		const company = await CompanyModel.findOne({ name }).session(session);

		if (company) {
			throw new ApiError(409, 'company already exists');
		}

		// Prepare for Cloudinary upload
		let result: any = null;
		if (photoFile) {
			try {
				// Upload image to Cloudinary
				result = await cloudinary.uploader.upload(photoFile.path, {
					folder: 'nest-emp-company-img',
					transformation: [
						{ width: 800, height: 800, crop: 'limit' }, // Resize image
						{ quality: 'auto', fetch_format: 'auto' }, // Optimize quality and format
					],
				});
			} catch (cloudinaryError) {
				throw new ApiError(500, 'Failed to upload image to Cloudinary');
			}
		}

		// Create the new product
		const newCompany = new CompanyModel<ICompany>({
			...payload,
			creator: creator,
			logoImage: result?.secure_url,
			cloudinary_id: result?.public_id,
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
		console.log(error);
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

const gettingCompnyNamesByCreator = async (currentUser: JwtPayload) => {
	const loginUser = currentUser.userId;
	console.log('loginUser', loginUser);

	const companyNames = await CompanyModel.distinct('name', {
		creator: loginUser,
	});

	if (!companyNames) {
		throw new ApiError(409, 'companyNames not found');
	}
	return companyNames;
};

export const CompanyServices = {
	companyCreate,
	getCompanyByCreator,
	gettingCompnyNamesByCreator,
};
