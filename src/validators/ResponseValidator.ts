import { expect } from '@playwright/test';

// Static helper class wrapping Playwright assertions for common API response checks
class ResponseValidator {

  static validateStatusCode(statusCode: number, expectedCode: number): void {
    expect(statusCode).toBe(expectedCode);
  }

  // Handles both single-value and multi-value content-type headers
  static validateContentType(
    contentType: string | string[] | undefined,
    expected: string,
  ): void {
    if (Array.isArray(contentType)) {
      contentType = contentType[0];
    }
    expect(contentType).toContain(expected);
  }

  // Verifies the body is defined and that all listed fields exist
  static validateResponseBody(body: unknown, expectedFields: string[]): void {
    expect(body).toBeDefined();
    if (typeof body === 'object' && body !== null) {
      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });
    }
  }

  static validateFieldValue(
    body: Record<string, unknown>,
    field: string,
    expectedValue: unknown,
  ): void {
    expect(body[field]).toEqual(expectedValue);
  }

  static validateArrayLength(array: unknown[], expectedLength: number): void {
    expect(Array.isArray(array)).toBe(true);
    expect(array).toHaveLength(expectedLength);
  }

  static validateObjectProperty(
    obj: Record<string, unknown>,
    property: string,
    expectedType: string,
  ): void {
    expect(obj).toHaveProperty(property);
    expect(typeof obj[property]).toBe(expectedType);
  }

  // Normalises header keys to lowercase before asserting existence
  static validateHeaderExists(headers: Record<string, string>, headerName: string): void {
    const normalizedHeaders = this.normalizeHeaders(headers);
    expect(normalizedHeaders).toHaveProperty(headerName.toLowerCase());
  }

  private static normalizeHeaders(headers: Record<string, string>): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      normalized[key.toLowerCase()] = value;
    }
    return normalized;
  }
}

export { ResponseValidator };

