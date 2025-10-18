import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as mime from 'mime-types';

@Injectable()
export class AwsService {
	private readonly s3: S3;
	constructor() {
		this.s3 = new S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: process.env.AWS_REGION
		});
	}

	/**
	 * @param target doesn't need to include file extension (ex: .pdf, .png, .jpeg)
	 * @returns address of the uploaded file on the s3 bucket
	 */
	async uploadFile(file: Express.Multer.File, target: string): Promise<string> {
		// TODO:
		// handle the case where the user's computer isn't connected to the internet
		const input: S3.PutObjectRequest = {
			Bucket: process.env.AWS_BUCKET,
			Key: target,
			Body: file.buffer,
			ContentType: file.mimetype
		};
		const result = await this.s3.upload(input).promise();
		return result.Location;
	}

	/**
	 * @param target must include file extension (ex: .pdf, .png, .jpeg)
	 * @returns address of the uploaded file on the s3 bucket
	 */
	async uploadBuffer(buffer: Buffer, target: string): Promise<string> {
		// TODO:
		// handle the case where the user's computer isn't connected to the internet
		const input: S3.PutObjectRequest = {
			Bucket: process.env.AWS_BUCKET,
			Key: target,
			Body: buffer,
			ContentType: mime.lookup(target)
		};
		const result = await this.s3.upload(input).promise();
		return result.Location;
	}

	async delete(key: string): Promise<boolean> {
		const input = {
			Bucket: process.env.AWS_BUCKET,
			Key: key
		};
		await this.s3.deleteObject(input).promise();
		return true;
	}

	/**
	 * Extract the key of the file uploaded to aws s3 bucket from the file's url
	 * @param url string
	 * @returns string
	 */
	extractKeyFromUrl(url: string): string {
		if (!url || url.length === 0) return;
		const index = url.indexOf('amazonaws.com/') + 14;
		const key = url.substring(index);
		return key;
	}

	/**
	 * Find if a file with the given key exists on the aws s3 bucket
	 * @param key string
	 * @returns boolean
	 */
	async fileExists(key: string): Promise<boolean> {
		const input = {
			Bucket: process.env.AWS_BUCKET,
			Key: key
		};
		try {
			await this.s3.headObject(input).promise();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}