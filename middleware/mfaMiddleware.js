// middleware/mfaMiddleware.js//Add MFA using an external service like Authy, Google Authenticator, or custom OTP via email/SMS.
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.setupMfa = async (req, res, next) => {
  const secret = speakeasy.generateSecret();
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  res.json({ secret: secret.base32, qrCodeUrl });
};

exports.verifyMfa = async (req, res, next) => {
  const { token, secret } = req.body;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });

  if (!verified) {
    return res.status(401).json({ message: 'MFA verification failed' });
  }

  next();
};
