module.exports = {
  // This should be kept secure, this the key used for the json web token.
  // This is just an example key stored on git. In production it's best to use
  // a bot to change this key occasinoally. 
  secret: '$3G43g5$H^5H5^_99[=GMiy(*l)',
  // Mongodb URL
  database: 'mongodb://localhost:27017/btco3',
  // Not running on port 80 because it requires root, instead, run the iptables
  // commands found at the top of server.js.
  port: '3400',
  // Make sure to set this properly
  ip: '10.0.0.12',
  // ip: '0.0.0.0',
}
