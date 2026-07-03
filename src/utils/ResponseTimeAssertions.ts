// Assertion helpers for API response time — used to enforce performance SLAs in tests
class ResponseTimeAssertions {

  // Fail the test if responseTime exceeds the given millisecond limit
  static assertResponseTimeWithinLimit(responseTime: number, limit: number): void {
    if (responseTime > limit) {
      throw new Error(`Response time ${responseTime}ms exceeded the limit of ${limit}ms`);
    }
  }

  static assertResponseTimeAboveMinimum(responseTime: number, minimum: number): void {
    if (responseTime < minimum) {
      throw new Error(`Response time ${responseTime}ms is below the minimum of ${minimum}ms`);
    }
  }

  // Computes the arithmetic mean and fails if it exceeds the given average limit
  static assertAverageResponseTime(responseTimes: number[], averageLimit: number): void {
    const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    if (average > averageLimit) {
      throw new Error(`Average response time ${average}ms exceeded the limit of ${averageLimit}ms`);
    }
  }
}

export { ResponseTimeAssertions };

