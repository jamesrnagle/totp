'use strict';

const base = module.superModule;
const server = require('server');
server.extend(base);

const totp = require('*/cartridge/scripts/otp/totp');


server.post('OTPRequest', function (req, res, next) {
    const reqForm = server.forms.getForm('otpReqForm');

    if (!reqForm.valid) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: 'Form is invalid.'
        });
        return next();
    }

    const custEmail = reqForm.otpLoginEmail;

    if (!custEmail.valid) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: 'Email is invalid.'
        });
        return next();
    }

    const md = dw.crypto.MessageDigest(dw.crypto.MessageDigest.DIGEST_SHA_256);

    const secret = md.digest(new dw.util.Bytes(custEmail.htmlValue, 'UTF-8'));

    const token = totp.gen(secret);

    res.json({
        custEmail: custEmail.htmlValue,
        token: token
    });
    next();
});

server.post('OTPVerify', function (req, res, next) {
    const reqForm = server.forms.getForm('otpVerifyForm');

    if (!reqForm.valid) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: 'Form is invalid.'
        });
        return next();
    }

    const custEmail = reqForm.otpLoginEmail;
    const token = reqForm.otpLoginCode;

    if (!custEmail.valid) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: 'Email is invalid.'
        });
        return next();
    }

    if (!token.valid) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: 'Code is invalid.'
        });
        return next();
    }

    const md = dw.crypto.MessageDigest(dw.crypto.MessageDigest.DIGEST_SHA_256);

    const secret = md.digest(new dw.util.Bytes(custEmail.htmlValue, 'UTF-8'));

    const valid = totp.verify(token.htmlValue, secret);

    if (!valid) {
        res.json({
            custEmail: custEmail.htmlValue,
            valid: false
        });
        return next();
    }

    res.json({
        custEmail: custEmail.htmlValue,
        valid: true,
        delta: valid.delta,
        timeUsed: valid.timeUsed,
        timeRemaining: valid.timeRemaining
    });
    next();
});

module.exports = server.exports();
