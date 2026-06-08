
CREATE TABLE `users` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(255) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `projects` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `page` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `project_id` INT(11)      NOT NULL,
  `name`       VARCHAR(255) NOT NULL,
  `text`       TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
);

CREATE TABLE `project_pages` (
  `project_id` INT(11) NOT NULL,
  `page_id`    INT(11) NOT NULL,
  PRIMARY KEY (`project_id`, `page_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`page_id`)    REFERENCES `page`     (`id`) ON DELETE CASCADE
);

CREATE TABLE `page_sources` (
  `page_id`   INT(11) NOT NULL,
  `source_id` INT(11) NOT NULL,
  PRIMARY KEY (`page_id`, `source_id`),
  FOREIGN KEY (`page_id`)   REFERENCES `page` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`source_id`) REFERENCES `page` (`id`) ON DELETE CASCADE
);

CREATE TABLE `permissions` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `user_id`    INT(11)      NOT NULL,
  `project_id` INT(11)      NOT NULL,
  `role`       ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_project` (`user_id`, `project_id`),
  FOREIGN KEY (`user_id`)    REFERENCES `users`    (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
);