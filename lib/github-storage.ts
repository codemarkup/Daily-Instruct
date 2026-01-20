// /lib/github-storage.ts - SERVER-SIDE ONLY (UTF-8 SAFE)

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
        'Content-Type': 'application/json; charset=utf-8',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  // ============================
  // READ JSON (UTF-8 SAFE)
  // ============================
  async readJSONFile(path: string): Promise<any> {
    try {
      const data = await this.request(
        `/repos/${this.owner}/${this.repo}/contents/${path}`
      );

      // GitHub returns base64 → decode properly as UTF-8
      const buffer = Buffer.from(data.content, 'base64');
      const content = buffer.toString('utf8');

      return JSON.parse(content);
    } catch (error: any) {
      // File not found → return default structure
      if (error.message.includes('404')) {
        return { articles: [] };
      }
      throw error;
    }
  }

  // ============================
  // WRITE JSON (UTF-8 SAFE)
  // ============================
  async writeJSONFile(path: string, content: any, sha?: string): Promise<any> {
    const json = JSON.stringify(content, null, 2);

    // UTF-8 → Base64 (CORRECT way)
    const encodedContent = Buffer.from(json, 'utf8').toString('base64');

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

    return this.request(
      `/repos/${this.owner}/${this.repo}/contents/${path}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  }

  // ============================
  // GET FILE SHA
  // ============================
  async getFileSHA(path: string): Promise<string | null> {
    try {
      const data = await this.request(
        `/repos/${this.owner}/${this.repo}/contents/${path}`
      );
      return data.sha;
    } catch {
      return null;
    }
  }
}
