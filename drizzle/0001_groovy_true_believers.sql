CREATE TABLE `enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentName` varchar(160) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`email` varchar(320) NOT NULL,
	`studentName` varchar(160) NOT NULL,
	`studentAge` varchar(32) NOT NULL,
	`classApplying` varchar(120) NOT NULL,
	`dayBoarding` varchar(32) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','contacted','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentKey` varchar(100) NOT NULL,
	`contentValue` text NOT NULL,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_contentKey_unique` UNIQUE(`contentKey`)
);
