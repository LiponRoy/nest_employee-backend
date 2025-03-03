import { IGenericErrorMessage } from './error';

export interface IGenericErrorResponse {
	statusCode: number;
	message: string;
	errorMessage: IGenericErrorMessage[];
}
export interface IPaginationResponse<T> {
	meta: {
		page: number;
		limit: number;
		total: number;
	};
	data: T;
}
