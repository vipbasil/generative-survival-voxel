
var path = require('path')
var webpack = require('webpack');
var buildPath = path.resolve('..', '..', 'docs', 'hello-world')



module.exports = (env) => ({

    mode: (env && env.prod) ? 'production' : 'development',

    entry: './index.js',
    output: {
        path: buildPath,
        filename: 'bundle.js',
    },

    resolve: {
        /* This resolve is necessary when importing noa-engine from the 
         * local filesystem in order to hack on it. 
         * (but it shouldn't break anything when importing noa normally)
        */
        alias: {
            '@babylonjs': path.resolve('../../node_modules/@babylonjs'),
        },
        extensions: [ '.ts', '.js' ],
        fallback: {
           
            "buffer": require.resolve("buffer")
        }
    },

    performance: {
        // change the default size warnings
        maxEntrypointSize: 1.5e6,
        maxAssetSize: 1.5e6,
    },
    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        
    ],

    stats: "minimal",

    devtool: 'source-map',
    devServer: {
        static: buildPath,
        allowedHosts: 'all',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
          }
    },
    

    // make the dev server's polling use less CPU :/
    watchOptions: {
        aggregateTimeout: 500,
        poll: 1000,
        ignored: ["node_modules"],
    },
    // split out babylon to a separate bundle (since it rarely changes)
    optimization: {
        splitChunks: {
            cacheGroups: {
                babylon: {
                    chunks: 'initial',
                    test: /babylonjs/,
                    filename: 'babylon.js',
                },
            },
        },
    },
})
