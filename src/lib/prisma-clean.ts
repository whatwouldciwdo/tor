import { Decimal } from "@prisma/client/runtime/library";

export function cleanPrisma(obj: any): any {
  if (obj instanceof Decimal) return obj.toNumber();

  if (obj && typeof obj.toJSON === "function") {
    return obj.toJSON();
  }

  if (Array.isArray(obj)) {
    return obj.map((x) => cleanPrisma(x));
  }

  if (obj !== null && typeof obj === "object") {
    const out: any = {};

    for (const key in obj) {
      const val = obj[key];

      // Skip functions or classes or special Prisma internal fields
      if (typeof val === "function") continue;

      out[key] = cleanPrisma(val);
    }

    return out;
  }

  return obj;
}
