'use strict';

const hotp = require('./hotp');

module.exports = {
    time: 30,
    epoch: Math.floor(Date.now() / 1000),
    /**
     * Generate a time based One Time Password
     * @param {string} key secret
     * @return {string} the one time password
     */
    gen: function (key) {
        // Determine the value of the counter, C
        // This is the number of time steps in seconds since T0
        const counter = Math.floor(this.epoch / this.time);
        hotp.setCounter(counter);

        return hotp.gen(key);
    },
    /**
     * Check a One Time Password based on a timer.
     * @param {string} token six digit code
     * @param {string} key secret
     * @return {Object} null if failure, { delta: # } on success
     * delta is the time step difference between the client and the server
     */
    verify: function (token, key) {
        // Determine the value of the counter, C
        // This is the number of time steps in seconds since T0
        const counter = Math.floor(this.epoch / this.time);
        hotp.setCounter(counter);

        const result = hotp.verify(token, key);

        if (!result) {
            // token invalid return null
            return result;
        }

        return {
            delta: result.delta,
            timeUsed: this.timeUsed(),
            timeRemaining: this.timeRemaining()
        };
    },
    timeUsed: function () {
        return Math.floor(Date.now() / 1000) % this.time;
    },
    timeRemaining: function () {
        return this.time - this.timeUsed();
    }
};
