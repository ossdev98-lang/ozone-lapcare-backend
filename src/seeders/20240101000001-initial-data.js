'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Users
    await queryInterface.bulkInsert('Users', [
      { id: 1, name: 'Admin User', email: 'admin@ozoneLapcare.com', phone: '9999999999', password: await bcrypt.hash('Admin@123', 12), role: 'ADMIN', status: 'active', isEmailVerified: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Test Customer', email: 'customer@test.com', phone: '8888888888', password: await bcrypt.hash('Test@123', 12), role: 'CUSTOMER', status: 'active', isEmailVerified: true, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Categories
    await queryInterface.bulkInsert('Categories', [
      { id: 1, name: 'Laptops', slug: 'laptops', description: 'All types of laptops', icon: 'FiMonitor', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Gaming Laptops', slug: 'gaming-laptops', description: 'High performance gaming laptops', icon: 'FiZap', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Laptop Parts', slug: 'laptop-parts', description: 'SSDs, RAM, batteries and more', icon: 'FiCpu', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Accessories', slug: 'accessories', description: 'Bags, mice, keyboards and more', icon: 'FiPackage', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Refurbished', slug: 'refurbished', description: 'Certified refurbished laptops', icon: 'FiRefreshCw', isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Chargers & Power', slug: 'chargers', description: 'Original and compatible chargers', icon: 'FiBattery', isActive: true, sortOrder: 6, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Brands
    await queryInterface.bulkInsert('Brands', [
      { id: 1, name: 'Dell', slug: 'dell', description: 'Dell Technologies', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'HP', slug: 'hp', description: 'HP Inc.', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Lenovo', slug: 'lenovo', description: 'Lenovo Group', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'ASUS', slug: 'asus', description: 'ASUSTeK Computer', isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Acer', slug: 'acer', description: 'Acer Inc.', isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Apple', slug: 'apple', description: 'Apple Inc.', isActive: true, sortOrder: 6, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Products
    await queryInterface.bulkInsert('Products', [
      { id: 1, name: 'Dell Inspiron 15 3520', slug: 'dell-inspiron-15-3520', description: 'Powerful everyday laptop with Intel Core i5, 8GB RAM, 512GB SSD.', shortDescription: 'Intel i5, 8GB RAM, 512GB SSD', sku: 'DELL-INS-3520', price: 54990, comparePrice: 62990, stock: 25, categoryId: 1, brandId: 1, condition: 'new', status: 'active', isFeatured: true, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', avgRating: 4.5, totalReviews: 12, totalSold: 48, viewCount: 320, gstPercent: 18, warrantyMonths: 12, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'ASUS ROG Strix G15', slug: 'asus-rog-strix-g15', description: 'Ultimate gaming laptop with AMD Ryzen 9, RTX 3070, 16GB RAM, 1TB SSD.', shortDescription: 'Ryzen 9, RTX 3070, 16GB, 1TB SSD', sku: 'ASUS-ROG-G15', price: 124990, comparePrice: 139990, stock: 10, categoryId: 2, brandId: 4, condition: 'new', status: 'active', isFeatured: true, isFlashSale: true, flashSalePrice: 114990, tags: [], thumbnail: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', avgRating: 4.8, totalReviews: 24, totalSold: 32, viewCount: 890, gstPercent: 18, warrantyMonths: 12, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Lenovo ThinkPad E14', slug: 'lenovo-thinkpad-e14', description: 'Business laptop with Intel Core i7, 16GB RAM, 512GB SSD.', shortDescription: 'Intel i7, 16GB RAM, 512GB SSD', sku: 'LEN-TP-E14', price: 72990, comparePrice: 82990, stock: 15, categoryId: 1, brandId: 3, condition: 'new', status: 'active', isFeatured: true, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', avgRating: 4.6, totalReviews: 18, totalSold: 55, viewCount: 410, gstPercent: 18, warrantyMonths: 12, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'HP Pavilion 14 Refurbished', slug: 'hp-pavilion-14-refurbished', description: 'Certified refurbished HP Pavilion, Intel Core i5, 8GB RAM, 256GB SSD. Grade A.', shortDescription: 'Intel i5, 8GB RAM, 256GB SSD – Refurbished', sku: 'HP-PAV-14-REF', price: 28990, comparePrice: 45990, stock: 8, categoryId: 5, brandId: 2, condition: 'refurbished', status: 'active', isFeatured: false, isFlashSale: true, flashSalePrice: 26990, tags: [], thumbnail: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', avgRating: 4.2, totalReviews: 9, totalSold: 67, viewCount: 560, gstPercent: 18, warrantyMonths: 6, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Samsung 970 EVO 1TB SSD', slug: 'samsung-970-evo-1tb-ssd', description: 'NVMe M.2 SSD with blazing fast read/write speeds. Perfect laptop upgrade.', shortDescription: '1TB NVMe M.2 SSD, 3500MB/s read', sku: 'SAM-970EVO-1TB', price: 8990, comparePrice: 11990, stock: 50, categoryId: 3, brandId: 1, condition: 'new', status: 'active', isFeatured: false, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', avgRating: 4.9, totalReviews: 42, totalSold: 210, viewCount: 1200, gstPercent: 18, warrantyMonths: 60, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Dell 65W USB-C Charger', slug: 'dell-65w-usbc-charger', description: 'Original Dell 65W USB-C Power Delivery charger. Compatible with most Dell laptops.', shortDescription: '65W USB-C, universal compatibility', sku: 'DELL-CHG-65W', price: 2490, comparePrice: 3490, stock: 100, categoryId: 6, brandId: 1, condition: 'new', status: 'active', isFeatured: false, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500', avgRating: 4.4, totalReviews: 31, totalSold: 185, viewCount: 780, gstPercent: 18, warrantyMonths: 12, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'HP Victus 16 Gaming', slug: 'hp-victus-16-gaming', description: 'HP Victus gaming laptop with Intel Core i5, GTX 1650, 8GB RAM, 512GB SSD.', shortDescription: 'Intel i5, GTX 1650, 8GB, 512GB SSD', sku: 'HP-VIC-16', price: 62990, comparePrice: 72990, stock: 12, categoryId: 2, brandId: 2, condition: 'new', status: 'active', isFeatured: true, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', avgRating: 4.3, totalReviews: 15, totalSold: 28, viewCount: 450, gstPercent: 18, warrantyMonths: 12, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Crucial 16GB DDR4 RAM', slug: 'crucial-16gb-ddr4-ram', description: '16GB DDR4 3200MHz laptop RAM. Compatible with most modern laptops.', shortDescription: '16GB DDR4 3200MHz SODIMM', sku: 'CRU-16GB-DDR4', price: 3490, comparePrice: 4990, stock: 75, categoryId: 3, brandId: 1, condition: 'new', status: 'active', isFeatured: false, isFlashSale: false, tags: [], thumbnail: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500', avgRating: 4.7, totalReviews: 28, totalSold: 142, viewCount: 680, gstPercent: 18, warrantyMonths: 36, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Coupons
    await queryInterface.bulkInsert('Coupons', [
      { id: 1, code: 'OZONE10', type: 'percentage', value: 10, minOrderAmount: 5000, maxDiscount: 2000, usageLimit: 100, usedCount: 0, userLimit: 1, isActive: true, description: '10% off on all products (max ₹2000)', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
      { id: 2, code: 'FLAT500', type: 'fixed', value: 500, minOrderAmount: 3000, usageLimit: 200, usedCount: 0, userLimit: 1, isActive: true, description: 'Flat ₹500 off on orders above ₹3000', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
      { id: 3, code: 'WELCOME20', type: 'percentage', value: 20, minOrderAmount: 10000, maxDiscount: 3000, usageLimit: 50, usedCount: 0, userLimit: 1, isActive: true, description: '20% off for new customers', expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Repair Services
    await queryInterface.bulkInsert('RepairServices', [
      { id: 1, name: 'Screen Replacement', description: 'Replace damaged or cracked laptop screen', price: 2999, priceType: 'starting_from', estimatedDays: 2, isActive: true, icon: 'FiMonitor', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Battery Replacement', description: 'Replace old, swollen or dead battery', price: 1499, priceType: 'starting_from', estimatedDays: 1, isActive: true, icon: 'FiBattery', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Keyboard Replacement', description: 'Fix or replace damaged keyboard', price: 1999, priceType: 'starting_from', estimatedDays: 1, isActive: true, icon: 'FiType', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'RAM Upgrade', description: 'Upgrade your laptop RAM for better performance', price: 999, priceType: 'starting_from', estimatedDays: 1, isActive: true, icon: 'FiCpu', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'SSD Upgrade', description: 'Replace HDD with SSD or upgrade storage', price: 1499, priceType: 'starting_from', estimatedDays: 1, isActive: true, icon: 'FiHardDrive', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Motherboard Repair', description: 'Complex motherboard diagnostics and repair', price: 3999, priceType: 'starting_from', estimatedDays: 5, isActive: true, icon: 'FiTool', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Virus Removal', description: 'Complete virus, malware and spyware removal', price: 799, priceType: 'fixed', estimatedDays: 1, isActive: true, icon: 'FiShield', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'OS Installation', description: 'Fresh Windows 10/11 or Linux installation', price: 999, priceType: 'fixed', estimatedDays: 1, isActive: true, icon: 'FiDownload', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Offers
    await queryInterface.bulkInsert('Offers', [
      { id: 1, title: 'Limited offer book your first laptop service at just Rs 99', isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Reset all sequences so next auto-increment works correctly
    const tables = ['Users', 'Categories', 'Brands', 'Products', 'Coupons', 'RepairServices', 'Offers'];
    for (const table of tables) {
      await queryInterface.sequelize.query(
        `SELECT setval('"${table}_id_seq"', (SELECT MAX(id) FROM "${table}"));`
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Offers', null, {});
    await queryInterface.bulkDelete('RepairServices', null, {});
    await queryInterface.bulkDelete('Coupons', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Brands', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
