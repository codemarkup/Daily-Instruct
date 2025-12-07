// /lib/github-storage.ts - SERVER-SIDE ONLY
interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

export class GitHubStorage {
  private owner = process.env.GITHUB_OWNER || 'codemarkup';
  private repo = process.env.GITHUB_REPO || 'your-repo-name';
  private token = process.env.GITHUB_TOKEN;
  private baseURL = 'https://api.github.com';

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      throw new Error('GITHUB_TOKEN is not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`GitHub API error (${response.status}):`, error);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // Read JSON file from GitHub
  async readJSONFile(path: string): Promise<any> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      
      // Decode base64 content
      const content = atob(data.content.replace(/\n/g, ''));
      return JSON.parse(content);
    } catch (error: any) {
      // If file doesn't exist, return default structure
      if (error.message.includes('404')) {
        return { articles: [] };
      }
      throw error;
    }
  }

  // Write JSON file to GitHub
  async writeJSONFile(path: string, content: any, sha?: string): Promise<any> {
    const fileContent = JSON.stringify(content, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

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

    return this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Get file SHA (needed for updates)
  async getFileSHA(path: string): Promise<string | null> {
    try {
      const data = await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`);
      return data.sha;
    } catch {
      return null;
    }
  }
}