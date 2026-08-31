"use client";

import { useCallback } from "react";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

type QueryParams = Record<string, QueryValue>;

export function useQueryParams() {
  const createQueryString = useCallback(
    (params: QueryParams) => {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return;
        }

        searchParams.set(key, String(value));
      });

      const queryString = searchParams.toString();

      return queryString
        ? `?${queryString}`
        : "";
    },
    [],
  );

  return {
    createQueryString,
  };
}