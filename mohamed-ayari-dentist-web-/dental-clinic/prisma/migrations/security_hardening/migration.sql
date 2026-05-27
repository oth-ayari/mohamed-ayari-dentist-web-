-- Security Hardening Migration
-- Run: npx prisma migrate deploy
-- Or for dev: npx prisma db push

-- Add security columns to admins table
ALTER TABLE `admins`
  ADD COLUMN `lastLoginAt` DATETIME(3) NULL,
  ADD COLUMN `lastLoginIp` VARCHAR(64) NULL,
  ADD COLUMN `failedAttempts` INT NOT NULL DEFAULT 0,
  ADD COLUMN `lockedUntil` DATETIME(3) NULL;

-- Recovery codes (one-time use, hashed)
CREATE TABLE `recovery_codes` (
  `id` VARCHAR(191) NOT NULL,
  `adminId` VARCHAR(191) NOT NULL,
  `codeHash` VARCHAR(191) NOT NULL,
  `usedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `recovery_codes_adminId_idx` (`adminId`),
  CONSTRAINT `recovery_codes_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Immutable audit log of admin actions
CREATE TABLE `audit_logs` (
  `id` VARCHAR(191) NOT NULL,
  `adminId` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `details` TEXT NULL,
  `ipAddress` VARCHAR(64) NULL,
  `userAgent` VARCHAR(500) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `audit_logs_adminId_idx` (`adminId`),
  INDEX `audit_logs_createdAt_idx` (`createdAt`),
  CONSTRAINT `audit_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Login attempt history for lockout and anomaly detection
CREATE TABLE `login_attempts` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `ipAddress` VARCHAR(64) NOT NULL,
  `success` BOOLEAN NOT NULL DEFAULT false,
  `userAgent` VARCHAR(500) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `login_attempts_email_idx` (`email`),
  INDEX `login_attempts_ipAddress_idx` (`ipAddress`),
  INDEX `login_attempts_createdAt_idx` (`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add cascade foreign key to refresh_tokens (was implicit before)
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_adminId_fkey`
  FOREIGN KEY (`adminId`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
