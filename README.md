# YWC-SERVER

# DDL
CREATE TABLE `stores` (
    `_id`           BIGINT                              NOT NULL auto_increment ,
    `name`        	VARCHAR(255)                        NULL COMMENT '가맹점명',
    `number`  		VARCHAR(100)                        NULL COMMENT '가맹점번호',
    `category`    	VARCHAR(255)                        NULL COMMENT '업종명',
    `phone`    		VARCHAR(100)                        NULL COMMENT '전화번호',
    `address`    	VARCHAR(255)                        NULL COMMENT '주소',
    `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
    `updated_at`    DATETIME,
    `deleted_at`    DATETIME,
    PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
