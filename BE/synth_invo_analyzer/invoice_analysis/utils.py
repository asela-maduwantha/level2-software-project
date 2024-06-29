from datetime import datetime
import os
import matplotlib.pyplot as plt
import json
from invoice.models import Invoice
from rest_framework.response import Response
from elasticsearch_dsl import Q, Search, A
import pandas as pd
from elasticsearch_dsl import Search
from elasticsearch import Elasticsearch


es = Elasticsearch(['http://localhost:9200'])


def get_invoice_data(year, product_name, es, index="invoices"):
    try:
        year = int(year)
        if year < 1000 or year > 9999:
            raise ValueError("Invalid year")
    except ValueError:
        raise ValueError("Year parameter must be a valid 4-digit number")

    search = Search(using=es, index=index)
    search = search.filter('range', invoice_date={'gte': f'{year}-01-01', 'lte': f'{year}-12-31'})
    search = search.query('nested', path='items', query=Q('match', items__description=product_name))

    response = search.execute()

    data = []
    for hit in response.hits:
        invoice_date = hit.invoice_date
        for item in hit.items:
            if item['description'] == product_name:
                data.append({
                    'product': item['description'],
                    'price': item['unit_price'],
                    'date': invoice_date
                })

    return data

def calculate_price_deviations(data, year):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month

    monthly_avg = df.groupby(['product', 'year', 'month'])['price'].mean().reset_index()
    overall_avg = monthly_avg.groupby('product')['price'].mean().reset_index()
    overall_avg.rename(columns={'price': 'overall_avg_price'}, inplace=True)

    deviations = pd.merge(monthly_avg, overall_avg, on='product')
    deviations = deviations[deviations['year'] == int(year)]
    deviations['deviation'] = deviations['price'] - deviations['overall_avg_price']

    return deviations


def calculate_supplier_expenditures(organization_id, year):
    start_date = datetime(int(year), 1, 1).isoformat()
    end_date = datetime(int(year), 12, 31).isoformat()

    search_body = {
        "query": {
            "bool": {
                "must": [
                    {"term": {"recipient": organization_id}},
                    {"range": {"invoice_date": {"gte": start_date, "lte": end_date}}}
                ]
            }
        }
    }

    try:
        res = es.search(index="invoices", body=search_body)

        data = []
        for hit in res['hits']['hits']:
            supplier_name = hit['_source']['seller']['company_name']
            total_amount = hit['_source']['summary']['total_amount']
            data.append({
                "supplier_name": supplier_name,
                "total_amount": total_amount
            })

        df = pd.DataFrame(data)
        expenditures_per_supplier = df.groupby('supplier_name')['total_amount'].sum().reset_index()

        suppliers_expenditures = expenditures_per_supplier.to_dict(orient='records')

        return suppliers_expenditures

    except Exception as e:
        raise ValueError(f"Error fetching data from Elasticsearch: {str(e)}")





















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




def monthly_sales_analysis(data):
    try:
        monthly_sales = data.resample('ME', on='Invoice Date')['Price'].sum()
        print(monthly_sales)
        return monthly_sales
    except Exception as e:
        raise RuntimeError("Error during monthly sales analysis") from e

def seasonal_sales_analysis(data):
    try:
        data['Month'] = data['Invoice Date'].dt.month
        seasonal_sales = data.groupby('Month')['Price'].sum()
        return seasonal_sales
    except KeyError as e:
        raise KeyError("Missing columns for seasonal sales analysis")


def revenue_analysis(data):
    try:
        # Calculate the 'Revenue' column
        data['Revenue'] = data['Quantity'] * data['Price']

        # Add the invoice year and month columns
        data['invoice_year'] = data['Invoice Date'].dt.year
        data['invoice_month'] = data['Invoice Date'].dt.month

        # Calculate monthly and yearly revenue
        monthly_revenue = data.groupby(['invoice_year', 'invoice_month'])['Revenue'].sum()
        yearly_revenue = data.groupby('invoice_year')['Revenue'].sum()

        unique_years = list(data['invoice_year'].unique())
        chart_dir = 'static/charts'
        os.makedirs(chart_dir, exist_ok=True)
        for year in unique_years:
        
            # Pie chart for yearly revenue
            plt.figure(figsize=(5, 5))
            plt.pie([yearly_revenue.loc[year]], labels=[str(year)], autopct='%1.1f%%', startangle=140)
            plt.title(f'Total Revenue Distribution ({year})')
            plt.axis('equal')
            plt.savefig(f'{chart_dir}/revenue_pie_chart_{year}.png')
            plt.close()

            # Bar chart for monthly revenue
            monthly_data = monthly_revenue.loc[year]
            plt.figure(figsize=(10, 6)) 
            plt.bar(monthly_data.index, monthly_data.values)
            plt.title(f'Monthly Revenue Distribution ({year})')
            plt.xlabel('Month')
            plt.ylabel('Total Revenue')
            plt.xticks(rotation=45)
            plt.tight_layout()
            plt.savefig(f'{chart_dir}/revenue_bar_chart_{year}.png')
            plt.close()
        
            # Doughnut chart for yearly revenue
            plt.figure(figsize=(5, 5))
            plt.pie([yearly_revenue.loc[year]], labels=[str(year)], autopct='%1.1f%%', startangle=140, wedgeprops=dict(width=0.3))
            plt.title(f'Total Revenue Distribution (Doughnut) ({year})')
            plt.axis('equal')
            plt.savefig(f'{chart_dir}/revenue_doughnut_chart_{year}.png')
            plt.close()
        
        return monthly_revenue, yearly_revenue
    except KeyError as e:
        raise KeyError("Missing columns for revenue analysis")
    except Exception as e:
        print(f"Unexpected error in revenue_analysis: {str(e)}")
        raise
