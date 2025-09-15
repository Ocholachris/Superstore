// GitHub Configuration
const config = {
    owner: 'YOUR_GITHUB_USERNAME',
    repo: 'ochola-store-data',
    branch: 'main',
    token: 'YOUR_GITHUB_TOKEN', // You'll need to create a GitHub Personal Access Token
    paths: {
        locations: 'data/locations.json',
        announcements: 'data/announcements.json',
        categories: 'data/categories.json',
        items: 'data/items/',
        images: 'images/',
    }
};

export default config;