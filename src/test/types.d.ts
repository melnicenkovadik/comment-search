declare module '@testing-library/jest-dom'
declare module '@testing-library/user-event'
declare module '@testing-library/react'

interface MockFunction {
  (): unknown
  mockImplementation: (fn: () => unknown) => MockFunction
}

declare global {
  const vi: {
    fn: () => MockFunction
    clearAllMocks: () => void
    mockImplementation: (fn: () => unknown) => MockFunction
  }
  const describe: (name: string, fn: () => void) => void
  const it: (name: string, fn: () => void) => void
  const expect: (value: unknown) => {
    toBeInTheDocument: () => void
    toHaveLength: (length: number) => void
    toHaveStyle: (style: Record<string, string>) => void
    not: {
      toBeInTheDocument: () => void
    }
  }
  const beforeEach: (fn: () => void) => void
  const afterEach: (fn: () => void) => void
}
