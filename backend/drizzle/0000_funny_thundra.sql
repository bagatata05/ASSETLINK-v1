CREATE TABLE `assets` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`asset_code` varchar(50) NOT NULL,
	`category` varchar(100) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`location` varchar(255),
	`school_id` varchar(255),
	`school_name` varchar(255),
	`serial_number` varchar(255),
	`purchase_date` datetime,
	`purchase_value` decimal(12,2),
	`photo_url` text,
	`description` text,
	`is_active` boolean DEFAULT true,
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `assets_asset_code_unique` UNIQUE(`asset_code`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`user_name` varchar(255),
	`action` varchar(100) NOT NULL,
	`entity_type` varchar(50),
	`entity_id` varchar(255),
	`details` text,
	`ip_address` varchar(50),
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maintenance_tasks` (
	`id` varchar(255) NOT NULL,
	`repair_request_id` varchar(255),
	`request_number` varchar(50),
	`asset_name` varchar(255),
	`school_name` varchar(255),
	`assigned_to_email` varchar(255),
	`assigned_to_name` varchar(255),
	`status` varchar(50) NOT NULL,
	`teacher_confirmation` boolean DEFAULT false,
	`teacher_verification_notes` text,
	`verified_by_email` varchar(255),
	`verified_date` datetime,
	`priority` varchar(50),
	`notes` text,
	`materials_used` text,
	`actual_cost` decimal(12,2),
	`start_date` datetime,
	`reschedule_count` decimal(5,0) DEFAULT '0',
	`reschedule_notes` text,
	`completed_date` datetime,
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` varchar(255) NOT NULL,
	`entity_id` varchar(255) NOT NULL,
	`entity_type` varchar(50) NOT NULL,
	`data` longblob NOT NULL,
	`mime_type` varchar(100) NOT NULL,
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repair_requests` (
	`id` varchar(255) NOT NULL,
	`request_number` varchar(50) NOT NULL,
	`asset_id` varchar(255),
	`asset_name` varchar(255),
	`asset_code` varchar(50),
	`school_id` varchar(255),
	`school_name` varchar(255),
	`reported_by_email` varchar(255),
	`reported_by_name` varchar(255),
	`description` text NOT NULL,
	`photo_url` text,
	`priority` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL,
	`assigned_to_email` varchar(255),
	`assigned_to_name` varchar(255),
	`principal_notes` text,
	`maintenance_notes` text,
	`teacher_confirmation` boolean DEFAULT false,
	`escalated_reason` text,
	`estimated_cost` decimal(12,2),
	`scheduled_start_date` datetime,
	`sla_deadline` datetime,
	`completed_date` datetime,
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `repair_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `repair_requests_request_number_unique` UNIQUE(`request_number`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`region` varchar(100),
	`division` varchar(100),
	`principal_name` varchar(255),
	`contact_email` varchar(255),
	`contact_phone` varchar(50),
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`full_name` varchar(255),
	`role` varchar(50) NOT NULL,
	`school_id` varchar(255),
	`school_name` varchar(255),
	`created_date` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `assets` ADD CONSTRAINT `assets_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `maintenance_tasks` ADD CONSTRAINT `maintenance_tasks_repair_request_id_repair_requests_id_fk` FOREIGN KEY (`repair_request_id`) REFERENCES `repair_requests`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_asset_id_assets_id_fk` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_school_id_schools_id_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;