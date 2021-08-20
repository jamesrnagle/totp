'use strict';

module.exports = {
    /**
     * convert a hex value to a byte array
     * @param {string} hex string of hex to convert to a byte array
     * @return {array} bytes
     */
    hexToBytes: function (hex) {
        var bytes = [];
        for (var c = 0, C = hex.length; c < C; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    },
    /**
     * convert an integer to a byte array
     * @param {number} num converts to array
     * @return {Array} bytes
     */
    intToBytes: function (num) {
        var bytes = [];

        for (var i = 7; i >= 0; --i) {
            bytes[i] = num & (255);
            num = num >> 8;
        }

        return bytes;
    }
};
