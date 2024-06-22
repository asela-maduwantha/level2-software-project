from django.urls import path
from . import views

urlpatterns = [
    path('generate-product-analysis/', views.generate_product_analysis, name='generate_product_analysis'),
    path('get-product-pie-chart/<int:year>/', views.get_product_pie_chart, name='get_product_pie_chart'),
    path('get-product-bar-chart/<int:year>/', views.get_product_bar_chart, name='get_product_bar_chart'),
    path('get_monthly_sales/', views.get_monthly_sales, name='get_monthly_sales'),
    path('get_seasonal_sales/', views.get_seasonal_sales, name='get_seasonal_sales'),
    path('generate_revenue_analysis/', views.generate_revenue_analysis, name='generate_revenue_analysis'),
    path('get_revenue_pie_chart/<int:year>/', views.get_revenue_pie_chart, name='get_revenue_pie_chart'),
    path('get_revenue_bar_chart/<int:year>/', views.get_revenue_bar_chart, name='get_revenue_bar_chart'),
    path('get_revenue_doughnut_chart/<int:year>/', views.get_revenue_doughnut_chart, name='get_revenue_doughnut_chart'),
]
