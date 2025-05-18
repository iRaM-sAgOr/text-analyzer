import { createTextSchema } from '../src/api/dtos/text.dto'; // Adjust the path as needed

describe('Text DTO Validation', () => {
  it('should validate valid DTO', () => {
    const result = createTextSchema.safeParse({ content: 'Sample text' });
    expect(result.success).toBe(true);
  });

  it('should fail for empty content', () => {
    const result = createTextSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
  });
});