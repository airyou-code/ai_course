from .views import TaskAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'task', TaskAPIView, basename='task')

urlpatterns = router.urls
