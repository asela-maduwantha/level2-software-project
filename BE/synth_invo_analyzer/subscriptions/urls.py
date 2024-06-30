from django.urls import path
from . import views

urlpatterns = [
    path('create-subscription/', views.createSubscription, name='create-subscription'),
    path('subscription-data/', views.stripe_webhook, name='stripe-webhook'),
    path('get-current-plan/<uuid:user_id>/', views.get_current_subscription, name='get_current_subscription'),
    path('get-available-plans/', views.get_available_plans, name='get_available_plans'),
    path('change-plan/', views.change_plan, name='change-plan'),
]
