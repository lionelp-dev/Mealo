import { z } from 'zod';

export function createDto<I extends z.ZodType, O>(config: {
  schema: I;
  transform: (resource: z.infer<I>) => O;
}) {
  return {
    schema: config.schema,
    parse(input: I) {
      const validated = config.schema.parse(input);
      return config.transform(validated);
    },
    safeParse(input: I) {
      const result = config.schema.safeParse(input);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: config.transform(result.data),
      };
    },
  } as const;
}
