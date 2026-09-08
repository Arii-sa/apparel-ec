FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip gd

# Composerをコンテナにコピー
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html