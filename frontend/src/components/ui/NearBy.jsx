import React from "react";

const places = [
  { name: "Hospital", icon: "🏥", map: "https://www.google.com/maps/search/?api=1&query=Hospital" },
  { name: "Police Station", icon: "🚓", map: "https://www.google.com/maps/search/?api=1&query=Police+Station" },
  { name: "Fire Station", icon: "🚒", map: "https://www.google.com/maps/search/?api=1&query=Fire+Station" },
  { name: "School", icon: "🏫", map: "https://www.google.com/maps/search/?api=1&query=School" },
  { name: "Park", icon: "🌳", map: "https://www.google.com/maps/search/?api=1&query=Park" },
  { name: "ATM", icon: "🏧", map: "https://www.google.com/maps/search/?api=1&query=ATM" },
  { name: "Pharmacy", icon: "💊", map: "https://www.google.com/maps/search/?api=1&query=Pharmacy" },
  { name: "Bus Stop", icon: "🚌", map: "https://www.google.com/maps/search/?api=1&query=Bus+Stop" },
];

const NearBy = () => {
  return (
    <section className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-bold text-blue-700 mb-8">Nearby Places</h2>
      <div className="relative w-[500px] h-[500px]">
        {places.map((place, idx) => {
          const angle = (360 / places.length) * idx;
          const radius = 200;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          return (
            <div
              key={place.name}
              className="absolute flex flex-col items-center justify-center animate-fade-in"
              style={{
                left: `calc(50% + ${x}px - 60px)`,
                top: `calc(50% + ${y}px - 60px)`,
                transition: 'all 0.5s',
              }}
            >
              <a href={place.map} target="_blank" rel="noopener noreferrer">
                <div className="w-32 h-32 flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {place.icon}
                  <p className="text-xl font-semibold">{place.name}</p>
                </div>
              </a>
            </div>
          );
        })}
        
      </div>
    </section>
  );
};

export default NearBy;
