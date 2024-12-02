import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['tests/_setup.ts'],
    ...(process.env.CI === 'true' && {
      reporters: ['default', 'junit'],
      outputFile: {
        junit: './reports/junit/http-definitions-testing-results.xml',
      },
    }),
    coverage: {
      provider: 'v8',
      clean: true,
      reportsDirectory: './reports/coverage',
      reporter: ['text', 'cobertura'],
      thresholds: {
        lines: 95,
        functions: 94,
        branches: 94,
        statements: 95,
      },
    },
  },
});
