
"use client";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { FC } from 'react';


import { Button, Dropdown, Table } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from "@apollo/client/react";
import {
    GET_MODULE_PERMISSIONS,
    GET_USER_ROLES,
    GET_ALL_USERS,
    GET_USER_PERMISSIONS,
} from "@/apollo/queries/permissions";
import {
    CREATE_MODULE_PERMISSION,
    CREATE_USER_ROLE,
    UPDATE_MODULE_PERMISSION,
    ASSIGN_ROLE_TO_USER,
    REMOVE_ROLE_FROM_USER,
    GRANT_DIRECT_PERMISSION,
    REVOKE_DIRECT_PERMISSION,
} from "@/apollo/mutations/permissions";
import type { ModulePermission, UserRole, User } from "@/apollo/types/permissions";
import { ModulePermissionForm, UserRoleForm } from "@/apollo/types/permissions";
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchIcon } from 'lucide-react';

const actionItems = [
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
];

const statusColors: Record<string, string> = {
    'true': 'bg-green-500 text-white',
    'false': 'bg-red-500 text-white',
};



const permissionColumns = [
    {
        title: 'Permission',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: ModulePermission) => (
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
    { title: 'Operation', dataIndex: 'operationType', key: 'operationType' },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Resource', dataIndex: 'resource', key: 'resource' },
    {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive: boolean) => {
            const colorClass = statusColors[String(isActive)] || 'bg-gray-300';
            return (
                <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            );
        },
    },
    {
        title: 'Actions',
        key: 'actions',
    }]

type Tab = {
    key: string;
    label: string;
};

const tabs: Tab[] = [
    { key: 'system-permissions', label: 'System Permissions' },
    { key: 'system-roles', label: 'System Roles' },
    { key: 'team-members', label: 'Team Members' },
];

