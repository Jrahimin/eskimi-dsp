## Project Features
- View Campaign List
- Create and Edit an advertising campaign.
- Manage Creative Uploads (Add More || Delete)
- Navigation to different pages
- List query cached with Redis
- Reusable Component: Preview button to check campaign uploads
- Dockerized 

## Installation
#### With Docker:
- `composer install`
- `npm install`
- `rename .env.docker to .env file`
- `php artisan key:generate`
- `php artisan config:cache`
- `docker-compose up`
- `docker-compose exec eskimi bash`
- `php artisan migrate`
- `php artisan db:seed`
- `run on: http://localhost:8000/`

#### Without Docker:
- `composer install`
- `npm install`
- `rename .env.example to .env file`
- `put your own db credentials`
- `php artisan key:generate`
- `php artisan config:cache`
- `php artisan migrate`
- `php artisan db:seed`
- `php artisan serve`
