const round = ( num, decimals ) => {
    const n = 10 ** decimals;
    return Math.round( ( n * num ).toFixed( decimals ) ) / n;
};

module.exports = round;