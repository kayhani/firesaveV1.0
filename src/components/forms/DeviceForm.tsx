"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
deviceId: z
  .string()
  .min(3, { message: "Cihaz ID min 3 karakter uzunluğunda olmalı!" })
  .max(20, { message: "Cihaz ID maks 20 karakter uzunluğunda olmalı!" }),
serialNumber: z
  .string()
  .min(3, { message: "Cihaz Seri No min 3 karakter uzunluğunda olmalı!" })
  .max(20, { message: "Cihaz Seri No maks 20 karakter uzunluğunda olmalı!" }),
ownerId: z
  .string()
  .min(1, { message: "Bu alan boş geçilemez!" }),
ownerName: z
  .string()
  .min(1, { message: "Bu alan boş geçilemez!" }),
address: z.string().min(1, { message: "Bu alan boş geçilemez!" }),
deviceType: z
  .enum(["YT", "YD", "SPR", "YK"], { message: "Bu alan boş geçilemez!" }),
feature: z
  .enum(["co2", "KK", "TZ"], { message: "Bu alan boş geçilemez!" }),
respPersonId: z
  .string()
  .min(1, { message: "Bu alan boş geçilemez!" }),
respPerson: z
  .string()
  .min(1, { message: "Bu alan boş geçilemez!" }),
manufactureDate: z.
  date({ message: "Bu alan boş geçilemez!" }),
expiryDate: z.
  date({ message: "Bu alan boş geçilemez!" }),
lastInspectionDate: z.
  date({ message: "Bu alan boş geçilemez!" }),
location: z
  .string().min(1, { message: "Bu alan boş geçilemez!" }),
statuss: z
  .enum(["A", "P"], { message: "Bu alan boş geçilemez!" }),
photo: z.instanceof(File, { message: "Bu alan boş geçilemez!" }),
details: z.string().min(1, { message: "Bu alan boş geçilemez!" }),

});

type Inputs = z.infer<typeof schema>;

const DeviceForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Yeni Cihaz Oluştur</h1>
      <span className="text-xs text-gray-400 font-medium">
        Cihaz  
      </span>
      <div className="flex justify-between flex-wrap gap-4">
      
        <InputField
          label="ID"
          name="deviceId"
          defaultValue={data?.deviceId}
          register={register}
          error={errors?.deviceId}
        />
      
        <InputField
          label="Seri No"
          name="serialNumber"
          defaultValue={data?.serialNumber}
          register={register}
          error={errors?.serialNumber}
        />
       
        
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Cihaz Türü</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("deviceType")}
              defaultValue={data?.deviceType}
            >
              <option value="YT">Yangın Tüpü</option>
              <option value="YD">Yangın Dolabı</option>
              <option value="SPR">Sprinkler</option>
              <option value="YK">Yangın Kapısı</option>

            </select>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Özelliği</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("feature")}
              defaultValue={data?.feature}
            >
              <option value="co2">CO2</option>
              <option value="KK">Kuru Kimyevi</option>
              <option value="TZ">Toz</option>

            </select>
            {errors.feature?.message && (
              <p className="text-xs text-red-400">
                {errors.feature.message.toString()}
              </p>
            )}
          </div>
          <InputField
          label="Üretim Tarihi"
          name="manufactureDate"
          type="date"
          defaultValue={data?.manufactureDate}
          register={register}
          error={errors?.manufactureDate}
        />
        <InputField
          label="Son Kullanma Tarihi"
          name="expiryDate"
          type="date"
          defaultValue={data?.expiryDate}
          register={register}
          error={errors?.expiryDate}
        />
        <InputField
          label="Son Kontrol Tarihi"
          name="lastInspectionDate"
          type="date"
          defaultValue={data?.lastInspectionDate}
          register={register}
          error={errors?.lastInspectionDate}
        />
        <InputField
          label="Konum"
          name="location"
          defaultValue={data?.location}
          register={register}
          error={errors?.location}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Durumu</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("statuss")}
              defaultValue={data?.statuss}
            >
              <option value="A">Kullanımda</option>
              <option value="P">Kullanım Dışı</option>

            </select>
            {errors.statuss?.message && (
              <p className="text-xs text-red-400">
                {errors.statuss.message.toString()}
              </p>
            )}
          </div>       
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Cihaz Sahibi
        </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="ID"
          name="ownerId"
          defaultValue={data?.ownerId}
          register={register}
          error={errors?.ownerId}
        />
        <InputField
          label="Adı"
          name="ownerName"
          defaultValue={data?.ownerName}
          register={register}
          error={errors?.ownerName}
        />
        <InputField
          label="Adres"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
          
        <InputField
          label="Sorumlu Personel ID"
          name="respPersonId"
          defaultValue={data?.respPersonId}
          register={register}
          error={errors?.respPersonId}
        />
        <InputField
          label="Sorumlu Personel Adı"
          name="respPerson"
          defaultValue={data?.respPerson}
          register={register}
          error={errors?.respPerson}
        />
        
        <InputField
          label="Detaylar"
          name="details"
          defaultValue={data?.details}
          register={register}
          error={errors?.details}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Foto Yükleyin</span>
          </label>
          <input type="file" id="img" {...register("photo")} className="hidden" />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">
              {errors.photo.message.toString()}
            </p>
          )}
        </div>

      </div>
      
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DeviceForm;