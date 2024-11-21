"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Toplam",
    count: 138,
    fill: "white",
  },
  {
    name: "Kabul",
    count: 85,
    fill: "#EA4C4C",
  },
  {
    name: "Red",
    count: 53,
    fill: "#FAE27C",
  },
];

const ProviderOfferChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Tekliflerim</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/offerc.png"
          alt=""
          width={100}
          height={100}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-[#000000]-300">Kabul (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaPurple rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-[#000000]-300">Red (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default ProviderOfferChart;
