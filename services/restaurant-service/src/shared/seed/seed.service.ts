import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '@restaurant/repository/category.repository';
import { MenuItemRepository } from '@restaurant/repository/menu_item.repository';
import { RestaurantRepository } from '@restaurant/repository/restaurant.repository';
import { ElasticsearchService } from '@restaurant/shared/search/elasticsearch.service';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(MenuItemRepository)
    private menuItemRepository: MenuItemRepository,
    @InjectRepository(RestaurantRepository)
    private restaurantRepository: RestaurantRepository,
    private elasticSearch: ElasticsearchService,
    private logger: Logger,
  ) {}

  async seedRestaurant() {
    const restaurants = [
      {
        name: 'Phở Hà Nội 24h',
        description:
          'Phở bò truyền thống Hà Nội, nước dùng ngọt thanh từ xương bò niêu 12 tiếng. Phục vụ 24/7.',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        latitude: 10.7769,
        longitude: 106.7009,
        phone: '0901234567',
        email: 'pho.hanoi24h@gmail.com',
        images: [
          'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500',
          'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500',
        ],
        is_active: true,
        rating: 4.5,
        total_reviews: 1250,
        opening_hours: {
          monday: { open: '06:00', close: '22:00', is_closed: false },
          tuesday: { open: '06:00', close: '22:00', is_closed: false },
          wednesday: { open: '06:00', close: '22:00', is_closed: false },
          thursday: { open: '06:00', close: '22:00', is_closed: false },
          friday: { open: '06:00', close: '23:00', is_closed: false },
          saturday: { open: '06:00', close: '23:00', is_closed: false },
          sunday: { open: '07:00', close: '22:00', is_closed: false },
        },
        delivery_fee: 15000,
        estimated_delivery_time: 25,
      },
      {
        name: 'Gà Rán KFC Saigon',
        description:
          'Gà rán giòn tan với 11 loại gia vị bí mật. Combo gia đình siêu tiết kiệm.',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        latitude: 10.7741,
        longitude: 106.7025,
        phone: '0902345678',
        email: 'kfc.saigon@fastfood.com',
        images: [
          'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500',
          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500',
        ],
        is_active: true,
        rating: 4.2,
        total_reviews: 890,
        opening_hours: {
          monday: { open: '07:00', close: '22:00', is_closed: false },
          tuesday: { open: '07:00', close: '22:00', is_closed: false },
          wednesday: { open: '07:00', close: '22:00', is_closed: false },
          thursday: { open: '07:00', close: '22:00', is_closed: false },
          friday: { open: '07:00', close: '23:00', is_closed: false },
          saturday: { open: '07:00', close: '23:00', is_closed: false },
          sunday: { open: '08:00', close: '22:00', is_closed: false },
        },
        delivery_fee: 12000,
        estimated_delivery_time: 20,
      },
      {
        name: 'Bún Bò Huế Cô Ba',
        description:
          'Bún bò Huế chuẩn vị xứ Huế, nước dùng đậm đà cay nồng. Đặc sản chân giò hầm mềm.',
        address: '789 Pasteur, Quận 3, TP.HCM',
        latitude: 10.7829,
        longitude: 106.6934,
        phone: '0903456789',
        email: 'bunbo.coba@hue.com',
        images: [
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500',
        ],
        is_active: true,
        rating: 4.7,
        total_reviews: 2100,
        opening_hours: {
          monday: { open: '07:00', close: '21:00', is_closed: false },
          tuesday: { open: '07:00', close: '21:00', is_closed: false },
          wednesday: { open: '07:00', close: '21:00', is_closed: false },
          thursday: { open: '07:00', close: '21:00', is_closed: false },
          friday: { open: '07:00', close: '23:00', is_closed: false },
          saturday: { open: '08:00', close: '22:00', is_closed: false },
          sunday: { open: '08:00', close: '22:00', is_closed: false },
        },
        delivery_fee: 18000,
        estimated_delivery_time: 35,
      },
      {
        name: 'Pizza Hut Landmark',
        description:
          'Pizza Ý chính hiệu với đế bánh giòn mỏng. Buffet pizza thả ga cuối tuần.',
        address: '101 Đống Đa, Quận Tân Bình, TP.HCM',
        latitude: 10.8006,
        longitude: 106.6519,
        phone: '0904567890',
        email: 'pizzahut.landmark@pizza.com',
        images: [
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
          'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500',
        ],
        is_active: true,
        rating: 4.1,
        total_reviews: 756,
        opening_hours: {
          monday: { open: '10:00', close: '22:30', is_closed: false },
          tuesday: { open: '10:00', close: '22:30', is_closed: false },
          wednesday: { open: '10:00', close: '22:30', is_closed: false },
          thursday: { open: '10:00', close: '22:30', is_closed: false },
          friday: { open: '10:00', close: '23:00', is_closed: false },
          saturday: { open: '11:00', close: '23:00', is_closed: false },
          sunday: { open: '11:00', close: '22:00', is_closed: true },
        },
        delivery_fee: 20000,
        estimated_delivery_time: 40,
      },
      {
        name: 'Trà Sữa Gong Cha',
        description:
          'Trà sữa Đài Loan cao cấp với trân châu tự làm. Độ ngọt tùy chỉnh 0-100%.',
        address: '246 Hai Bà Trưng, Quận 3, TP.HCM',
        latitude: 10.7756,
        longitude: 106.6877,
        phone: '0905678901',
        email: 'gongcha.hbt@milktea.com',
        images: [
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
          'https://images.unsplash.com/photo-1571671022584-f6a5aed5acff?w=500',
        ],
        is_active: true,
        rating: 4.3,
        total_reviews: 1680,
        opening_hours: {
          monday: { open: '08:00', close: '23:00', is_closed: false },
          tuesday: { open: '08:00', close: '23:00', is_closed: false },
          wednesday: { open: '08:00', close: '23:00', is_closed: false },
          thursday: { open: '08:00', close: '23:00', is_closed: false },
          friday: { open: '08:30', close: '22:00', is_closed: false },
          saturday: { open: '09:00', close: '22:00', is_closed: false },
          sunday: { open: '11:00', close: '22:00', is_closed: true },
        },
        delivery_fee: 10000,
        estimated_delivery_time: 15,
      },
    ];

    for (const restaurant of restaurants) {
      const seed = this.restaurantRepository.create(restaurant);
      await this.restaurantRepository.save(seed);
      await this.elasticSearch.indexRestaurant(seed);
    }

    this.logger.log('Seed data restaurant successfully');
  }

  async seedCategory() {
    const categories = [
      {
        name: 'Món Chính',
        description: 'Các món ăn chính như cơm, phở, bún',
        image:
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300',
        is_active: true,
      },
      {
        name: 'Đồ Uống',
        description: 'Nước ngọt, trà sữa, cà phê',
        image:
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
        is_active: true,
      },
      {
        name: 'Tráng Miệng',
        description: 'Bánh ngọt, kem, chè',
        image:
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300',
        is_active: true,
      },
      {
        name: 'Khai Vị',
        description: 'Nem, chả, gỏi cuốn',
        image:
          'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300',
        is_active: true,
      },
      {
        name: 'Lẩu & Nướng',
        description: 'Lẩu các loại và đồ nướng',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300',
        is_active: true,
      },
    ];

    for (const category of categories) {
      const seed = this.categoryRepository.create(category);
      await this.categoryRepository.save(seed);
    }

    this.logger.log('Seed data category successfully');
  }

  async seedMenuItem() {
    const menuItems = [
      {
        name: 'Phở Bò Tái',
        description: 'Phở bò với thịt tái mềm, nước dùng trong vắt đậm đà',
        price: 65000,
        images: [
          'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
        ],
        is_available: true,
        preparation_time: 15,
        restaurant_id: '48fe5432-f84b-456f-9107-265a08c13865',
        category_id: '7e7fa067-52c2-4630-8e27-15fcf1cc5b19',
      },
      {
        name: 'Phở Bò Chín',
        description: 'Phở bò với thịt chín mềm thơm, phù hợp mọi lứa tuổi',
        price: 70000,
        images: [
          'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
        ],
        is_available: true,
        preparation_time: 15,
        restaurant_id: '48fe5432-f84b-456f-9107-265a08c13865',
        category_id: '7e7fa067-52c2-4630-8e27-15fcf1cc5b19',
      },
      {
        name: 'Nước Cam Tươi',
        description: 'Cam Sành Cao Lãnh vắt tươi 100%, không đường',
        price: 25000,
        images: [
          'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
        ],
        is_available: true,
        preparation_time: 5,
        restaurant_id: '48fe5432-f84b-456f-9107-265a08c13865',
        category_id: 'e2a38f0a-e388-47ff-b05f-1cae09470e86',
      },

      // KFC Saigon (rest-2)
      {
        name: 'Combo Gà Rán 2 Miếng',
        description: 'Combo gà rán giòn tan + khoai tây chiên + coca',
        price: 89000,
        images: [
          'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400',
        ],
        is_available: true,
        preparation_time: 12,
        restaurant_id: 'd5be6327-ab7f-42c7-a8c7-d4dfe990938b',
        category_id: '7e7fa067-52c2-4630-8e27-15fcf1cc5b19',
      },
      {
        name: 'Gà Popcorn Cay',
        description: 'Gà bơm giòn cắt hạt lựu, tương ớt cay nồng',
        price: 55000,
        images: [
          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
        ],
        is_available: true,
        preparation_time: 8,
        restaurant_id: 'd5be6327-ab7f-42c7-a8c7-d4dfe990938b',
        category_id: 'd52ca7c9-1f21-4f65-b21c-260ffb162b2a',
      },

      // Bún Bò Huế Cô Ba (rest-3)
      {
        name: 'Bún Bò Huế Đặc Biệt',
        description: 'Bún bò Huế với chả cua, chân giò, huyết, thịt bò',
        price: 85000,
        images: [
          'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
        ],
        is_available: true,
        preparation_time: 20,
        restaurant_id: '9a905f6e-8183-4523-a635-92f5d181a774',
        category_id: '7e7fa067-52c2-4630-8e27-15fcf1cc5b19',
      },
      {
        name: 'Nem Nướng Nha Trang',
        description: 'Nem nướng thơm phức, chấm mắm nêm đậm đà',
        price: 45000,
        images: [
          'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400',
        ],
        is_available: true,
        preparation_time: 15,
        restaurant_id: '9a905f6e-8183-4523-a635-92f5d181a774',
        category_id: 'd52ca7c9-1f21-4f65-b21c-260ffb162b2a',
      },

      // Pizza Hut Landmark (rest-4)
      {
        name: 'Pizza Hải Sản Supreme',
        description: 'Pizza hải sản với tôm, mực, cua, phô mai mozzarella',
        price: 189000,
        images: [
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        ],
        is_available: true,
        preparation_time: 25,
        restaurant_id: '3e78e1de-d581-4704-bfe4-47121de7cf5e',
        category_id: '7e7fa067-52c2-4630-8e27-15fcf1cc5b19',
      },
      {
        name: 'Bánh Tiramisu',
        description: 'Tiramisu Ý chính hiệu với mascarpone và cà phê espresso',
        price: 49000,
        images: [
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        ],
        is_available: true,
        preparation_time: 5,
        restaurant_id: '3e78e1de-d581-4704-bfe4-47121de7cf5e',
        category_id: '23a99fb0-5742-4631-aca9-94606d78490b',
      },

      // Gong Cha (rest-5)
      {
        name: 'Trà Sữa Trân Châu Đường Đen',
        description: 'Trà sữa Đài Loan với trân châu đường đen thơm ngậy',
        price: 42000,
        images: [
          'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        ],
        is_available: true,
        preparation_time: 8,
        restaurant_id: '04340969-32ed-437d-8cd1-de0270e45a5f',
        category_id: 'e2a38f0a-e388-47ff-b05f-1cae09470e86',
      },
      {
        name: 'Matcha Latte Đá',
        description: 'Matcha Nhật Bản nguyên chất pha với sữa tươi',
        price: 48000,
        images: [
          'https://images.unsplash.com/photo-1571671022584-f6a5aed5acff?w=400',
        ],
        is_available: true,
        preparation_time: 6,
        restaurant_id: '04340969-32ed-437d-8cd1-de0270e45a5f',
        category_id: 'e2a38f0a-e388-47ff-b05f-1cae09470e86',
      },
    ];

    for (const menuItem of menuItems) {
      const seed = this.menuItemRepository.create(menuItem);
      await this.menuItemRepository.save(seed);
    }

    this.logger.log('Seed data menu item successfully');
  }
}
