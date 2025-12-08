// /lib/github-storage.ts - FIXED FOR SERVER-SIDE
interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

export class GitHubStorage {
  private owner = process.env.GITHUB_OWNER || 'codemarkup';
  private repo = process.env.GITHUB_REPO || 'Daily-Instruct'; // Change to your actual repo!
  private token = process.env.GITHUB_TOKEN;
  private baseURL = 'https://api.github.com';

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      console.error('GITHUB_TOKEN is missing');
      throw new Error('GITHUB_TOKEN is not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error (${response.status}):`, errorText);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // Read JSON file from GitHub
  async readJSONFile(path: string): Promise<any> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      
      // Decode base64 content (server-side compatible)
      const buffer = Buffer.from(data.content, 'base64');
      const content = buffer.toString('utf-8');
      return JSON.parse(content);
    } catch (error: any) {
      // If file doesn't exist, return default structure
      if (error.message.includes('404')) {
        console.log(`File ${path} not found, returning empty array`);
        return { articles: [] };
      }
      console.error(`Error reading ${path}:`, error);
      throw error;
    }
  }

  // Write JSON file to GitHub
  async writeJSONFile(path: string, content: any, sha?: string): Promise<any> {
    try {
      const fileContent = JSON.stringify(content, null, 2);
      // Encode to base64 (server-side compatible)
      const encodedContent = Buffer.from(fileContent).toString('base64');

      const payload: any = {
        message: `Update ${path}`,
        content: encodedContent,
        committer: {
          name: 'Daily Instruct Admin',
          email: 'admin@dailyinstruct.com',
        },
        branch: 'main',
      };

      if (sha) {
        payload.sha = sha;
      }

      console.log(`Writing to GitHub: ${path}`);
      const result = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(`GitHub write successful: ${result.content.sha}`);
      return result;
    } catch (error: any) {
      console.error(`Error writing to GitHub (${path}):`, error);
      throw error;
    }
  }

  // Get file SHA (needed for updates)
  async getFileSHA(path: string): Promise<string | null> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      return data.sha;
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null; // File doesn't exist yet
      }
      console.error(`Error getting SHA for ${path}:`, error);
      return null;
    }
  }
}