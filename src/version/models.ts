export const versionShiftTypes = ["major", "minor", "patch"] as const;
export type VersionShiftLiteral = (typeof versionShiftTypes)[number];
export const parseVersionShift = (value: string): VersionShiftLiteral => {
  if (versionShiftTypes.includes(value as VersionShiftLiteral)) {
    return value as VersionShiftLiteral;
  }
  throw new Error(`Invalid user type: ${value}`);
};