const SystemPermissionsPage: React.FC = () => {
    // Form state for permissions and roles
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // Mutations for assigning roles and permissions
    const [assignRole, { loading: assignRoleLoading }] = useMutation(
        ASSIGN_ROLE_TO_USER,
        {
            onCompleted: () => {
                refetchUsers();
                setOpenInviteModal(false);
                setSelectedUserId('');
                setSelectedRoleId('');
            }
        }
    );

    const [grantPermission, { loading: grantPermissionLoading }] = useMutation(
        GRANT_DIRECT_PERMISSION,
        {
            onCompleted: () => {
                refetchUsers();
            }
        }
    );

    const assignLoading = assignRoleLoading || grantPermissionLoading;

    const handleCreatePermission = () => {
        if (!permissionForm.module || !permissionForm.operationType || !permissionForm.action ||
            !permissionForm.resource || !permissionForm.name || !permissionForm.description) {
            console.error('Please fill in all required fields');
            return;
        }

        createModulePermission({
            variables: {
                input: permissionForm
            }
        });
    };

    const handleCreateRole = () => {
        if (!roleForm.name || !roleForm.description || !roleForm.hierarchyLevel) {
            console.error('Please fill in all required fields');
            return;
        }

        createUserRole({
            variables: {
                input: roleForm
            }
        });
    };

    const handleAssignRole = async () => {
        if (selectedUserId) {
            if (selectedRoleId) {
                await assignRole({
                    variables: {
                        userId: selectedUserId,
                        roleId: selectedRoleId
                    }
                });
            }

            // Grant direct permissions
            for (const permissionId of selectedPermissions) {
                await grantPermission({
                    variables: {
                        userId: selectedUserId,
                        permissionId
                    }
                });
            }

            // Reset form
            setSelectedUserId('');
            setSelectedRoleId('');
            setSelectedPermissions([]);
            setOpenInviteModal(false);
        }
    };
    const [permissionForm, setPermissionForm] = useState<ModulePermissionForm>({
        module: '',
        operationType: '',
        action: '',
        resource: '',
        name: '',
        description: '',
        requiresOwnership: false,
        requiresBusinessMembership: false
    });

    const [roleForm, setRoleForm] = useState<UserRoleForm>({
        name: '',
        displayName: '',
        description: '',
        hierarchyLevel: 1,
        permissionIds: [],
        isActive: true
    });

    const [activeTab, setActiveTab] = useState('system-permissions');
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
    const [openAddPermissionModal, setOpenAddPermissionModal] = useState(false);

    // Mutations for creating permissions and roles
    const [createModulePermission, { loading: createPermissionLoading }] = useMutation(
        CREATE_MODULE_PERMISSION,
        {
            onCompleted: () => {
                setOpenAddPermissionModal(false);
                refetchPermissions();
                setPermissionForm({
                    module: '',
                    operationType: '',
                    action: '',
                    resource: '',
                    name: '',
                    description: '',
                    requiresOwnership: false,
                    requiresBusinessMembership: false
                });
            },
            onError: (error) => {
                console.error('Error creating permission:', error);
            }
        }
    );

    const [createUserRole, { loading: createRoleLoading }] = useMutation(
        CREATE_USER_ROLE,
        {
            onCompleted: () => {
                setOpenAddRoleModal(false);
                refetchRoles();
                setRoleForm({
                    name: '',
                    displayName: '',
                    description: '',
                    hierarchyLevel: 1,
                    permissionIds: [],
                    isActive: true
                });
            },
            onError: (error) => {
                console.error('Error creating role:', error);
            }
        }
    );

    // Apollo queries for permissions, roles, users
    type PermissionsQueryResult = { modulePermissions: ModulePermission[] };
    type RolesQueryResult = { userRoles: UserRole[] };
    type UsersQueryResult = { allUsers: User[] };

    const { data: permissionsData, loading: permissionsLoading, refetch: refetchPermissions } = useQuery<PermissionsQueryResult>(GET_MODULE_PERMISSIONS);
    const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery<RolesQueryResult>(GET_USER_ROLES);
    const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery<UsersQueryResult>(GET_ALL_USERS);

    // Table data for each tab
    const usersTableData = usersData?.allUsers || [];

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
                        {/* Permissions Table */}
                        {activeTab === 'system-permissions' && (
                            <Table
                                dataSource={permissionsData?.modulePermissions || []}
                                columns={[
                                    {
                                        title: 'Permission',
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (text: string, record: ModulePermission) => (
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
                                    { title: 'Operation', dataIndex: 'operationType', key: 'operationType' },
                                    { title: 'Action', dataIndex: 'action', key: 'action' },
                                    { title: 'Resource', dataIndex: 'resource', key: 'resource' },
                                    {
                                        title: 'Status',
                                        dataIndex: 'isActive',
                                        key: 'isActive',
                                        render: (isActive: boolean) => (
                                            <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${statusColors[String(isActive)]}`}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        ),
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
                                rowKey="id"
                                className="custom-kb-table"
                                loading={permissionsLoading}
                            />
                        )}
                    </div>
                )}
                {activeTab === 'system-roles' && (
                    <div className="bg-white rounded-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">System Roles</h3>
                            <button className='p-3 bg-primary rounded-sm text-white' onClick={() => setOpenAddRoleModal(true)}>Add Roles</button>
                        </div>
                        <Table
                            dataSource={rolesData?.userRoles || []}
                            loading={rolesLoading}
                            columns={[{
                                title: 'Role',
                                dataIndex: 'name',
                                key: 'role',
                                render: (text: string, record: UserRole) => (
                                    <div>
                                        <div className="font-medium text-base">{record.displayName || text}</div>
                                        <div className="text-xs text-gray-500">{record.description}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Hierarchy Level',
                                dataIndex: 'hierarchyLevel',
                                key: 'hierarchy',
                                render: (level: number) => `Level ${level}`
                            },
                            {
                                title: 'Permissions',
                                dataIndex: 'permissions',
                                key: 'permissions',
                                render: (permissions: { id: string; name: string }[]) => permissions?.length || 0
                            },
                            {
                                title: 'Status',
                                dataIndex: 'isActive',
                                key: 'isActive',
                                render: (isActive: boolean) => {
                                    const colorClass = statusColors[String(isActive)] || 'bg-gray-300';
                                    return (
                                        <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
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
                            dataSource={usersTableData}
                            columns={[{
                                title: 'User',
                                dataIndex: 'userProfile',
                                key: 'user',
                                render: (profile: User['userProfile'], record: User) => (
                                    <div>
                                        <div className="font-medium text-base">{profile?.firstName} {profile?.lastName}</div>
                                        <div className="text-xs text-gray-500">{record.email}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Status',
                                dataIndex: 'isActive',
                                key: 'status',
                                render: (isActive: boolean) => {
                                    const colorClass = statusColors[String(isActive)] || 'bg-gray-300';
                                    return (
                                        <span className={`inline-block px-3 py-1 rounded-[5px] text-xs ${colorClass}`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    );
                                },
                            },
                            {
                                title: 'Date Joined',
                                dataIndex: 'dateJoined',
                                key: 'dateJoined',
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
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={selectedUserId || ''}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                            >
                                <option value="">Select a user</option>
                                {usersData?.allUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user?.userProfile?.firstName} {user?.userProfile?.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="invite-role" className="mb-2 text-[#030229CC] text-sm">Select User Role*</label>
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={selectedRoleId || ''}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                            >
                                <option value="">Select a role</option>
                                {rolesData?.userRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.displayName || role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="invite-permissions" className="mb-2 text-[#030229CC] text-sm">Select Direct Permissions*</label>
                            <div className="border border-[#E5E5EA] rounded-md p-3 w-full max-h-40 overflow-y-auto">
                                {permissionsData?.modulePermissions.map((permission) => (
                                    <label key={permission.id} className="flex items-center gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission.id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setSelectedPermissions(prev =>
                                                    checked
                                                        ? [...prev, permission.id]
                                                        : prev.filter(id => id !== permission.id)
                                                );
                                            }}
                                        /> {permission.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                className="p-3 bg-primary rounded-md text-white w-full"
                                onClick={handleAssignRole}
                                disabled={!selectedUserId || (!selectedRoleId && selectedPermissions.length === 0) || assignLoading}
                            >
                                {assignLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add Roles Modal */}
                <Dialog
                    open={openAddRoleModal}
                    onOpenChange={() => setOpenAddRoleModal(false)}
                >
                    <DialogContent className="" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 className="text-center font-medium">Add Roles</h2>
                        <div>
                            <label htmlFor="role-name" className="mb-2 text-[#030229CC] text-sm">Role Name *</label>
                            <input
                                type="text"
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                placeholder="Enter role name"
                                value={roleForm.name}
                                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="role-desc" className="mb-2 text-[#030229CC] text-sm">Description *</label>
                            <input
                                type="text"
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                placeholder=""
                                value={roleForm.description}
                                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="role-hierarchy" className="mb-2 text-[#030229CC] text-sm">Hierarchy Level *</label>
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={roleForm.hierarchyLevel}
                                onChange={(e) => setRoleForm(prev => ({ ...prev, hierarchyLevel: parseInt(e.target.value) }))}
                            >
                                <option value="1">1</option>
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
                                {permissionsData?.modulePermissions.map((permission) => (
                                    <label key={permission.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={roleForm.permissionIds.includes(permission.id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setRoleForm(prev => ({
                                                    ...prev,
                                                    permissionIds: checked
                                                        ? [...prev.permissionIds, permission.id]
                                                        : prev.permissionIds.filter(id => id !== permission.id)
                                                }));
                                            }}
                                        /> {permission.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                className="p-3 bg-primary rounded-md text-white w-full"
                                onClick={handleCreateRole}
                                disabled={createRoleLoading}
                            >
                                {createRoleLoading ? 'Creating...' : 'Create Role'}
                            </button>
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
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={permissionForm.module}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, module: e.target.value }))}
                            >
                                <option value="">Select module</option>
                                <option value="campaigns">Campaigns</option>
                                <option value="users">Users</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="operation" className="mb-2 text-[#030229CC] text-sm">Operation *</label>
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={permissionForm.operationType}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, operationType: e.target.value }))}
                            >
                                <option value="">Select operation type</option>
                                <option value="mutation">Mutation</option>
                                <option value="query">Query</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="action" className="mb-2 text-[#030229CC] text-sm">Action *</label>
                            <select
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                value={permissionForm.action}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, action: e.target.value }))}
                            >
                                <option value="">Select action</option>
                                <option value="create">Create</option>
                                <option value="read">Read</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resource" className="mb-2 text-[#030229CC] text-sm">Resource *</label>
                            <input
                                type="text"
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                placeholder="User, business, campaign"
                                value={permissionForm.resource}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, resource: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="permission-name" className="mb-2 text-[#030229CC] text-sm">Permission Name *</label>
                            <input
                                type="text"
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                placeholder="User, business, campaign"
                                value={permissionForm.name}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="permission-desc" className="mb-2 text-[#030229CC] text-sm">Description *</label>
                            <input
                                type="text"
                                className="border border-[#E5E5EA] rounded-md p-3 w-full"
                                placeholder=""
                                value={permissionForm.description}
                                onChange={(e) => setPermissionForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mb-4 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={permissionForm.requiresOwnership}
                                    onChange={(e) => setPermissionForm(prev => ({ ...prev, requiresOwnership: e.target.checked }))}
                                /> Requires ownership
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={permissionForm.requiresBusinessMembership}
                                    onChange={(e) => setPermissionForm(prev => ({ ...prev, requiresBusinessMembership: e.target.checked }))}
                                /> Requires business membership
                            </label>
                        </div>
                        <div className="text-center">
                            <button
                                className="p-3 bg-primary rounded-md text-white w-full"
                                onClick={handleCreatePermission}
                                disabled={createPermissionLoading}
                            >
                                {createPermissionLoading ? 'Creating...' : 'Create Permission'}
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default SystemPermissionsPage;