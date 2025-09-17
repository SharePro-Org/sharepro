import DashboardLayout from '@/components/dashboard/DashboardLayout';
import React from 'react';

const adminBusiness = () => {
    return (
        <DashboardLayout>
            <div className="bg-white p-3 rounded-md">
                <p>All Business Users</p>
                <div className="overflow-x-auto">
                    <table className="w-full mt-4 text-sm">
                        <thead>
                            <tr className="bg-[#D1DAF4] text-black">
                                <th className="px-4 py-3 font-medium text-left">Business Name</th>
                                <th className="px-4 py-3 font-medium text-left">Active Campaigns</th>
                                <th className="px-4 py-3 font-medium text-left">Invited Users</th>
                                <th className="px-4 py-3 font-medium text-left">Rewards Paid</th>
                                <th className="px-4 py-3 font-medium text-left">Plan Type</th>
                                <th className="px-4 py-3 font-medium text-left">Date Joined</th>
                                <th className="px-4 py-3 font-medium text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr
                                    key={item}
                                    className="border-b border-[#E2E8F0] py-6 last:border-0"
                                >
                                    <td className="py-3 px-4">John Doe</td>
                                    <td className="py-3 px-4">10</td>
                                    <td className="py-3 px-4">10</td>
                                    <td className='py-3 px-4'>20</td>
                                    <td className='py-3 px-4'>10</td>
                                    <td className="py-3 px-4">2023-10-01</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default adminBusiness;