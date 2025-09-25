'use client'
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Dropdown, Input, Table, Card, Tabs } from 'antd';
import { FilterOutlined, MoreOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_FAQ } from '@/apollo/mutations/faq';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchIcon } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { FAQS, WALKTHROUGH_VIDEOS } from '@/apollo/queries/faq';
import { FAQ_CATEGORIES } from '@/apollo/queries/faq';

const actionItems = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'download', label: 'Download' },
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

const faqColumns = [
    { title: 'Question', dataIndex: 'question', key: 'question' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
        title: 'Tags',
        dataIndex: 'tagList',
        key: 'tagList',
        render: (tags: string[]) => tags?.join(', ') || '-'
    },
    {
        title: 'Views',
        dataIndex: 'viewCount',
        key: 'viewCount'
    },
    {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'status',
        render: ((isActive: boolean): React.ReactNode => {
            const status = isActive ? 'Published' : 'Unpublished';
            const colorClass = statusColors[status] || 'bg-gray-300';
            return (
                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>{status}</span>
            );
        })
    },
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

const videoColumns = [
    { title: 'Title', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
        title: 'Views',
        dataIndex: 'viewCount',
        key: 'viewCount'
    },
    {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'status',
        render: ((isActive: boolean): React.ReactNode => {
            const status = isActive ? 'Published' : 'Unpublished';
            const colorClass = statusColors[status] || 'bg-gray-300';
            return (
                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>{status}</span>
            );
        })
    },
    {
        title: 'Date Added',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => new Date(date).toLocaleDateString()
    },
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
    interface FaqCategory {
        category: string;
        categoryDisplay: string;
    }
    interface FaqCategoriesQuery {
        faqCategories: FaqCategory[];
    }
    const { data: faqCategoriesData = { faqCategories: [] }, loading: faqCategoriesLoading } = useQuery<FaqCategoriesQuery>(FAQ_CATEGORIES);
    const [activeTab, setActiveTab] = useState<string>('1');
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [search, setSearch] = useState('');
    const [uploadType, setUploadType] = useState('');
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');
    const [faqCategory, setFaqCategory] = useState('');
    const [createFaq, { loading: faqUploading }] = useMutation(CREATE_FAQ);

    interface Faq {
        question: string;
        category: string;
        tagList?: string[];
        viewCount?: number;
        isActive?: boolean;
    }
    interface FaqsQuery {
        faqs: Faq[];
    }
    const { data: faqData = { faqs: [] }, loading: faqLoading } = useQuery<FaqsQuery>(FAQS);
    interface WalkthroughVideo {
        name: string;
        category: string;
        description: string;
        viewCount: number;
        isActive: boolean;
        createdAt: string;
    }
    interface WalkthroughVideosQuery {
        walkthroughVideos: WalkthroughVideo[];
    }
    const { data: videoData = { walkthroughVideos: [] }, loading: videoLoading } = useQuery<WalkthroughVideosQuery>(WALKTHROUGH_VIDEOS);

    const filteredFaqs = faqData?.faqs?.filter((faq: any) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.category.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const filteredVideos = videoData.walkthroughVideos.filter((video: any) =>
        video.name.toLowerCase().includes(search.toLowerCase()) ||
        video.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="">
                <h2 className="text-xl font-semibold mb-6">Knowledge Base</h2>
                <div className="flex gap-6 mb-6">
                    <div className="bg-white rounded-md p-6 w-44 text-center">
                        <div className="text-gray-500 mb-2">Total Articles</div>
                        <div className="text-3xl font-bold">{faqData?.faqs?.length || 0}</div>
                    </div>
                    <div className='bg-white rounded-md p-6 w-44 text-center'>
                        <div className="text-gray-500 mb-2">Total Videos</div>
                        <div className="text-3xl font-bold">{videoData?.walkthroughVideos?.length || 0}</div>
                    </div>
                    <div className="ml-auto">
                        <button className='bg-primary py-2 px-6 rounded-md text-white' onClick={() => setOpenUploadModal(true)}>+ Upload New Content</button>
                    </div>
                </div>
                <div className='bg-white rounded-md p-3'>
                    <div className="flex gap-3 mb-4">
                        <div className="relative md:mt-0 mt-2">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-[#F9FAFB] md:w-[400px] w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                placeholder="Search by title or category"
                            />
                            <SearchIcon
                                size={16}
                                className="absolute top-4 left-3 text-gray-500"
                            />
                        </div>
                    </div>
                    <Tabs
                        defaultActiveKey="1"
                        onChange={setActiveTab}
                        className=''
                        items={[
                            {
                                key: '1',
                                label: 'FAQs',
                                children: <Table
                                    dataSource={filteredFaqs}
                                    columns={faqColumns}
                                    loading={faqLoading}
                                    pagination={{ pageSize: 7, showSizeChanger: false }}
                                    rowKey="question"
                                    className="custom-kb-table"
                                />
                            },
                            {
                                key: '2',
                                label: 'Walkthrough Videos',
                                children: <Table
                                    dataSource={filteredVideos}
                                    columns={videoColumns}
                                    loading={videoLoading}
                                    pagination={{ pageSize: 7, showSizeChanger: false }}
                                    rowKey="name"
                                    className="custom-kb-table"
                                />
                            }
                        ]}
                    />
                </div>
            </div>
            {/* Upload New Content Modal */}
            <Dialog
                open={openUploadModal}
                onOpenChange={() => setOpenUploadModal(false)}
            >
                <DialogContent className="">
                    <h2 className="text-center font-medium">Upload New Content</h2>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (uploadType === 'faq') {
                                await createFaq({
                                    variables: {
                                        answer: faqAnswer,
                                        category: faqCategory,
                                        question: faqQuestion,
                                    },
                                });
                                setOpenUploadModal(false);
                                setFaqQuestion('');
                                setFaqAnswer('');
                                setFaqCategory('');
                                setUploadType('');
                            }
                            // TODO: handle video upload mutation here
                        }}
                    >
                        <div>
                            <label htmlFor="type" className="mb-2 text-[#030229CC] text-sm">Type of Content</label>
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={uploadType}
                                onChange={e => setUploadType(e.target.value)}
                                required
                            >
                                <option value="">Select type</option>
                                <option value="faq">FAQ</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        {uploadType === 'faq' && (
                            <>
                                <div>
                                    <label htmlFor="faq-question" className="mb-2 text-[#030229CC] text-sm">Question</label>
                                    <input
                                        type="text"
                                        id="faq-question"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        placeholder="FAQ question"
                                        value={faqQuestion}
                                        onChange={e => setFaqQuestion(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="faq-answer" className="mb-2 text-[#030229CC] text-sm">Answer</label>
                                    <input
                                        type="text"
                                        id="faq-answer"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        placeholder="FAQ answer"
                                        value={faqAnswer}
                                        onChange={e => setFaqAnswer(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="faq-category" className="mb-2 text-[#030229CC] text-sm">Category</label>
                                    <select
                                        id="faq-category"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        value={faqCategory}
                                        onChange={e => setFaqCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {faqCategoriesLoading ? (
                                            <option disabled>Loading...</option>
                                        ) : (
                                            faqCategoriesData.faqCategories.map((cat: any) => (
                                                <option key={cat.category} value={cat.category}>{cat.categoryDisplay}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </>
                        )}
                        {uploadType === 'video' && (
                            <>
                                <div>
                                    <label htmlFor="video-title" className="mb-2 text-[#030229CC] text-sm">Title</label>
                                    <input
                                        type="text"
                                        id="video-title"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        placeholder="Video title"
                                        // value={videoTitle}
                                        // onChange={e => setVideoTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="video-description" className="mb-2 text-[#030229CC] text-sm">Description</label>
                                    <input
                                        type="text"
                                        id="video-description"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        placeholder="Video description"
                                        // value={videoDescription}
                                        // onChange={e => setVideoDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="video-category" className="mb-2 text-[#030229CC] text-sm">Category</label>
                                    <select
                                        id="video-category"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        // value={videoCategory}
                                        // onChange={e => setVideoCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {faqCategoriesLoading ? (
                                            <option disabled>Loading...</option>
                                        ) : (
                                            faqCategoriesData.faqCategories.map((cat: any) => (
                                                <option key={cat.category} value={cat.category}>{cat.categoryDisplay}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="video-file" className="mb-2 text-[#030229CC] text-sm">Video File</label>
                                    <input
                                        type="file"
                                        id="video-file"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        accept="video/*"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="video-thumbnail" className="mb-2 text-[#030229CC] text-sm">Thumbnail</label>
                                    <input
                                        type="file"
                                        id="video-thumbnail"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        accept="image/*"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className="p-3 bg-primary rounded-md text-white w-full"
                                disabled={faqUploading}
                            >{faqUploading ? 'Uploading...' : 'Upload'}</button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default KnowledgeBasePage;