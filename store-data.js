// Data management functions using GitHub storage
import { github } from './github.js';
import config from './config.js';

class StoreData {
    constructor() {
        this.cache = {
            locations: null,
            announcements: null,
            categories: null,
            items: {}
        };
        this.initializeCache();
    }

    async initializeCache() {
        await Promise.all([
            this.getLocations(true),
            this.getAnnouncements(true),
            this.getCategories(true)
        ]);
    }

    // Store Locations
    async getLocations(forceRefresh = false) {
        if (!forceRefresh && this.cache.locations) {
            return this.cache.locations;
        }

        const locations = await github.getFile(config.paths.locations);
        if (locations) {
            this.cache.locations = locations;
            return locations;
        }
        return [];
    }

    async updateLocations(locations) {
        const success = await github.updateFile(config.paths.locations, locations, 'Update store locations');
        if (success) {
            this.cache.locations = locations;
        }
        return success;
    }

    // Announcements
    async getAnnouncements(forceRefresh = false) {
        if (!forceRefresh && this.cache.announcements) {
            return this.cache.announcements;
        }

        const announcements = await github.getFile(config.paths.announcements);
        if (announcements) {
            this.cache.announcements = announcements;
            return announcements;
        }
        return '';
    }

    async updateAnnouncement(announcement) {
        const success = await github.updateFile(config.paths.announcements, announcement, 'Update store announcement');
        if (success) {
            this.cache.announcements = announcement;
        }
        return success;
    }

    // Categories
    async getCategories(forceRefresh = false) {
        if (!forceRefresh && this.cache.categories) {
            return this.cache.categories;
        }

        const categories = await github.getFile(config.paths.categories);
        if (categories) {
            this.cache.categories = categories;
            return categories;
        }
        return ['Food', 'Electronics'];
    }

    async updateCategories(categories) {
        const success = await github.updateFile(config.paths.categories, categories, 'Update store categories');
        if (success) {
            this.cache.categories = categories;
        }
        return success;
    }

    // Items
    async getItems(category, forceRefresh = false) {
        if (!forceRefresh && this.cache.items[category]) {
            return this.cache.items[category];
        }

        const items = await github.getFile(`${config.paths.items}${category.toLowerCase()}.json`);
        if (items) {
            this.cache.items[category] = items;
            return items;
        }
        return [];
    }

    async updateItems(category, items) {
        const success = await github.updateFile(
            `${config.paths.items}${category.toLowerCase()}.json`,
            items,
            `Update items for ${category}`
        );
        if (success) {
            this.cache.items[category] = items;
        }
        return success;
    }

    // Images
    async uploadImage(imageData, category, itemName) {
        const extension = imageData.split(';')[0].split('/')[1];
        const filename = `${category.toLowerCase()}-${itemName.toLowerCase()}-${Date.now()}.${extension}`;
        return await github.uploadImage(imageData, filename);
    }

    // Sync local storage with GitHub
    async syncWithLocalStorage() {
        // Load everything from GitHub
        const [locations, announcements, categories] = await Promise.all([
            this.getLocations(true),
            this.getAnnouncements(true),
            this.getCategories(true)
        ]);

        // Update localStorage
        localStorage.setItem('store_locations', JSON.stringify(locations));
        localStorage.setItem('announcements', JSON.stringify(announcements));
        localStorage.setItem('categories', JSON.stringify(categories));

        // Sync items for each category
        for (const category of categories) {
            const items = await this.getItems(category, true);
            localStorage.setItem(`items_${category}`, JSON.stringify(items));
        }
    }

    // Push local storage to GitHub
    async pushToGitHub() {
        const locations = JSON.parse(localStorage.getItem('store_locations') || '[]');
        const announcements = JSON.parse(localStorage.getItem('announcements') || '""');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');

        await Promise.all([
            this.updateLocations(locations),
            this.updateAnnouncement(announcements),
            this.updateCategories(categories)
        ]);

        // Push items for each category
        for (const category of categories) {
            const items = JSON.parse(localStorage.getItem(`items_${category}`) || '[]');
            await this.updateItems(category, items);
        }
    }
}

export const storeData = new StoreData();