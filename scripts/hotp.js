'use strict';

const util = require('./util');

module.exports = {
    window: 2,
    counter: 0,
    /**
     * Generate a counter based One Time Password
     * @param {string} key secret value
     * @return {string} the one time password
     */
    gen: function (key) {
        const b = util.intToBytes(this.counter);

        const mac = new dw.crypto.Mac(dw.crypto.Mac.HMAC_SHA_256);
        const digest = dw.crypto.Encoding.toHex(mac.digest(b, new dw.util.Bytes(key, 'UTF-8')));

        // Get byte array
        const h = util.hexToBytes(digest);

        // Truncate
        const offset = h[19] & 0xf;
        let v = (h[offset] & 0x7f) << 24 |
        (h[offset + 1] & 0xff) << 16 |
        (h[offset + 2] & 0xff) << 8 |
        (h[offset + 3] & 0xff);

        // get 6 digits
        v = (v % 1000000) + '';

        // pad with 0 if less than 6
        return Array(7 - v.length).join('0') + v;
    },
    /**
     * Check a One Time Password based on a counter.
     * @param {string} token token to validate
     * @param {string} key secret to validate with
     * @return {Object} null if failure, { delta: # } on success
     * delta is the time step difference between the client and the server
     *
     */
    verify: function (token, key) {
        const start = this.counter;
        // Now loop through from C to C + W to determine if there is
        // a correct code
        for (var i = start - this.window; i <= start + this.window; ++i) {
            this.setCounter(i);
            if (this.gen(key) === token) {
                // We have found a matching code, trigger callback
                // and pass offset
                return { delta: i - start, end: i, start: start };
            }
        }

        // If we get to here then no codes have matched, return null
        return null;
    },
    setCounter: function (int) {
        this.counter = int;
    }
};
