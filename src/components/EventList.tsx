import prisma from "@/lib/prisma"

const EventList = async ({ dateParam } : { dateParam: string | undefined}) => {

    // const validDateParam = "2024-11-13"; // Geçerli tarih
    // const invalidDateParam = "invalid_date"; // Geçersiz tarih


    const date = dateParam ? new Date(dateParam) : new Date();

    if (isNaN(date.getTime())) {
        console.error("Geçersiz bir tarih: ", dateParam);
        return []; // veya uygun bir hata mesajı dönebilir
    }

    

    // const data = await prisma.appointments.findMany ({

    //     where: {
    //         start: {
    //             gte: new Date(date.setHours(0,0,0,0)),
    //             lte: new Date(date.setHours(23, 59, 59, 999)),
    //         },
    //     },

    // });

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Gün başlama saati

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // Gün bitiş saati

    console.log('Start of Day:', startOfDay);
    console.log('End of Day:', endOfDay);

    const data = await prisma.appointments.findMany({
        where: {
            start: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    return data.map((event) => (
        <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-firered even:border-t-firelightorange"
            key={event.id}
        >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.tittle}</h1>
                <span className="text-gray-300 text-xs">
                    {event.start.toLocaleTimeString("en-UK", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,

                    })}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.content}</p>
            </div>
          ));
};
    


export default EventList 