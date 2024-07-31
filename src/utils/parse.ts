export const parseBoolean = (value: string): boolean => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`Invalid boolean value: ${value}`);
};

export const parseNullableBoolean = (value: string | undefined): boolean | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return parseBoolean(value);
};

export const parseString = (value: string | undefined): string => {
  if (!value) {
    return "";
  }
  return value;
};

export const parseNonEmptyString = (value: string | undefined): string => {
  const parsed = parseString(value);
  if (parsed === "") {
    throw new Error(`Invalid ${parsed}, must be a non-empty string`);
  }
  return parsed;
};
