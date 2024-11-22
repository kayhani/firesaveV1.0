import Announcements from "@/components/Announcements";
import CustomerExtingChart from "@/components/CustomerExtingChart";
import CustomerLastMaintChart from "@/components/CustomerLastMaintChart";
import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UserCard";

const LowCustomerPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="cihazlarim" link="" />
          <UserCard type="bakimiyaklasan" link="" />
          <UserCard type="tekliflerim" link="" />
          <UserCard type="bakimlarim" link="" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* PROVİDER OFFER CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CustomerExtingChart />
          </div>
          {/* LAST MAİNT CHART CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <CustomerLastMaintChart />
          </div>
        </div>
      </div>

      {/* RİGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default LowCustomerPage;
