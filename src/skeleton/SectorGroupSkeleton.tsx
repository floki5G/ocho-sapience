import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SectorGroupSkeleton = () => {
    return (
        <div className="mb-8">
            <div className="bg-gray-100 p-3 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    <Skeleton width={150} height={24} />
                </h3>
                <div className="flex items-center space-x-6">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="text-sm">
                            <Skeleton width={100} height={16} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {[...Array(11)].map((_, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    <Skeleton width={80} height={16} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b">
                                {[...Array(11)].map((_, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 text-right">
                                        <Skeleton width={60} height={16} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SectorGroupSkeleton;
