from django.urls import path
from . import views

urlpatterns = [
    path('admin/contentblock/change_order/', views.change_content_block_order, name='change_content_block_order'),
]
