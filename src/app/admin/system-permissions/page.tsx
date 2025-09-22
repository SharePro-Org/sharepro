
"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Dropdown, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchIcon } from 'lucide-react';

const actionItems = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

const dataSource = [
    { permission: 'Create Campaign', module: 'Campaigns', operation: 'Mutation', action: 'Create', resource: 'Campaign', status: 'Active', description: 'Create Campaign' },
    { permission: 'Create Campaign', module: 'Campaigns', operation: 'Mutation', action: 'Create', resource: 'Campaign', status: 'Active', description: 'Create Campaign' },
    { permission: 'Create Campaign', module: 'Campaigns', operation: 'Mutation', action: 'Create', resource: 'Campaign', status: 'Active', description: 'Create Campaign' },
    { permission: 'Create Campaign', module: 'Campaigns', operation: 'Mutation', action: 'Create', resource: 'Campaign', status: 'Active', description: 'Create Campaign' },
    { permission: 'Create Campaign', module: 'Campaigns', operation: 'Mutation', action: 'Create', resource: 'Campaign', status: 'Active', description: 'Create Campaign' },
];

const statusColors = {
    Active: 'bg-green-500 text-white',
};

const columns = [
    {
        title: 'Permission',
        dataIndex: 'permission',
        key: 'permission',
        render: (text: string, record: typeof dataSource[0]) => (
            <div>
                <div className="font-medium text-base">{text}</div>
                <div className="text-xs text-gray-500">{record.description}</div>
            </div>
        ),
    },
    {
        title: 'Module',
        dataIndex: 'module',
        key: 'module',
        render: (module: string) => (
            <span className="inline-block px-3 py-1 rounded bg-[#E7ECF8] text-[#2D3A8C] text-xs font-medium">{module}</span>
        ),
    },
    { title: 'Operation', dataIndex: 'operation', key: 'operation' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Resource', dataIndex: 'resource', key: 'resource' },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-300';
            return (
                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>{status}</span>
            );
        },
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

const tabs = [
    { key: 'system-permissions', label: 'System Permissions' },
    { key: 'system-roles', label: 'System Roles' },
    { key: 'team-members', label: 'Team Members' },
];

const SystemPermissionsPage = () => {
    const [activeTab, setActiveTab] = useState('system-permissions');
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
    const [openAddPermissionModal, setOpenAddPermissionModal] = useState(false);

    return (
        <DashboardLayout>
            <div className="px-0 py-8">
                <h2 className="text-2xl font-semibold mb-1">System Permissions</h2>
                <p className="text-gray-500 mb-6">Manage user permissions, roles and access controls across the Sharepro Platform</p>
                <div className="flex gap-8 border-b border-[#E2E8F0] mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`pb-2 text-base font-medium border-b-2 transition-colors duration-150 ${activeTab === tab.key ? 'border-[#2D3A8C] text-[#2D3A8C]' : 'border-transparent text-gray-500'}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {activeTab === 'system-permissions' && (
                    <div className="bg-white rounded-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">System Permissions</h3>
                            <button className='p-3 bg-primary rounded-sm text-white' onClick={() => setOpenAddPermissionModal(true)}>Add Permission</button>
                        </div>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={{ pageSize: 5, showSizeChanger: false }}
                            rowKey="permission"
                            className="custom-kb-table"
                        />
                    </div>
                )}
                {activeTab === 'system-roles' && (
                    <div className="bg-white rounded-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">System Roles</h3>
                            <button className='p-3 bg-primary rounded-sm text-white' onClick={() => setOpenAddRoleModal(true)}>Add Roles</button>
                        </div>
                        <Table
                            dataSource={dataSource}
                            columns={[{
                                title: 'Role',
                                dataIndex: 'permission',
                                key: 'role',
                                render: (text: string, record: typeof dataSource[0]) => (
                                    <div>
                                        <div className="font-medium text-base">{text}</div>
                                        <div className="text-xs text-gray-500">{record.description}</div>
                                    </div>
                                ),
                            },
                            { title: 'Hierarchy Level', dataIndex: 'operation', key: 'hierarchy', render: () => 'Level 1' },
                            { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: () => '0' },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                                render: (status: string) => {
                                    const colorClass = statusColors[status as keyof typeof statusColors] || 'bg-gray-300';
                                    return (
                                        <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>{status}</span>
                                    );
                                },
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
                            ]}
                            pagination={{ pageSize: 5, showSizeChanger: false }}
                            rowKey="permission"
                            className="custom-kb-table"
                        />
                    </div>
                )}
                {activeTab === 'team-members' && (
                    <div className="bg-white rounded-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">User Permission Assignments</h3>
                                <span className="text-gray-500 text-sm">Assign roles and direct permissions to users</span>
                            </div>
                            {/* <input className="border border-[#CCCCCC] rounded px-4 py-2 w-[400px]" placeholder="Search by Name, Email, Phone, Business Name" /> */}
                            <div className="relative md:mt-0 mt-2">
                                <input
                                    type="text"
                                    className="bg-[#F9FAFB] md:w-[400px] w-full border border-[#E4E7EC] p-3 rounded-sm pl-8 text-sm"
                                    placeholder="Search by Name, Email, Phone, Business Name"
                                />
                                <SearchIcon
                                    size={16}
                                    className="absolute top-4 left-3 text-gray-500"
                                />
                            </div>
                            <button onClick={() => setOpenInviteModal(true)} className='p-3 bg-primary rounded-sm text-white'>Assign Roles</button>

                        </div>
                        <Table
                            dataSource={dataSource}
                            columns={[{
                                title: 'User',
                                dataIndex: 'user',
                                key: 'user',
                                render: () => 'John Doe',
                            },
                            {
                                title: 'Role',
                                dataIndex: 'permission',
                                key: 'role',
                                render: (text: string, record: typeof dataSource[0]) => (
                                    <div>
                                        <div className="font-medium text-base">{text}</div>
                                        <div className="text-xs text-gray-500">{record.description}</div>
                                    </div>
                                ),
                            },
                            { title: 'Hierarchy Level', dataIndex: 'operation', key: 'hierarchy', render: () => 'Level 1' },
                            { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: () => '0' },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: () => (
                                    <Dropdown menu={{ items: actionItems }} trigger={["click"]}>
                                        <Button type="text"><MoreOutlined /></Button>
                                    </Dropdown>
                                ),
                            },
                            ]}
                            pagination={{ pageSize: 5, showSizeChanger: false }}
                            rowKey="permission"
                            className="custom-kb-table"
                        />
                    </div>
                )}

                <Dialog
                    open={openInviteModal}
                    onOpenChange={() => setOpenInviteModal(false)}
                >
                    <DialogContent className="">
                        <h2 className="text-center font-medium">Assign Roles</h2>
                        <div>
                            <label htmlFor="name" className="mb-2 text-[#030229CC] text-sm">User</label>
                            <input type="text" className="border border-[#E5E5EA] rounded-md p-3 w-full" placeholder="e.g John Doe" />
                        </div>
                        <div>
                            <label htmlFor="invite-role" className="mb-2 text-[#030229CC] text-sm">Select User Role*</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="invite-permissions" className="mb-2 text-[#030229CC] text-sm">Select Permissions*</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select a role</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <button className="p-3 bg-primary rounded-md text-white w-full">Assign</button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add Roles Modal */}
                <Dialog
                    open={openAddRoleModal}
                    onOpenChange={() => setOpenAddRoleModal(false)}
                >
                    <DialogContent className="">
                        <h2 className="text-center font-medium">Add Roles</h2>
                        <div>
                            <label htmlFor="role-name" className="mb-2 text-[#030229CC] text-sm">Role Name *</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select Role Name</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="role-desc" className="mb-2 text-[#030229CC] text-sm">Description *</label>
                            <input type="text" className="border border-[#E5E5EA] rounded-md p-3 w-full" placeholder="" />
                        </div>
                        <div>
                            <label htmlFor="role-hierarchy" className="mb-2 text-[#030229CC] text-sm">Hierarchy Level *</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <div className="text-xs text-gray-500 mt-1">Levels range from 1-5 with 1 being the highest</div>
                        </div>
                        <div className="mb-4">
                            <label className="mb-2 text-[#030229CC] text-sm block">Select Permissions for this Role</label>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2"><input type="checkbox" /> Create Campaigns</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Read Campaigns</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Update Campaigns</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Create User Roles</label>
                                <label className="flex items-center gap-2"><input type="checkbox" /> Activate Role</label>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="p-3 bg-primary rounded-md text-white w-full">Create Role</button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add Permission Modal */}
                <Dialog
                    open={openAddPermissionModal}
                    onOpenChange={() => setOpenAddPermissionModal(false)}
                >
                    <DialogContent className="">
                        <h2 className="text-center font-medium">Add Permission</h2>
                        <div>
                            <label htmlFor="module" className="mb-2 text-[#030229CC] text-sm">Module *</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select module</option>
                                <option value="campaigns">Campaigns</option>
                                <option value="users">Users</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="operation" className="mb-2 text-[#030229CC] text-sm">Operation *</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select operation type</option>
                                <option value="mutation">Mutation</option>
                                <option value="query">Query</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="action" className="mb-2 text-[#030229CC] text-sm">Action *</label>
                            <select className="border border-[#E5E5EA] rounded-md p-3 w-full">
                                <option value="">Select action</option>
                                <option value="create">Create</option>
                                <option value="read">Read</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resource" className="mb-2 text-[#030229CC] text-sm">Resource *</label>
                            <input type="text" className="border border-[#E5E5EA] rounded-md p-3 w-full" placeholder="User, business, campaign" />
                        </div>
                        <div>
                            <label htmlFor="permission-name" className="mb-2 text-[#030229CC] text-sm">Permission Name *</label>
                            <input type="text" className="border border-[#E5E5EA] rounded-md p-3 w-full" placeholder="User, business, campaign" />
                        </div>
                        <div>
                            <label htmlFor="permission-desc" className="mb-2 text-[#030229CC] text-sm">Description *</label>
                            <input type="text" className="border border-[#E5E5EA] rounded-md p-3 w-full" placeholder="" />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 mt-2">
                            <label className="flex items-center gap-2"><input type="checkbox" /> Requires ownership</label>
                            <label className="flex items-center gap-2"><input type="checkbox" /> Requires business membership</label>
                        </div>
                        <div className="text-center">
                            <button className="p-3 bg-primary rounded-md text-white w-full">Create Permission</button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default SystemPermissionsPage;