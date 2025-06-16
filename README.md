# AI Course


## About

Thisproject is initialized with [django_project_template](https://github.com/airyou-code/django_project_template)



## Getting Started

## Usage


```bash
./webapp/manage.py runserver
```

### Email configuration

Emails are sent through Yandex SMTP servers. Define the following environment
variables in `src/backend/.env` or your shell:

```
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_HOST_USER=<your@yandex.ru>
EMAIL_HOST_PASSWORD=<password>
EMAIL_USE_SSL=true
DEFAULT_EMAIL_FROM=<your@yandex.ru>
```

