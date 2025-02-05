import { HttpClient, HttpHeaders } from '@angular/common/http';

export class LogentriesLogger {
  private token: string;
  private http: HttpClient;

  constructor(token: string, http: HttpClient) {
    this.token = token;
    this.http = http;
  }

  public log(rec: any): void {
    // Replace the level with a human-readable name
    rec.level = LogentriesLogger.resolveLevel(rec.level);

    // Logentries URL
    const LOGENTRIES_URL = `https://webhook.logentries.com/noformat/logs/${this.token}`;

    // Configure HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Send POST request
    this.http.post(LOGENTRIES_URL, rec, { headers }).subscribe({
      next: () => console.log('Log sent successfully to Logentries'),
      error: (error) =>
        console.error('Failed to send log to the Logentries server:', error),
    });
  }

  private static resolveLevel(bunyanLevel: number): string {
    const levelToName: Record<number, string> = {
      10: 'DEBUG',
      20: 'DEBUG',
      30: 'INFO',
      40: 'WARN',
      50: 'ERROR',
      60: 'CRIT',
    };
    return levelToName[bunyanLevel] || 'INFO';
  }
}
