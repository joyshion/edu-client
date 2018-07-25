const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = env => {
    return {
        target: env.target,
        entry: {
            login: './src/js/client/login.js',
            dashboard: './src/js/client/dashboard.js',
            classroom: './src/js/client/classroom.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].js'
        },
        resolve: {
            alias: {
                Src: path.resolve(__dirname, 'src/js/'),
                Scss: path.resolve(__dirname, 'src/scss/'),
                Lib: path.resolve(__dirname, 'src/js/client/lib'),
                Components: path.resolve(__dirname, 'src/js/client/components'),
                DashBoard: path.resolve(__dirname, 'src/js/client/components/dashboard/' + env.build_type),
            }
        },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                'env',
                                'react'
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader'
                        }, {
                            loader: 'sass-loader'
                        }],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: [{
                        loader:'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                            publicPath (url) {
                                return '/' + url;
                            }
                        }
                    }]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.BUILD_TYPE': JSON.stringify(env.build_type)
            }),
            new ExtractTextPlugin('css/style.css')
        ],
        devtool: 'source-map',
        devServer: {
            contentBase: path.join(__dirname, 'dist')
        }
    }
}