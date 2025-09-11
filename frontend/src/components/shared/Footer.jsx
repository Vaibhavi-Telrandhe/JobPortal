import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3">JobConnect</h3>
          <p className="text-sm text-gray-400">
            Your trusted job portal for top opportunities and companies.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-lg font-medium mb-2">Explore</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/jobs" className="hover:underline">Find Jobs</a></li>
            <li><a href="/companies" className="hover:underline">Companies</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Employers */}
        <div>
          <h4 className="text-lg font-medium mb-2">Employers</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/post-job" className="hover:underline">Post a Job</a></li>
            <li><a href="/plans" className="hover:underline">Plans & Pricing</a></li>
            <li><a href="/login" className="hover:underline">Employer Login</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

