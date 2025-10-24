import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 max-w-6xl mx-auto py-12" >
            <div className="bg-amber-100 rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">Report Complain</h3>
                <p className="text-gray-700 mb-4">Register your complaint.</p>
                <a href="#report" className=" hover:text-amber-700 p-2 bg-amber-400 rounded text-gray-200 text-end">Learn More</a>
            </div>
            <div className="bg-red-100 rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">Request Permissions</h3>
                <p className="text-gray-700 mb-4">Apply for permissions.</p>
                <Link to="/permissions" className=" hover:text-red-700 p-2 bg-red-400 rounded text-gray-200 text-end">Learn More</Link>
            </div>
            <div className="bg-blue-100 rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">Give feedback</h3>
                <p className="text-gray-700 mb-4">Share your thoughts and suggestions.</p>
                <Link to="/feedback" className=" hover:text-blue-700 p-2 bg-blue-400 rounded text-gray-200 text-end">Learn More</Link>
            </div>
        </div>
    );
};

export default Services;