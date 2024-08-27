const DeviceDetector = require('node-device-detector');

const deviceInformation = (req, res, next) => {
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
    deviceTrusted: false,
    deviceInfo: false,
    maxUserAgentSize: 500,
  });

  const userAgent = req.headers['user-agent'] || 'Unknown User Agent';

  const result = detector.detect(userAgent);

  const obj = {
    os: result.os.name,
    model: result.device.model ? result.device.model : '',
    browser: result.client.name,
    type: result.device.type,
  };

  req.deviceInfo = obj;

  next();
};

module.exports = deviceInformation;
