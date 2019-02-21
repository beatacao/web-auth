module.exports = {
    port: 5566,
    services: [
        'http://www.sso-client1.com:5566',
        'http://www.sso-client2.com:5566'
    ],
    client_token_secret: 'client_token_secret'
}