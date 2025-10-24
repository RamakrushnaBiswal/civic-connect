// PermissionPage.jsx
import React from "react";

const permissions = [
  { name: "Event Permission", url: "/event-permission" },
  { name: "E-License", url: "/e-license" },
  { name: "Birth Certificate", url: "/birth-certificate" },
  { name: "Death Certificate", url: "/death-certificate" },
  { name: "C & D", url: "/c-and-d" },
  { name: "Pet Permission", url: "/pet-permission" },
  { name: "Start-Up", url: "/startup" },
  { name: "Water Connection", url: "/water-connection" },
  { name: "Swach Bhart", url: "/swach-bhart" },
];

function PermissionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Permissions</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {permissions.map((perm) => (
          <a
            key={perm.name}
            href={perm.url}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition flex flex-col justify-center items-center hover:bg-blue-50"
          >
            <div className="text-blue-500 mb-4">
              {/* Placeholder for icon, use relevant SVG/icon library if desired */}
              <svg width="40" height="40" fill="none" stroke="currentColor">
                <circle cx="20" cy="20" r="18" strokeWidth="2" />
                <path d="M16 20l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-semibold">{perm.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PermissionPage;