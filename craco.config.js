const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#A3DCCD',
                            '@text-color': 'rgba(0, 0, 0, 0.65)'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};