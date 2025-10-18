import { HttpException, HttpStatus } from '@nestjs/common';

export class FileUploadFailedException extends HttpException {
	constructor(cause?: Error) {
		super('file.exceptions.uploadFailed', HttpStatus.UNAUTHORIZED, { cause });
	}
}

export class UploadFileExistException extends HttpException {
	constructor(cause?: Error) {
		super('file.exceptions.uploadFileExist', HttpStatus.UNAUTHORIZED, { cause });
	}
}

export class DeleteFileNotExistException extends HttpException {
	constructor(cause?: Error) {
		super('file.exceptions.deleteFileNotExist', HttpStatus.UNAUTHORIZED, { cause });
	}
}

export class DeleteFileException extends HttpException {
	constructor(cause?: Error) {
		super('file.exceptions.deleteFile', HttpStatus.UNAUTHORIZED, { cause });
	}
}

export class FileTypeException extends HttpException {
	constructor(cause?: Error) {
		super('file.exceptions.fileType', HttpStatus.UNAUTHORIZED, { cause });
	}
}
