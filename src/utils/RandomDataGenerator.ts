// Utility for generating random test data — keeps tests independent of hard-coded values
class RandomDataGenerator {

  // Returns a random alphanumeric string of the requested length
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Returns a random integer within [min, max] inclusive
  static generateRandomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomEmail(): string {
    return `user_${this.generateRandomString(8)}@test.com`;
  }

  static generateRandomPhoneNumber(): string {
    return `${this.generateRandomNumber(100, 999)}-${this.generateRandomNumber(100, 999)}-${this.generateRandomNumber(1000, 9999)}`;
  }

  static generateRandomBoolean(): boolean {
    return Math.random() > 0.5;
  }

  static generateRandomDate(daysInPast: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() - this.generateRandomNumber(0, daysInPast));
    return date.toISOString().split('T')[0];
  }

  // Builds a unique product name suitable for POST/PUT payloads
  static generateProductName(): string {
    const adjectives = ['Premium', 'Deluxe', 'Professional', 'Standard', 'Basic', 'Advanced'];
    const nouns = ['Widget', 'Tool', 'Service', 'Solution', 'Platform', 'System'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective} ${noun} ${this.generateRandomNumber(100, 999)}`;
  }

  // Returns a realistic-looking product metadata object
  static generateProductData(): Record<string, unknown> {
    return {
      year: this.generateRandomNumber(2020, 2024),
      price: this.generateRandomNumber(10, 1000),
      'cpu model': `CPU ${this.generateRandomString(5).toUpperCase()}`,
      'hard disk size': `${this.generateRandomNumber(256, 2048)} GB`,
    };
  }
}

export { RandomDataGenerator };

