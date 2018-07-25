const path = require('path');
const webpack = require('webpack');

module.exports = env => {
    return {
        target: 'electron-main',
        entry: './src/js/main.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'main.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'env'
                            ]
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.BUILD_TYPE': JSON.stringify(env.build_type)
            })
        ],
    }
}