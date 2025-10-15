export const EditionMode = {
    CREATION: "creation",
    EDITION: "edition",
} as const;

export type EditionMode = (typeof EditionMode)[keyof typeof EditionMode];
