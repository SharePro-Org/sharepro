'use client'
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Dropdown, Input, Table, Card } from 'antd';
import { FilterOutlined, MoreOutlined } from '@ant-design/icons';
import React from 'react';

const actionItems = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'download', label: 'Download' },
];

const dataSource = [
    { title: 'How to Create a Campaign', type: 'FAQ', category: 'Getting Started', audience: 'Businesses', status: 'Published', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'Video', category: 'Rewards', audience: 'Businesses', status: 'Unpublished', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'FAQ', category: 'Getting Started', audience: 'Businesses', status: 'Published', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'Video', category: 'Rewards', audience: 'Businesses', status: 'Unpublished', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'FAQ', category: 'Getting Started', audience: 'Businesses', status: 'Published', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'FAQ', category: 'Getting Started', audience: 'Businesses', status: 'Published', createdBy: 'Sarah Doe', date: '25-10-2025' },
    { title: 'How to Create a Campaign', type: 'Video', category: 'Rewards', audience: 'Businesses', status: 'Unpublished', createdBy: 'Sarah Doe', date: '25-10-2025' },
];

const statusColors = {
    Published: 'bg-green-500 text-white',
    Unpublished: 'bg-yellow-400 text-black',
};

const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Audience', dataIndex: 'audience', key: 'audience' },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: ((status: string): React.ReactNode => {
            const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-300';
            return (
                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>{status}</span>
            );
        }) as (status: string) => React.ReactNode,
    },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Date Added', dataIndex: 'date', key: 'date' },
    {
        title: 'Actions',
        key: 'actions',
        render: () => (
            <Dropdown menu={{ items: actionItems }} trigger={["click"]}>
                <Button type="text"><MoreOutlined /></Button>
            </Dropdown>
        ),
    },
];

const KnowledgeBasePage = () => {
    return (
        <DashboardLayout>
            <div className="">
                <h2 className="text-xl font-semibold mb-6">Knowledge Base</h2>
                <div className="flex gap-6 mb-6">
                    <div className="bg-white rounded-md p-6 w-44 text-center">
                        <div className="text-gray-500 mb-2">Total Articles</div>
                        <div className="text-3xl font-bold">4,382</div>
                    </div>
                    <div className='bg-white rounded-md p-6 w-44 text-center'>
                        <div className="text-gray-500 mb-2">Total Videos</div>
                        <div className="text-3xl font-bold">745</div>
                    </div>

                    <div className="ml-auto">
                        <button className='bg-primary py-2 px-6 rounded-md text-white'>+ Upload New Content</button>
                    </div>
                </div>
                <div className='bg-white rounded-md p-3'>
                    <div className="flex gap-3 mb-4">
                        <Input placeholder="Search by Name, Email, Phone, Business Name" style={{ width: 350 }} />
                        {/* <Button icon={<FilterOutlined />}>Filters</Button> */}
                    </div>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{ pageSize: 7, showSizeChanger: false }}
                        rowKey="title"
                        className="custom-kb-table"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default KnowledgeBasePage;