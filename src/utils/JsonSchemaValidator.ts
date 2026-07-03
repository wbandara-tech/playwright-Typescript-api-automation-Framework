// Lightweight schema validator — checks that required fields are present without a heavy dependency
class JsonSchemaValidator {
  validate(data: unknown, schema: Record<string, unknown>): { valid: boolean; errors?: string[] } {
    try {
      if (!this.validateSchema(data, schema)) {
        return { valid: false, errors: ['Schema validation failed'] };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, errors: [error instanceof Error ? error.message : 'Unknown error'] };
    }
  }

  // Verify that every field listed in schema.required is present on the data object
  private validateSchema(data: unknown, schema: Record<string, unknown>): boolean {
    const requiredFields = schema.required as string[] | undefined;
    if (!requiredFields || !Array.isArray(requiredFields)) {
      return true;
    }

    if (typeof data !== 'object' || data === null) {
      return false;
    }

    const obj = data as Record<string, unknown>;
    return requiredFields.every((field) => field in obj);
  }
}

export const jsonSchemaValidator = new JsonSchemaValidator();
