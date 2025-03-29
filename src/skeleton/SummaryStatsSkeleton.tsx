import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SummaryStatsSkeleton = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">
                            <Skeleton width={120} height={16} />
                        </div>
                        <div className="mt-1">
                            <Skeleton width="80%" height={32} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummaryStatsSkeleton;
