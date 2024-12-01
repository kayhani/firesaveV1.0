import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Önce veritabanını temizle
  await prisma.user.deleteMany()

  console.log('Veritabanı temizlendi')

  // Admin kullanıcısı oluştur
  const adminPassword = await hash('1070Frt86', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Fırat Salmanoğlu',
      email: 'firatsalmanoglu@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      
    }
  })

  console.log('Admin kullanıcısı oluşturuldu:', admin)


  const devicetypes = await prisma.deviceTypes.createMany({
    data: [
        {name : "Yangın Tüpü"},
        {name : "Yangın Alarm Sistemi"},
        {name : "Flaşör"},
        {name : "Otomatik Su Sıstemi"},
        {name : "Otomatik Kapaklı Söndürme Sistemi"},
        {name : "Sprinkler"},
        {name : "Otomatik Gazlı Söndürme Sistemi"},
        {name : "Yangın Güvenlik Kapısı"},
        {name : "Duman Dedektörü"},
        {name : "Isı Dedektörü"},
        {name : "Yangın Merdiveni"},
        {name : "Yangın Hortumu"},
        {name : "Kaçış Yolu"},
        {name : "Alev Dedektörü"},
    ]
  })
  console.log('Device types olusturuldu:', devicetypes)

  const roller = await prisma.roles.createMany({
    data: [
        {name : "Admin"},
        {name : "Su"},
        {name : "User"},
        {name : "Guest"},
        {name : "1. Sevıye Servıs Sağlayıcı"},
        {name : "2. Seviye Servıs Sağlayıcı"},
        {name : "1. Seviye Müşteri"},
        {name : "2. Seviye Müşteri"},
    ]
  })
  console.log('Device types olusturuldu:', roller)

  
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })