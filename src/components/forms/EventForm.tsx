// Bu formda kullanılan API'ler ve componentler biraz daha basit. İşte detaylı dökümü:

// API Endpoints:
// /api/users/detail/${creatorId} - Oluşturan kişinin detay bilgilerini getiren endpoint
// /api/appointments - Randevu oluşturma için POST isteği yapılan endpoint
// /api/appointments/${id} - Randevu güncelleme için PUT isteği yapılan endpoint

// Özel Componentler:
// InputField - Form inputları için kullanılan temel input bileşeni
// UserSelect - Kullanıcı seçimi için dropdown bileşeni (burada alıcı kullanıcı seçimi için kullanılıyor)
// InstitutionSelect - Kurum seçimi için dropdown bileşeni (burada alıcı kurum seçimi için kullanılıyor)



"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from 'react-hot-toast';
import InputField from "../InputField";
import UserSelect from "@/components/UserSelect";
import InstitutionSelect from "@/components/InstitutionSelect";

// Form validation şeması
const schema = z.object({
  // Oluşturan Kişi Bilgileri
  creatorId: z.string().min(1, { message: "Oluşturan kişi seçimi zorunludur" }),
  creatorInsId: z.string().min(1, { message: "Oluşturan kurum seçimi zorunludur" }),

  // Randevu Bilgileri
  title: z.string()
    .min(3, { message: "Başlık en az 3 karakter olmalıdır" })
    .max(100, { message: "Başlık en fazla 100 karakter olabilir" }),

  content: z.string()
    .min(10, { message: "İçerik en az 10 karakter olmalıdır" })
    .max(500, { message: "İçerik en fazla 500 karakter olabilir" }),

  start: z.string().min(1, { message: "Başlangıç tarihi zorunludur" }),
  end: z.string().min(1, { message: "Bitiş tarihi zorunludur" }),

  // Alıcı Bilgileri
  recipientId: z.string().min(1, { message: "Alıcı kullanıcı seçimi zorunludur" }),
  recipientInsId: z.string().min(1, { message: "Alıcı kurum seçimi zorunludur" })
});

type Inputs = z.infer<typeof schema>;

interface EventFormProps {
  type: "create" | "update";
  data?: any;
}

const EventForm = ({ type, data }: EventFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...data,
    },
  });

  // İzlenen form alanları
  const selectedCreatorId = watch("creatorId");
  const selectedRecipientInsId = watch("recipientInsId");

  // Creator ID değiştiğinde bilgileri getir
  useEffect(() => {
    if (selectedCreatorId) {
      fetchCreatorInfo(selectedCreatorId);
    }
  }, [selectedCreatorId]);

  // Form yüklendiğinde mevcut verileri doldur
  useEffect(() => {
    if (data && type === "update") {
      reset(data);
      if (data.creatorId) {
        fetchCreatorInfo(data.creatorId);
      }
    }
  }, [data, type, reset]);

  // Creator bilgilerini getir
  const fetchCreatorInfo = async (creatorId: string) => {
    try {
      const response = await fetch(`/api/users/detail/${creatorId}`);
      if (!response.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }
      const data = await response.json();
      setCreatorInfo(data);
      setValue("creatorInsId", data.institutionId);
      toast.success('Oluşturan kişi bilgileri yüklendi');
    } catch (error) {
      console.error("Creator bilgisi alınamadı:", error);
      toast.error('Oluşturan kişi bilgileri alınamadı');
    }
  };

  // Form gönderimi
  const onSubmit = async (formData: Inputs) => {
    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);

        // Form verilerini konsola yazdıralım (debug için)
        console.log('Form data being submitted:', formData);

        const endpoint = type === "create" ? '/api/appointments' : `/api/appointments/${data?.id}`;
        const method = type === "create" ? 'POST' : 'PUT';

        // Form verilerini API'ye göndermeden önce doğrulayalım
        const validationResult = schema.safeParse(formData);
        if (!validationResult.success) {
          throw new Error('Form validation failed');
        }

        // Form verilerini API'ye gönderelim
        const requestData = {
          title: formData.title,
          content: formData.content,
          start: formData.start,
          end: formData.end,
          creatorId: formData.creatorId,
          creatorInsId: formData.creatorInsId,
          recipientId: formData.recipientId,
          recipientInsId: formData.recipientInsId,
        };

        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'İşlem başarısız oldu');
        }

        await response.json();
        router.refresh();
        router.push('/list/events');
        resolve('İşlem başarıyla tamamlandı');
      } catch (error) {
        console.error('Hata:', error);
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(submitPromise, {
      loading: type === "create" ? 'Randevu kaydediliyor...' : 'Randevu güncelleniyor...',
      success: type === "create" ? 'Randevu başarıyla kaydedildi!' : 'Randevu başarıyla güncellendi!',
      error: (err) => `Hata: ${err.message}`
    });
  };

  return (
    <form className="flex flex-col gap-4 max-w-7xl mx-auto w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Randevu Oluştur" : "Randevu Düzenle"}
      </h1>

      {/* Oluşturan Kişi Bilgileri */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">Oluşturan Kişi Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Oluşturan Kişi ID"
            name="creatorId"
            register={register}
            error={errors?.creatorId}
          />

          {creatorInfo && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500">Oluşturan Kişi</label>
                <input
                  type="text"
                  value={`${creatorInfo.firstName || ''} ${creatorInfo.lastName || ''}`}
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-50"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500">Oluşturan Kurum</label>
                <input
                  type="text"
                  value={creatorInfo.institution?.name || ''}
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-50"
                  disabled
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Randevu Bilgileri */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">Randevu Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Başlık"
            name="title"
            register={register}
            error={errors?.title}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">İçerik</label>
            <textarea
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm min-h-[100px] resize-none w-full"
              {...register("content")}
            />
            {errors.content?.message && (
              <p className="text-xs text-red-400">{errors.content.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              {...register("start")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
            {errors.start?.message && (
              <p className="text-xs text-red-400">{errors.start.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500">Bitiş Tarihi</label>
            <input
              type="datetime-local"
              {...register("end")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
            {errors.end?.message && (
              <p className="text-xs text-red-400">{errors.end.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Alıcı Bilgileri */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">Alıcı Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InstitutionSelect
            label="Alıcı Kurum"
            register={register}
            name="recipientInsId"
            error={errors.recipientInsId}
            defaultValue={data?.recipientInsId}
            showInstitutionName={true} // Bunu ekleyin
          />

          <UserSelect
            label="Alıcı Kullanıcı"
            name="recipientId"
            register={register}
            error={errors.recipientId}
            institutionId={selectedRecipientInsId}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "İşlem yapılıyor..." : type === "create" ? "Oluştur" : "Güncelle"}
      </button>
    </form>
  );
};

export default EventForm;