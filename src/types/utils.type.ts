export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

/** Remove optional can be null in Typescript */
export type NonNullUndefinedType<T> = {
  [P in keyof Required<T>]: NonNullUndefinedType<NonNullable<T[P]>>;

  /** Remove optional can be null in Typescript (Option 2) */
  // [P in keyof T]-?: NonNullUndefinedType<NonNullable<T[P]>>;
};
