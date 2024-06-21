import os
import pandas as pd
import matplotlib.pyplot as plt
import json
from invoice.models import Invoice

def load_data_from_db(invoices):
    data = []
    for invoice in invoices:
        internal_format = json.loads(invoice.internal_format)
    
        for item in internal_format['Invoice']['Items']:
            data.append({
                'business_code': internal_format['Invoice']['Seller']['CompanyName'],
                'invoice_no': internal_format['Invoice']['Header']['InvoiceNumber'],
                'customer_id': invoice.recipient,
                'customer_name': internal_format['Invoice']['Buyer']['CompanyName'],
                'invoice_date': internal_format['Invoice']['Header']['InvoiceDate'],
                'clear_date': None,
                'category': item['Description'],
                'quantity': item['Quantity'],
                'price': item['UnitPrice']
            })
    return pd.DataFrame(data)

def format_invoice_date(data):
    column_mapping = {
        'business_code': 'Business Code',
        'invoice_no': 'Invoice Number',
        'customer_id': 'Customer ID',
        'customer_name': 'Customer Name',
        'invoice_date': 'Invoice Date',
        'clear_date': 'Clear Date',
        'category': 'Category',
        'quantity': 'Quantity',
        'price': 'Price'
    }
    data = data.rename(columns=column_mapping)
    data['Invoice Date'] = pd.to_datetime(data['Invoice Date'], format='%Y-%m-%d')
    data['Clear Date'] = pd.to_datetime(data['Clear Date'], errors='coerce')
    return data

def product_analysis(data):
    try:
        data['invoice_year'] = data['Invoice Date'].dt.year
        top_selling_years = {}
        price_analysis_years = {}
        unique_years = data['invoice_year'].unique()

        chart_dir = 'static/charts'
        os.makedirs(chart_dir, exist_ok=True)

        for year in unique_years:
            year_data = data[data['invoice_year'] == year]
            top_selling_year = year_data.groupby('Category')['Quantity'].sum().sort_values(ascending=False).head(10)
            top_selling_years[year] = top_selling_year
            price_analysis_year = year_data.groupby('Category')['Price'].mean().sort_values(ascending=False)
            price_analysis_years[year] = price_analysis_year

            plt.figure(figsize=(8, 8))
            plt.pie(top_selling_year, labels=top_selling_year.index, autopct='%1.1f%%', startangle=140)
            plt.title(f'Top Selling Products/Services ({year})')
            plt.axis('equal')
            plt.savefig(f'{chart_dir}/product_pie_chart_{year}.png')
            plt.close()

            plt.figure(figsize=(10, 6))
            plt.bar(price_analysis_year.index, price_analysis_year.values, color='skyblue')
            plt.title(f'Pricing Analysis ({year})')
            plt.xlabel('Category')
            plt.ylabel('Average Unit Price')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{chart_dir}/product_bar_chart_{year}.png')
            plt.close()

        return top_selling_years, price_analysis_years
    except KeyError as e:
        raise KeyError("Missing columns for product analysis")