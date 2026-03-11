import React from 'react';
import { Building2, MapPin, Mail, Phone } from 'lucide-react';

interface SchoolInfoFormProps {
  schoolDetails: {
    name: string;
    district: string;
    address: string;
    email: string;
    phone: string;
  };
}

export default function SchoolInfoForm({ schoolDetails }: SchoolInfoFormProps) {
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Building2 className="w-5 h-5 text-white/60" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">School Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">School Name</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <Building2 className="w-4 h-4 text-white/20" />
            {schoolDetails.name}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">District</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <MapPin className="w-4 h-4 text-white/20" />
            {schoolDetails.district}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">Address</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <MapPin className="w-4 h-4 text-white/20" />
            {schoolDetails.address}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">Official Email</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <Mail className="w-4 h-4 text-white/20" />
            {schoolDetails.email}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">Official Phone</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <Phone className="w-4 h-4 text-white/20" />
            {schoolDetails.phone}
          </div>
        </div>
      </div>
    </div>
  );
}
