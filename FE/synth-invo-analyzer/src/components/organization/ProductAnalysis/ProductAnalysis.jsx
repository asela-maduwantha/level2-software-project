import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Typography, message, Row, Col } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const { Title } = Typography;

const ProductAnalysis = () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [topSellingData, setTopSellingData] = useState(null);
    const [priceAnalysisData, setPriceAnalysisData] = useState(null);

    useEffect(() => {
        const fetchProductAnalysis = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/analysis/generate-product-analysis/', {
                    user_id: localStorage.getItem('organization_id')
                });

                const responseData = response.data;

                // Assuming the response data has 'top_selling' and 'price_analysis' sections
                const topSelling = responseData.top_selling.find(item => item.year === new Date().getFullYear());
                const priceAnalysis = responseData.price_analysis.find(item => item.year === new Date().getFullYear());

                if (topSelling && priceAnalysis) {
                    setTopSellingData({
                        labels: topSelling.labels,
                        data: topSelling.data,
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            "#FF9F40",
                            "#FFCD56",
                            "#C9CBCF",
                            "#36A3EB",
                            "#FF6384"
                        ] // Adjust the colors if needed
                    });

                    setPriceAnalysisData({
                        labels: priceAnalysis.labels,
                        data: priceAnalysis.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)'
                    });
                }

                message.success('Product analysis data fetched successfully.');
            } catch (error) {
                console.error('Error fetching product analysis report:', error);
                message.error('Failed to fetch product analysis data.');
            }
        };

        fetchProductAnalysis();
    }, []);

    const downloadChart = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    const pieData = {
        labels: topSellingData ? topSellingData.labels : [],
        datasets: [
            {
                label: 'Top Selling Products/Services',
                data: topSellingData ? topSellingData.data : [],
                backgroundColor: topSellingData ? topSellingData.backgroundColor : [],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: priceAnalysisData ? priceAnalysisData.labels : [],
        datasets: [
            {
                label: 'Pricing Analysis',
                data: priceAnalysisData ? priceAnalysisData.data : [],
                backgroundColor: priceAnalysisData ? priceAnalysisData.backgroundColor : [],
                borderColor: priceAnalysisData ? priceAnalysisData.borderColor : [],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Product Analysis</Title>
            {pdfUrl && (
                <Card title="Product Analysis Report" style={{ marginBottom: '20px' }}>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        Download PDF Report
                    </a>
                </Card>
            )}
            <Row gutter={16}>
                <Col span={12}>
                    {topSellingData && (
                        <Card title="Top Selling Products/Services" style={{width:"500px", height:"400px"}}>
                            <Pie data={pieData} style={{width:"400px", height:"400px"}} />
                            <Button
                                type="primary"
                                style={{ marginTop: '20px' }}
                                onClick={() => downloadChart(`http://127.0.0.1:8000/static/charts/product_pie_chart_${new Date().getFullYear()}.png`, 'pie_chart.png')}
                            >
                                Download Pie Chart
                            </Button>
                        </Card>
                    )}
                </Col>
                <Col span={12}>
                    {priceAnalysisData && (
                        <Card title="Pricing Analysis">
                            <Bar data={barData} />
                            <Button
                                type="primary"
                                style={{ marginTop: '20px' }}
                                onClick={() => downloadChart(`http://127.0.0.1:8000/static/charts/product_bar_chart_${new Date().getFullYear()}.png`, 'bar_chart.png')}
                            >
                                Download Bar Chart
                            </Button>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProductAnalysis;
