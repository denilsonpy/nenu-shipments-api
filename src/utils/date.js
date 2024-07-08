// Function to parse duration strings like '1h' or '24h' into milliseconds
export function parseDuration(durationString) {
  const matches = durationString.match(/^(\d+)([smhd])$/);
  if (!matches) {
    throw new Error("Invalid duration format");
  }

  const value = parseInt(matches[1]);
  const unit = matches[2];

  switch (unit) {
    case "s":
      return value * 1000; // seconds
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    default:
      throw new Error("Invalid duration unit");
  }
}

export function isExpired(date, expiresIn) {
  // Convert date to a Date object
  const updatedDate = new Date(date);
  // Calculate the expiry time by adding expires_in seconds to updatedDate
  const expiryTime = updatedDate.getTime() + expiresIn * 1000; // Convert seconds to milliseconds
  // Get the current time
  const currentTime = Date.now();
  // Compare current time with expiry time
  return currentTime >= expiryTime;
}
