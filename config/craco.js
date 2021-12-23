const path = require("path");

module.exports = {
    webpack:
    {
        alias: {
            "@src": path.resolve(__dirname, "../src/"),

            "@layouts": path.resolve(__dirname, "../src/components/layouts/"),

            "@atoms": path.resolve(__dirname, "../src/components/atoms/"),

            "@organisms": path.resolve(__dirname, "../src/components/organisms/"),

            "@molecules": path.resolve(__dirname, "../src/components/molecules/"),

            "@pages": path.resolve(__dirname, "../src/pages/"),

            "@assets": path.resolve(__dirname, "../src/assets/"),
        },
    },
};
