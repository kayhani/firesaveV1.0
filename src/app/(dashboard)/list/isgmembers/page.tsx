import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { IsgMembers, Prisma, Institutions, Devices } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ITEM_PER_PAGE } from "@/lib/settings";

type IsgMemberList = IsgMembers & { institution: Institutions } & {
  device: Devices[];
};

const columns = [
  {
    header: "Kullanıcı ID",
    accessor: "id",
    className: "hidden md:table-cell",
  },

  {
    header: "ISG Numarası",
    accessor: "isgNumber",
    className: "hidden md:table-cell",
  },

  {
    header: "Adı-Soyadı",
    accessor: "name",
    className: "hidden md:table-cell",
  },

  {
    header: "Kontrat Tarihi",
    accessor: "contractDate",
    className: "hidden md:table-cell",
  },

  {
    header: "Eylemler",
    accessor: "action",
    className: "hidden md:table-cell",
  },
];

const renderRow = (item: IsgMemberList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="hidden md:table-cell">{item.id}</td>

    <td className="hidden md:table-cell">{item.isgNumber}</td>
    <td className="hidden md:table-cell">{item.name}</td>
    <td className="hidden md:table-cell">
      {item.contractDate.toLocaleDateString()}
    </td>

    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/isgmembers/${item.id}`}>
          {/* ISG member Detayı için sayfa yapılmadı, detay butonu inaktif yapıldı */}
          {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            <Image src="/view.png" alt="" width={24} height={24} />
          </button> */}
        </Link>
        {role === "admin" && (
          //<button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
          //<Image src="/delete.png" alt="" width={16} height={16} />
          // </button>
          <FormModal table="isgmember" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const IsgMemberListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITION

  const query: Prisma.IsgMembersWhereInput = {}; // Prisma için boş bir query nesnesi oluşturuluyor.

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "isgNumber":
            const isgNumber = value; // value'yu tam sayıya çeviriyoruz.
            if (isgNumber) {
              // geçerli bir sayı olup olmadığını kontrol ediyoruz.
              // Users tablosundaki roleId'ye göre filtreleme yapıyoruz.
              query.isgNumber = isgNumber;
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
    prisma.isgMembers.findMany({
      where: query,

      include: {
        institution: true,
        Devices: true,
      },

      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.isgMembers.count(),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex item-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Tüm ISG Sorumluları
        </h1>
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
              <FormModal table="isgmember" type="create" />
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

export default IsgMemberListPage;
