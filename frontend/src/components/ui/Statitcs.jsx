const stats = [
  { label: "Active Users", value: "2,340" },
  { label: "Communities", value: "87" },
  { label: "Events Hosted", value: "154" },
  { label: "Projects Launched", value: "32" },
];

const Statitcs = () => {
  return (
    <section className="max-w-5xl mx-auto py-20 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center py-8 px-4 border border-gray-100 hover:shadow-lg transition"
          >
            <span className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</span>
            <span className="text-gray-500 text-lg font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statitcs;
