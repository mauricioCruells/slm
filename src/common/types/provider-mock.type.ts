export type ProviderMock<T> = Partial<Record<keyof T, jest.Mock>>;
