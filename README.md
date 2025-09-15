# Ochola Superstore Data Repository

This repository contains the data storage for Ochola Superstore web application.

## Structure

```
/data
  - locations.json    # Store locations data
  - announcements.json # Store announcements
  - categories.json   # Product categories
  /items
    - food.json      # Items in Food category
    - electronics.json # Items in Electronics category
    - etc.           # Other category items
/images
  - product images   # Stored product images
```

## Setup

1. Create a GitHub Personal Access Token
2. Update the `config.js` file with your GitHub details:
   - owner: Your GitHub username
   - repo: This repository name
   - token: Your GitHub Personal Access Token

## Usage

The data is managed through the StoreData class in `store-data.js`. This provides methods for:
- Managing store locations
- Managing announcements
- Managing categories and items
- Uploading images
- Syncing with localStorage
- Pushing updates to GitHub

## Security Note

Never commit your GitHub token to the repository. Use environment variables or secure configuration management in production.