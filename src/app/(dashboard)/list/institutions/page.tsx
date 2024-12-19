import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, notificationsData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import {
  Institutions,
  Notifications,
  TeamsMembers,
  MaintenanceCards,
  Appointments,
  IsgMembers,
  OfferCards,
  Devices,
  Prisma,
  Users,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type InstitutionList = Institutions & { users: Users[] } & {
  devices: Devices[];
} & { offercards: OfferCards[] } & { teamsMemebers: TeamsMembers[] } & {
  maintenanceCards: MaintenanceCards[];
} & { appointments: Appointments[] } & { cNotifications: Notifications[] } & {
  isgMembers: IsgMembers[];
};

const columns = [
  {
    header: "Kurum ID",
    accessor: "id",
    className: "hidden md:table-cell",
  },

  {
    header: "Kurum Adı",
    accessor: "instname",
    className: "hidden md:table-cell",
  },

  {
    header: "Kurum Adresi",
    accessor: "instaddress",
    className: "hidden md:table-cell",
  },

  {
    header: "Eylemler",
    accessor: "action",
    className: "hidden md:table-cell",
  },
];

const renderRow = (item: InstitutionList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="hidden md:table-cell">{item.id}</td>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </td>

    <td className="hidden md:table-cell">{item.address}</td>
    {/* <td className="hidden md:table-cell">{item.notificationType}</td> */}
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/institutions/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            <Image src="/view.png" alt="" width={24} height={24} />
          </button>
        </Link>
        {role === "admin" && (
          // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
          //   <Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          <FormModal table="institution" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const InstitutionListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.InstitutionsWhereInput = {}; // Prisma için boş bir query nesnesi oluşturuluyor.

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "id":
            const id = value; // value'yu tam sayıya çeviriyoruz.
            if (id) {
              // geçerli bir sayı olup olmadığını kontrol ediyoruz.
              // Users tablosundaki roleId'ye göre filtreleme yapıyoruz.
              query.id = id;
            }
            break;
          // Diğer case'ler eklenebilir. Örneğin, daha fazla filtrasyon yapılmak istenirse.
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.institutions.findMany({
      where: query,

      include: {
        //Notifications:true,
        //MaintenanceCards: true,
        // Appointments: true,
        //IsgMembers: true,
        //OfferCards: true,
        //Devices: true
      },

      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.institutions.count(),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex item-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Tüm Şirketler</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-firelightorange">
              //     <Image src="/plus.png" alt="" width={14} height={14}/>
              // </button>
              <FormModal table="institution" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default InstitutionListPage;
