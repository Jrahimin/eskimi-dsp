## Installation

With Docker:
- `copy .env.docker to .env file`
- `docker-compose up`
- `docker-compose exec eskimi bash`
- `php artisan key:generate`
- `php artisan config:cache`
- `php artisan migrate`
- `php artisan db:seed`
- `npm install`
- `run on: http://localhost:8000/`

Without Docker
- `composer install`
- `npm install`
- `copy .env.example to .env file`
- `php artisan key:generate`
- `php artisan migrate`
- `php artisan db:seed`
- `php artisan serve`
