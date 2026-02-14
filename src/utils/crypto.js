import crypto from "crypto";

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const randomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const parseDurationToMs = (value) => {
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) {
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) {
      return asNumber * 1000;
    }
    throw new Error("Invalid duration format");
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return amount * 1000;
  }
};
