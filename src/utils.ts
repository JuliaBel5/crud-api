import { validate as isUuid } from "uuid";

export const isValidUserId = (id: string): boolean => isUuid(id);
