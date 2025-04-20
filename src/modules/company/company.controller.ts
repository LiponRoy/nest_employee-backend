import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CompanyServices } from './company.service';
import config from '../../config';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';

const companyCreate = catchAsyncError(async (req: Request, res: Response) => {
	const { ...companyInfo } = req.body;

	const companyData = await CompanyServices.companyCreate(companyInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Company Create Successfully',
		data: companyData,
	});
});

const getCompanyByCreator = catchAsyncError(
	async (req: Request, res: Response) => {
		const companyData = await CompanyServices.getCompanyByCreator(req.user);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Company Getting Successfully',
			data: companyData,
		});
	}
);
const gettingCompnyNamesByCreator = catchAsyncError(
	async (req: Request, res: Response) => {
		const companyData = await CompanyServices.gettingCompnyNamesByCreator(
			req.user
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Compny Names Getting Successfully',
			data: companyData,
		});
	}
);

export const CompanyControllers = {
	companyCreate,
	getCompanyByCreator,
	gettingCompnyNamesByCreator,
};
