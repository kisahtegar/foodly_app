/**
 * Generate a 6-digit OTP (One-Time Password).
 *
 * This function generates a random 6-digit OTP by creating a random number between
 * 100000 and 999999. The OTP is returned as a string.
 *
 * @example
 * // To generate an OTP
 * const otp = generateOtp();
 */
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString().substring(0, 6);
}

module.exports = generateOtp;
