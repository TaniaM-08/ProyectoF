import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Clean existing data (in reverse order due to foreign key constraints)
  await prisma.appointmentStatusHistory.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.user.deleteMany()

  console.log('Existing data cleaned...')

  // Create passwords and users...
  const hashedPassword = await bcrypt.hash('123Isa', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Isabel Luo Pan',
      email: 'ialuo@tptc.com',
      password: hashedPassword,
      phone: '+507 6210-4567',
      address: '123 Admin Street, David, Chiriquí',
      role: 'ADMIN',
    },
  })

  const employee1 = await prisma.user.create({
    data: {
      name: 'Maria Rodriguez',
      email: 'mariarotriguez@tptc.com',
      password: hashedPassword,
      phone: '+507 6234-5678',
      address: '456 Employee Ave, David, Chiriquí',
      role: 'EMPLOYEE'
    },
  })

  const employee2 = await prisma.user.create({
    data: {
      name: 'Carlos Mendez',
      email: 'carlosmendez@tptc.com',
      password: hashedPassword,
      phone: '+507 6345-6789',
      address: '789 Worker Blvd, David, Chiriquí',
      role: 'EMPLOYEE'
    },
  })

  const client1 = await prisma.user.create({
    data: {
      name: 'Ana Garcia',
      email: 'anagarcia@gmail.com',
      password: hashedPassword,
      phone: '+507 6456-7890',
      address: '321 Client Road, Boquete, Chiriquí',
      role: 'CLIENT' 
    },
  })

  const client2 = await prisma.user.create({
    data: {
      name: 'Roberto Silva',
      email: 'robertosilvia@outlook.com',
      password: hashedPassword,
      phone: '+507 6567-8901',
      address: '654 Customer Lane, Dolega, Chiriquí',
      role: 'CLIENT' 
    },
  })

  const client3 = await prisma.user.create({
    data: {
      name: 'Sofia Martinez',
      email: 'sofiamartinez@yahoo.com',
      password: hashedPassword,
      phone: '+507 6678-9012',
      address: '987 Buyer Street, Puerto Armuelles, Chiriquí',
      role: 'CLIENT' 
    },
  })

  console.log('Users created...')


  const airConditioningCategory = await prisma.category.create({
    data: {
      name: 'Air Conditioning',
      slug: 'air-conditioning',
      description: 'Complete air conditioning systems and components',
      imageUrl: 'https://www.bhg.com/thmb/YDFKAKtlUjBFdvmpHqdSz08Dad4=/4000x0/filters:no_upscale():strip_icc()/bhg-portable-air-conditioners-may-24-test-frigidaire-fhpc082ac1-room-brie-goldman-17-b8ac2c41a768405d83b3fe56cb29e484.jpeg',
    },
  })

  const hvacCategory = await prisma.category.create({
    data: {
      name: 'HVAC Systems',
      slug: 'hvac-systems',
      description: 'Heating, ventilation, and air conditioning systems',
      imageUrl: 'https://cdn.prod.website-files.com/65429c01197f6f9bf0e8f71f/66dcac3f4b2ffab38541828b_hvac-system-parts.png.jpg',
    },
  })

  const partsCategory = await prisma.category.create({
    data: {
      name: 'Parts & Accessories',
      slug: 'parts-accessories',
      description: 'Replacement parts and accessories for HVAC systems',
      imageUrl: 'https://cdn-ds.com/blogs-media/sites/181/2021/10/12082341/Auto-parts-and-accessories_A_o.jpg',
    },
  })

  const toolsCategory = await prisma.category.create({
    data: {
      name: 'Tools & Equipment',
      slug: 'tools-equipment',
      description: 'Professional tools and equipment for HVAC work',
      imageUrl: 'https://www.roofingcontractor.com/ext/resources/Issues/2017/March/sustainableroofing_main.jpg?1489678753',
    },
  })

  console.log('Categories created...')


  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Split AC Unit 12000 BTU',
        description: 'Energy efficient split air conditioning unit perfect for medium-sized rooms',
        price: 750.00,
        imageUrl: 'https://m.media-amazon.com/images/I/71nkylFEqFL.jpg',
        stock: 15,
        featured: true,
        rating: 4.5,
        categoryId: airConditioningCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Central AC System 24000 BTU',
        description: 'Complete central air conditioning system for large homes',
        price: 2500.00,
        imageUrl: 'https://www.pioneerminisplit.com/cdn/shop/products/DR_MAIN_24K.jpg?v=1597249980',
        stock: 8,
        featured: true,
        rating: 4.8,
        categoryId: airConditioningCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Window AC Unit 8000 BTU',
        description: 'Compact window air conditioning unit for small rooms',
        price: 350.00,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5qfW_zlbxQd1gwvcJtPJRFgtjELMSZuW4Ug&s',
        stock: 25,
        featured: false,
        rating: 4.2,
        categoryId: airConditioningCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Heat Pump System',
        description: 'Efficient heat pump system for year-round climate control',
        price: 3200.00,
        imageUrl: 'https://www.energy.gov/sites/default/files/styles/full_article_width/public/2022-03/shutterstock_1179501688_1.jpg?itok=ZMvtg8n4',
        stock: 5,
        featured: true,
        rating: 4.7,
        categoryId: hvacCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Air Filter Set (4-pack)',
        description: 'High-quality HEPA air filters for improved air quality',
        price: 45.00,
        imageUrl: 'https://i5.walmartimages.com/seo/4-Pack-True-HEPA-Replacement-Filter-Compatible-with-VAVSEA-Air-Purifier-H13-True-HEPA-Air-Filter-Set_7977f5e1-b22e-43c4-885b-8d36286ba83b.ddb18810f5c4c24ab06ddaa5dfb4fb0a.png?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
        stock: 100,
        featured: false,
        rating: 4.3,
        categoryId: partsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Refrigerant R-410A',
        description: 'Eco-friendly refrigerant for modern AC systems',
        price: 85.00,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFz9vg9GkbR5u6jQ0jkiv6Ld9u2FDzIgbixw&s',
        stock: 50,
        featured: false,
        rating: 4.6,
        categoryId: partsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Digital Manifold Gauge Set',
        description: 'Professional digital manifold gauge set for HVAC technicians',
        price: 320.00,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk_oGyFlQrV9XnksJbfhT3surfoW_BNcGtBA&s',
        stock: 12,
        featured: false,
        rating: 4.4,
        categoryId: toolsCategory.id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Vacuum Pump 4 CFM',
        description: 'High-performance vacuum pump for system maintenance',
        price: 180.00,
        imageUrl: 'https://www.robinair.com/sites/default/files/images/15400_1.jpg',
        stock: 8,
        featured: false,
        rating: 4.5,
        categoryId: toolsCategory.id,
      },
    }),
  ])

  console.log('Products created...')


  const quote1 = await prisma.quote.create({
    data: {
      quoteNumber: 'QUO-2025-001',
      clientName: 'Ana Garcia',
      clientEmail: 'anagarcia@gmail.com',
      clientPhone: '+507 6456-7890',
      clientAddress: '321 Client Road, Boquete, Chiriquí',
      status: 'SENT',
      subtotal: 750.00,
      discountAmount: 50.00,
      total: 700.00,
      notesProblem: 'Need AC installation for living room - very hot during summer',
      sizeRoom: '25 square meters',
      validUntil: new Date('2025-07-01'),
      userId: client1.id,
      createdBy: employee1.id,
    },
  })

  const quote2 = await prisma.quote.create({
    data: {
      quoteNumber: 'QUO-2025-002',
      clientName: 'Roberto Silva',
      clientEmail: 'robertosilvia@outlook.com',
      clientPhone: '+507 6567-8901',
      clientAddress: '654 Customer Lane, Dolega, Chiriquí',
      status: 'APPROVED',
      subtotal: 2500.00,
      discountAmount: 0.00,
      total: 2500.00,
      notesProblem: 'Central AC system replacement - old system not working efficiently',
      sizeRoom: '150 square meters',
      validUntil: new Date('2025-08-15'),
      userId: client2.id,
      createdBy: admin.id,
      approvedBy: admin.id,
      approvedAt: new Date(),
    },
  })

  const quote3 = await prisma.quote.create({
    data: {
      quoteNumber: 'QUO-2025-003',
      clientName: 'Sofia Martinez',
      clientEmail: 'sofiamartinez@yahoo.com',
      clientPhone: '+507 6678-9012',
      clientAddress: '987 Buyer Street, Puerto Armuelles, Chiriquí',
      status: 'DRAFT',
      subtotal: 350.00,
      discountAmount: 0.00,
      total: 350.00,
      notesProblem: 'Window AC for bedroom - current unit making noise',
      sizeRoom: '15 square meters',
      validUntil: new Date('2025-06-30'),
      userId: client3.id,
      createdBy: employee2.id,
    },
  })

  console.log('Quotes created...')


  const order1 = await prisma.order.create({
    data: {
      userId: client2.id,
      quoteId: quote2.id,
      orderNumber: 'ORD-2025-001',
      status: 'PROCESSING',
      subtotal: 2500.00,
      taxAmount: 175.00,
      shippingAmount: 100.00,
      discountAmount: 0.00,
      total: 2775.00,
      shippingAddress: '654 Customer Lane, Dolega, Chiriquí',
      billingAddress: '654 Customer Lane, Dolega, Chiriquí',
      notes: 'Customer prefers installation on weekends',
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: client1.id,
      quoteId: quote1.id,
      orderNumber: 'ORD-2025-002',
      status: 'SHIPPED',
      subtotal: 395.00,
      taxAmount: 27.65,
      shippingAmount: 25.00,
      discountAmount: 10.00,
      total: 437.65,
      shippingAddress: '321 Client Road, Boquete, Chiriquí',
      billingAddress: '321 Client Road, Boquete, Chiriquí',
      notes: 'Express delivery requested',
      shippedAt: new Date(),
    },
  })

    const order3 = await prisma.order.create({
    data: {
      userId: client3.id,
      quoteId: quote3.id,
      orderNumber: 'ORD-2025-003',
      status: 'SHIPPED',
      subtotal: 397.00,
      taxAmount: 29.65,
      shippingAmount: 27.00,
      discountAmount: 13.00,
      total: 437.65,
      shippingAddress: '333 Client Road, Boquete, Chiriquí',
      billingAddress: '333 Client Road, Boquete, Chiriquí',
      notes: 'Express delivery requested',
      shippedAt: new Date(),
    },
  })

  console.log('Orders created...')


  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: products[1].id, 
        productName: 'Central AC System 24000 BTU',
        quantity: 1,
        unitPrice: 2500.00,
        totalPrice: 2500.00,
      },
      {
        orderId: order2.id,
        productId: products[2].id, 
        productName: 'Window AC Unit 8000 BTU',
        quantity: 1,
        unitPrice: 350.00,
        totalPrice: 350.00,
      },
      {
        orderId: order2.id,
        productId: products[4].id, 
        productName: 'Air Filter Set (4-pack)',
        quantity: 1,
        unitPrice: 45.00,
        totalPrice: 45.00,
      },
      {
        orderId: order3.id,
        productId: products[3].id, 
        productName: 'Heat Pump System',
        quantity: 1,
        unitPrice: 3200.00,
        totalPrice: 3200.00,
      },
    ],
  })

  console.log('Order items created...')


  const appointment1 = await prisma.appointment.create({
    data: {
      appointmentNumber: 'APP-2025-001',
      appointmentType: 'CONSULTATION',
      status: 'SCHEDULED',
      title: 'AC System Consultation',
      description: 'Initial consultation for central AC system installation',
      scheduledDate: new Date('2025-06-10'),
      scheduledTime: new Date('2025-06-10T09:00:00'),
      durationMinutes: 90,
      clientName: 'Roberto Silva',
      clientEmail: 'roberto@outlook.com',
      clientPhone: '+507 6567-8901',
      clientAddress: '654 Customer Lane, Dolega, Chiriquí',
      notes: 'Client wants to discuss energy efficiency options',
      userId: client2.id,
      quoteId: quote2.id,
      orderId: order1.id,
      assignedTo: employee1.id,
      createdBy: admin.id,
    },
  })

  const appointment2 = await prisma.appointment.create({
    data: {
      appointmentNumber: 'APP-2025-002',
      appointmentType: 'INSTALLATION',
      status: 'CONFIRMED',
      title: 'Central AC Installation',
      description: 'Installation of new central AC system',
      scheduledDate: new Date('2025-06-15'),
      scheduledTime: new Date('2025-06-15T08:00:00'),
      durationMinutes: 480, // 8 hours
      clientName: 'Roberto Silva',
      clientEmail: 'roberto@outlook.com',
      clientPhone: '+507 6567-8901',
      clientAddress: '654 Customer Lane, Dolega, Chiriquí',
      notes: 'Full day installation - bring complete tool set',
      internalNotes: 'Customer has pets - be mindful when opening doors',
      userId: client2.id,
      quoteId: quote2.id,
      orderId: order1.id,
      assignedTo: employee1.id,
      createdBy: admin.id,
    },
  })

  const appointment3 = await prisma.appointment.create({
    data: {
      appointmentNumber: 'APP-2025-003',
      appointmentType: 'DELIVERY',
      status: 'COMPLETED',
      title: 'Window AC Delivery',
      description: 'Delivery of window AC unit and filters',
      scheduledDate: new Date('2025-06-05'),
      scheduledTime: new Date('2025-06-05T14:00:00'),
      durationMinutes: 30,
      clientName: 'Ana Garcia',
      clientEmail: 'ana@gmail.com',
      clientPhone: '+507 6456-7890',
      clientAddress: '321 Client Road, Boquete, Chiriquí',
      notes: 'Leave at front door if no one home',
      completionNotes: 'Delivered successfully - customer signed receipt',
      userId: client1.id,
      orderId: order2.id,
      assignedTo: employee2.id,
      createdBy: employee1.id,
      completedAt: new Date('2025-06-05T14:25:00'),
    },
  })

  console.log('Appointments created...')


  await prisma.cartItem.createMany({
    data: [
      {
        userId: client1.id,
        productId: products[0].id, 
        quantity: 1,
      },
      {
        userId: client3.id,
        productId: products[2].id, 
        quantity: 1,
      },
      {
        userId: client3.id,
        productId: products[4].id, 
        quantity: 2,
      },
    ],
  })

  console.log('Cart items created...')


  await prisma.invoice.createMany({
    data: [
      {
        orderId: order1.id,
        quoteId: quote2.id,
        invoiceNumber: 'INV-2025-001',
        amount: 2500.00,
        taxAmount: 175.00,
        totalAmount: 2675.00,
        dueDate: new Date('2025-07-01'),
      },
      {
        orderId: order2.id,
        invoiceNumber: 'INV-2025-002',
        amount: 395.00,
        taxAmount: 27.65,
        totalAmount: 422.65,
        dueDate: new Date('2025-06-20'),
        paidAt: new Date('2025-06-06'),
      },
    ],
  })

  console.log('Invoices created...')


  await prisma.appointmentStatusHistory.createMany({
    data: [
      {
        oldStatus: null,
        newStatus: 'SCHEDULED',
        appointmentId: appointment1.id,
        changedBy: admin.id,
        notes: 'Initial appointment scheduled',
      },
      {
        oldStatus: 'SCHEDULED',
        newStatus: 'CONFIRMED',
        appointmentId: appointment2.id,
        changedBy: employee1.id,
        notes: 'Customer confirmed availability',
      },
      {
        oldStatus: null,
        newStatus: 'SCHEDULED',
        appointmentId: appointment3.id,
        changedBy: employee1.id,
        notes: 'Delivery scheduled',
      },
      {
        oldStatus: 'SCHEDULED',
        newStatus: 'COMPLETED',
        appointmentId: appointment3.id,
        changedBy: employee2.id,
        notes: 'Delivery completed successfully',
      },
    ],
  })

  console.log('Appointment status history created...')


  await prisma.expense.createMany({
    data: [
      {
        description: 'Vehicle fuel for deliveries',
        amount: 120.50,
        category: 'Transportation',
        date: new Date('2025-06-01'),
      },
      {
        description: 'New drill bits and screws',
        amount: 65.75,
        category: 'Tools & Equipment',
        date: new Date('2025-06-02'),
      },
      {
        description: 'Office supplies - invoices and forms',
        amount: 35.20,
        category: 'Office Supplies',
        date: new Date('2025-06-03'),
      },
      {
        description: 'Lunch for installation crew',
        amount: 45.00,
        category: 'Meals',
        date: new Date('2025-06-04'),
      },
      {
        description: 'Safety equipment - gloves and goggles',
        amount: 85.30,
        category: 'Safety',
        date: new Date('2025-06-05'),
      },
    ],
  })

  console.log('Expenses created...')

  // Summary
  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    quotes: await prisma.quote.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
    appointments: await prisma.appointment.count(),
    cartItems: await prisma.cartItem.count(),
    invoices: await prisma.invoice.count(),
    appointmentStatusHistory: await prisma.appointmentStatusHistory.count(),
    expenses: await prisma.expense.count(),
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   Users: ${counts.users}`)
  console.log(`   Categories: ${counts.categories}`)
  console.log(`   Products: ${counts.products}`)
  console.log(`   Quotes: ${counts.quotes}`)
  console.log(`   Orders: ${counts.orders}`)
  console.log(`   Order Items: ${counts.orderItems}`)
  console.log(`   Appointments: ${counts.appointments}`)
  console.log(`   Cart Items: ${counts.cartItems}`)
  console.log(`   Invoices: ${counts.invoices}`)
  console.log(`   Appointment Status History: ${counts.appointmentStatusHistory}`)
  console.log(`   Expenses: ${counts.expenses}`)
  
  console.log('\n🔐 Default login credentials:')
  console.log('   Admin: ialuo@tptc.com / 123Isa')
  console.log('   Employee: mariarotriguez@tptc.com / 123Isa')
  console.log('   Client: anagarcia@gmail.com / 123Isa')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })