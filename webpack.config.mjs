import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './labyrinth.js',
    output: {
        filename: 'labyrinth.js',
        path: path.resolve(__dirname, 'dist'),
        module: true,
        library: {
        type: 'module'
        }
    },
    experiments: {
        outputModule: true,
        topLevelAwait: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            scriptLoading: 'module'
        }),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'src/draco',
                to: 'src/draco'
            }
        ]
    })
    ],

    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
            },
            {
                directory: path.join(__dirname, 'public'),
            }
        ],
        compress: true,
        port: 8080,
        hot: false,
        liveReload: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
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
                    ['@babel/preset-env', {
                    targets: {
                        esmodules: true,
                    },
                    modules: false
                    }]
                ],
                plugins: ['@babel/plugin-syntax-dynamic-import']
                }
            }
            },
            // Add these new rules for assets
            {
            test: /\.(png|jpg|jpeg|gif|svg|wav|mp3|glb|gltf)$/,
            use: {
                loader: 'file-loader',
                options: {
                name: '[name].[ext]',
                outputPath: 'assets/'
                }
            }
            },
            {
            test: /\.(frag|vert)$/,
            use: 'raw-loader'
            }
        ]
        },

    resolve: {
        alias: {
        '#glsl': path.resolve(__dirname, 'src/shaders'),
        },
        fallback: {
        "crypto": false
        }
    }
};