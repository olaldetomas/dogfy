export function generateMockLabelResponse(overrides = {}) {
  return {
    trackingNumber: 'TRK123456',
    labelUrl: 'https://example.com/label.pdf',
    ...overrides,
  };
}
