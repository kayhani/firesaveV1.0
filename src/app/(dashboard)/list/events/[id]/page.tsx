import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
//import Performance from "@/components/Performance";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Appointments, Institutions, Users } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleEventPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const eventId = id; // veya Number(id);
  const event:
    | (Appointments & {
        creator: Users;
        creatorIns: Institutions;
        recipient: Users;
        recipientIns: Institutions;
      })
    | null = await prisma.appointments.findUnique({
    where: { id: eventId },
    include: {
      creator: true, // Bu kısmı ekleyerek `role` ilişkisini dahil ediyoruz
      creatorIns: true,
      recipient: true,
      recipientIns: true,
    },
  });

  if (!event) {
    return notFound();
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaPurpleLight py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src="/eevent.png"
                alt=""
                width={144}
                height={144}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Randevu Kartı</h1>
                {role === "admin" && (
                  <FormModal
                    table="event"
                    type="update"
                    data={{
                      id: 1,
                      eventId: "001",
                      creatorId: "008",
                      creatorName: "Harun Gümüş",
                      creatorOrganization: "Dokuz Eylül Üniversitesi",
                      respPersonId: "123",
                      respPersonName: "Abay Adalı",
                      respPersonOrg: "Yaşar Üniversitesi",
                      title: "Bakım",
                      message: "dhfgkjdhfgkhd",
                      // start: new Date(2024, 10, 30, 11, 0),
                      // end: new Date(2024, 10, 30, 11, 45),
                      // create: new Date(2024, 10, 10, 8, 45),
                      start: "30/10/2024",
                      end: "30/10/2024",
                      create: "10/10/2024",
                      allDay: false,
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">{event.content}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  {/* <Image src="/blood.png" alt="" width={14} height={14} /> */}
                  <span>Randevu No: {event.id}</span>
                </div>

                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  <Image src="/person.png" alt="" width={14} height={14} />
                  <span>
                    {event.recipient.firstName + " " + event.recipient.lastName}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  <Image
                    src="/insititution.png"
                    alt=""
                    width={14}
                    height={14}
                  />
                  <span>{event.recipientIns.name}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span> {event.recipientIns.phone}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{event.recipientIns.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                  <Image src="/address.png" alt="" width={14} height={14} />
                  <span> {event.recipientIns.address}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-lamaSky p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[100%]">
              {/* <div className="bg-lamaPurpleLight p-4 rounded-md w-full xl:w-2/5 flex flex-col gap-4"> */}

              <Image
                src="/smc-customer.png"
                alt=""
                width={96}
                height={96}
                className="w-10 h-12"
              />
              <div className="">
                <h1 className="text-md font-semibold">Oluşturan Personel</h1>
                <span className="text-sm text-gray-400">
                  {event.creator.id}
                </span>
                <br></br>
                <span className="text-sm text-gray-400">
                  {event.creator.firstName + " " + event.creator.lastName}
                </span>
                <br></br>
                <span className="text-sm text-gray-400">
                  {event.creatorIns.name}
                </span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-lamaYellow p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[100%]">
              {/* <div className="bg-lamaPurpleLight p-4 rounded-md w-full xl:w-2/5 flex flex-col gap-4"> */}

              <Image
                src="/smc-calendar.png"
                alt=""
                width={96}
                height={96}
                className="w-10 h-10"
              />
              <div className="">
                <h1 className="text-md font-semibold">
                  Randevu Başlangıç Tarihi
                </h1>
                <span className="text-sm text-gray-400">
                  {event.start.toLocaleDateString()}
                </span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-lamaSky p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[100%]">
              {/* <div className="bg-lamaPurpleLight p-4 rounded-md w-full xl:w-2/5 flex flex-col gap-4"> */}

              <Image
                src="/smc-calendar.png"
                alt=""
                width={96}
                height={96}
                className="w-10 h-10"
              />
              <div className="">
                <h1 className="text-md font-semibold">Randevu Bitiş Tarihi</h1>
                <span className="text-sm text-gray-400">
                  {event.end.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-lamaYellow p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[100%]">
              {/* <div className="bg-lamaPurpleLight p-4 rounded-md w-full xl:w-2/5 flex flex-col gap-4"> */}

              <Image
                src="/smc-calendar.png"
                alt=""
                width={96}
                height={96}
                className="w-10 h-10"
              />
              <div className="">
                <h1 className="text-md font-semibold">
                  Randevu Oluşturma Tarihi
                </h1>
                <span className="text-sm text-gray-400">
                  {event.create.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        {/* <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Cihaz Bakım Takvimi</h1>
          <BigCalendar />
        </div> */}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* <div className="bg-white p-4 rounded-md"> */}
        {/* <h1 className="text-xl font-semibold">Kısayollar</h1> */}
        {/* <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500"> */}
        {/* <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
            Cihaz&apos;ın Bakım Geçmişi
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Cihazla İlgili Bildirimler
            </Link> */}
        {/* <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
            Kullanıcı&apos;nın Cihazları
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
            Kullanıcı&apos;nın Bildirimleri
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Hizmet Sağlayıcılarım / Müşterilerim
            </Link> */}
        {/* </div> */}
        {/* </div> */}
        {/* <Performance /> */}
        {/* <Announcements /> */}
      </div>
    </div>
  );
};

export default SingleEventPage;
