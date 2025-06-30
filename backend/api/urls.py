from django.urls import path
from .views import profile_interpret_view 
from .views import get_profile_by_id

urlpatterns = [
    path('profile-interpret/', profile_interpret_view, name='profile_interpret'),
    path('profile/<str:id>/', get_profile_by_id, name='get_profile'),
]