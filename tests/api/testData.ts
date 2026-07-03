// Static test data fixtures used across POST/PUT tests — keeps magic values out of spec files

export const VALID_PRODUCT_DATA = {
  name: 'Test Product',
  data: {
    year: 2023,
    price: 100,
    'cpu model': 'Intel Core i7',
    'hard disk size': '512 GB',
  },
};

export const ANOTHER_VALID_PRODUCT = {
  name: 'Another Test Product',
  data: {
    year: 2024,
    price: 500,
    'cpu model': 'Apple M1',
    'hard disk size': '256 GB',
  },
};

// Used in negative tests to verify the API handles missing required fields gracefully
export const INVALID_PRODUCT_MISSING_NAME = {
  data: {
    year: 2023,
    price: 100,
  },
};

export const INVALID_PRODUCT_EMPTY = {};

export const EMPTY_STRING_PRODUCT = {
  name: '',
  data: {},
};

export const NULL_PRODUCT = null;

export const INVALID_PRODUCT_SPECIAL_CHARS = {
  name: '!@#$%^&*()',
  data: {
    year: -2023,
    price: -100,
  },
};

