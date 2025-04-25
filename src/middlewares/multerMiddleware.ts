import multer from 'multer';
import path from 'path';
// Multer config
const upload = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req: any, file: any, cb: any) => {
		let ext = path.extname(file.originalname);
		if (
			ext !== '.jpg' &&
			ext !== '.jpeg' &&
			ext !== '.png' &&
			ext !== '.JPG' &&
			ext !== '.JPEG' &&
			ext !== '.PNG' &&
			ext !== '.pdf' &&
			ext !== '.PDF'
		) {
			cb(new Error('File type is not supported'), false);
			return;
		}
		cb(null, true);
	},
});

export default upload;
