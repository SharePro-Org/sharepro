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

const CATEGORY_CHOICES = [
    ['general', 'General'],
    ['account', 'Account & Profile'],
    ['campaigns', 'Campaigns'],
    ['referrals', 'Referrals'],
    ['rewards', 'Rewards & Payments'],
    ['technical', 'Technical Support'],
    ['billing', 'Billing'],
    ['business', 'Business Features'],
] as const;

const KnowledgeBasePage = () => {
    const [activeTab, setActiveTab] = useState<string>('1');
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [search, setSearch] = useState('');
    const [uploadType, setUploadType] = useState('');
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');
    const [faqCategory, setFaqCategory] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoCategory, setVideoCategory] = useState('');
    const [createFaq, { loading: faqUploading }] = useMutation(CREATE_FAQ);
    const { CREATE_WALKTHROUGH_VIDEO } = require('@/apollo/mutations/faq');
    interface CreateWalkthroughVideoResult {
        createWalkthroughVideo: {
            success: boolean;
            message?: string;
        };
    }
    const [createVideo, { loading: videoUploading }] = useMutation<CreateWalkthroughVideoResult>(CREATE_WALKTHROUGH_VIDEO);
    const [faqError, setFaqError] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

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
                            setFaqError(null);
                            setVideoError(null);
                            if (uploadType === 'faq') {
                                try {
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
                                } catch (err: any) {
                                    setFaqError(err?.message || 'Failed to upload FAQ');
                                }
                            }
                            if (uploadType === 'video') {
                                try {
                                    const getBase64 = (file: File | null) => {
                                        return new Promise<string>((resolve, reject) => {
                                            if (!file) return resolve('');
                                            const reader = new FileReader();
                                            reader.onload = () => resolve(reader.result as string);
                                            reader.onerror = reject;
                                            reader.readAsDataURL(file);
                                        });
                                    };
                                    const videoBase64 = await getBase64(videoFile);
                                    const thumbnailBase64 = await getBase64(thumbnailFile);
                                    const res = await createVideo({
                                        variables: {
                                            category: videoCategory,
                                            name: videoTitle,
                                            description: videoDescription,
                                            thumbnailUrl: thumbnailBase64,
                                            videoUrl: videoBase64,
                                        },
                                    });
                                    if (res?.data?.createWalkthroughVideo?.success) {
                                        setOpenUploadModal(false);
                                        setVideoFile(null);
                                        setThumbnailFile(null);
                                        setThumbnailPreviewUrl('');
                                        setVideoTitle('');
                                        setVideoDescription('');
                                        setVideoCategory('');
                                        setUploadType('');
                                    } else {
                                        setVideoError(res?.data?.createWalkthroughVideo?.message || 'Failed to upload video');
                                    }
                                } catch (err: any) {
                                    setVideoError(err?.message || 'Failed to upload video');
                                }
                            }
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
                                        {CATEGORY_CHOICES.map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
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
                                        value={videoTitle}
                                        onChange={e => setVideoTitle(e.target.value)}
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
                                        value={videoDescription}
                                        onChange={e => setVideoDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="video-category" className="mb-2 text-[#030229CC] text-sm">Category</label>
                                    <select
                                        id="video-category"
                                        className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                        value={videoCategory}
                                        onChange={e => setVideoCategory(e.target.value)}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {CATEGORY_CHOICES.map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <div className="flex-1">
                                        <label htmlFor="video-file" className="mb-2 text-[#030229CC] text-sm">Video File</label>
                                        <div className="border-2 border-dashed border-[#E5E5EA] rounded-md p-6 w-full flex flex-col items-center justify-center bg-[#F9FAFB] hover:border-primary transition cursor-pointer"
                                            onClick={() => document.getElementById('video-file')?.click()}>
                                            <span className="text-gray-500 mb-2">Click to upload</span>
                                            <input
                                                type="file"
                                                id="video-file"
                                                className="hidden"
                                                accept="video/*"
                                                required
                                                onChange={e => {
                                                    const file = e.target.files?.[0] || null;
                                                    setVideoFile(file);
                                                }}
                                            />
                                            <span className="text-xs text-gray-400">MP4, MOV, AVI, etc.</span>
                                            {videoFile && (
                                                <span className="text-xs text-primary mt-2">Selected: {videoFile.name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="video-thumbnail" className="mb-2 text-[#030229CC] text-sm">Thumbnail</label>
                                        <div className="border-2 border-dashed border-[#E5E5EA] rounded-md p-6 w-full flex flex-col items-center justify-center bg-[#F9FAFB] hover:border-primary transition cursor-pointer"
                                            onClick={() => document.getElementById('video-thumbnail')?.click()}>
                                            <span className="text-gray-500 mb-2">Click to upload</span>
                                            <input
                                                type="file"
                                                id="video-thumbnail"
                                                className="hidden"
                                                accept="image/*"
                                                required
                                                onChange={e => {
                                                    const file = e.target.files?.[0] || null;
                                                    setThumbnailFile(file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            setThumbnailPreviewUrl(ev.target?.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setThumbnailPreviewUrl('');
                                                    }
                                                }}
                                            />
                                            <span className="text-xs text-gray-400">JPG, PNG, etc.</span>
                                            {thumbnailFile && (
                                                <span className="text-xs text-primary mt-2">Selected: {thumbnailFile.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {thumbnailPreviewUrl && (
                                    <div className="mt-2 text-center">
                                        <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="max-h-32 mx-auto rounded-md" />
                                    </div>
                                )}
                            </>
                        )}
                        {faqError && (
                            <div className="text-red-500 text-sm text-center mb-2">{faqError}</div>
                        )}
                        {videoError && (
                            <div className="text-red-500 text-sm text-center mb-2">{videoError}</div>
                        )}
                        <div className="text-center mt-4">
                            <button
                                type="submit"
                                className="p-3 bg-primary rounded-md text-white w-full flex items-center justify-center gap-2"
                                disabled={faqUploading || videoUploading}
                            >
                                {(faqUploading || videoUploading) && (
                                    <span className="animate-spin inline-block mr-2">
                                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                                        </svg>
                                    </span>
                                )}
                                {faqUploading || videoUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default KnowledgeBasePage;