from celery import shared_task
from webapp.celery import app

# from user import models as user_models
from mail import handlers


@app.task
def send_verify_email_task(email: int, code: str):
    handlers.verify_email_handler(email, code)


# @shared_task(name="send_password_reset_request_email")
# def send_password_reset_request_email_task(user_id: int, code: str):
#     user = user_models.User.objects.filter(id=user_id).first()
#     if user is None:
#         return

#     handlers.password_reset_request_handler(user, code)


@app.task
def send_password_reset_link_email_task(email: str, reset_link: str):
    handlers.password_reset_link_handler(email, reset_link)
