// GitHub API helper functions
import config from './config.js';

class GitHubAPI {
    constructor() {
        this.baseUrl = 'https://api.github.com';
        this.headers = {
            'Authorization': `token ${config.token}`,
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    // Get file content from GitHub
    async getFile(path) {
        try {
            const response = await fetch(`${this.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`, {
                headers: this.headers
            });
            const data = await response.json();
            if (response.ok) {
                return JSON.parse(atob(data.content));
            }
            throw new Error(data.message);
        } catch (error) {
            console.error(`Error fetching ${path}:`, error);
            return null;
        }
    }

    // Update or create file in GitHub
    async updateFile(path, content, message) {
        try {
            // First, get the current file (if it exists) to get its SHA
            let sha = '';
            try {
                const current = await fetch(`${this.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`, {
                    headers: this.headers
                });
                if (current.ok) {
                    const data = await current.json();
                    sha = data.sha;
                }
            } catch (e) {
                // File doesn't exist yet, that's OK
            }

            // Prepare the update
            const response = await fetch(`${this.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify({
                    message: message || `Update ${path}`,
                    content: btoa(JSON.stringify(content)),
                    sha: sha || undefined,
                    branch: config.branch
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return true;
        } catch (error) {
            console.error(`Error updating ${path}:`, error);
            return false;
        }
    }

    // Upload image to GitHub
    async uploadImage(imageData, filename) {
        try {
            const path = `${config.paths.images}${filename}`;
            const response = await fetch(`${this.baseUrl}/repos/${config.owner}/${config.repo}/contents/${path}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify({
                    message: `Upload image ${filename}`,
                    content: imageData.split(',')[1], // Remove data:image/xyz;base64, prefix
                    branch: config.branch
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${path}`;
        } catch (error) {
            console.error(`Error uploading image ${filename}:`, error);
            return null;
        }
    }
}

export const github = new GitHubAPI();