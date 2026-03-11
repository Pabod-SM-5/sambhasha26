import React from 'react';
import ProfileCard from '../components/settings/ProfileCard';
import SchoolInfoForm from '../components/settings/SchoolInfoForm';
import TicDetailsForm from '../components/settings/TicDetailsForm';
import CoordinatorDetailsForm from '../components/settings/CoordinatorDetailsForm';

export default function Settings() {
  // Mock Data - In a real app, this would come from an API or Context
  const schoolDetails = {
    name: "Nalanda College",
    district: "Colombo",
    address: "Nalanda College, Colombo 10",
    email: "mediaunit@nalanda.sch.lk",
    phone: "011 2 695 254",
    ticName: "Mrs. K.A.D. Perera",
    ticMobile: "071 234 5678",
    ticNic: "198512345678",
    coordinatorName: "Kasun Perera",
    coordinatorMobile: "077 123 4567",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Nalanda_College_Colombo_crest.png/150px-Nalanda_College_Colombo_crest.png"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-medium text-white tracking-tight">Settings</h1>
        <p className="text-white/40 text-sm">View your school's registration details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile & Security */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileCard schoolDetails={schoolDetails} />
        </div>

        {/* Right Column - Details Forms */}
        <div className="lg:col-span-8 space-y-6">
          <SchoolInfoForm schoolDetails={schoolDetails} />
          <TicDetailsForm schoolDetails={schoolDetails} />
          <CoordinatorDetailsForm schoolDetails={schoolDetails} />
        </div>
      </div>
    </div>
  );
}
