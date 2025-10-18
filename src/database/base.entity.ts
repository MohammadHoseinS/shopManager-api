import {
	BeforeInsert,
	BeforeSoftRemove,
	BeforeUpdate,
	Column,
	PrimaryGeneratedColumn
} from 'typeorm';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: true
	})
	createdBy: number;

	@CreateDateColumn({
		nullable: true
	})
	createdOn: Date;

	@Column({
		nullable: true,
		select: false
	})
	updatedBy: number;

	@UpdateDateColumn({
		nullable: true,
		select: false
	})
	updatedOn: Date;

	@Column({
		nullable: true,
		select: false
	})
	deletedBy: number;

	@DeleteDateColumn({
		nullable: true
	})
	deletedOn: Date;
}
