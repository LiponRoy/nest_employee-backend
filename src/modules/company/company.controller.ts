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

export const CompanyControllers = {
	companyCreate,
};
