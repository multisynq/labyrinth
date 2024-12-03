/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import HtmlWebPackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import latestVersion from 'latest-version';
import apiKey from './src/apiKey.js';

export default async (_env, { mode }) => {
    const prod = mode === 'production';
    const croquet_version = await latestVersion('@croquet/croquet', {version: 'dev'});
    const croquet_script =`<script src="https://cdn.jsdelivr.net/npm/@croquet/croquet@${croquet_version}"></script>`;
    // const croquet_script =`<script src="https://cdn.jsdelivr.net/npm/@croquet/croquet@1.1.0"></script>`;
    return {
        entry : {
            labyrinth: './labyrinth.js',
            lobby: './lobby.js',
        },
        devtool: 'source-map',
        output: {
            filename: '[name]-[contenthash:8].js',
            chunkFilename: 'chunk-[contenthash:8].js',
            assetModuleFilename: 'assets/[contenthash:8][ext]',
            clean: prod,
        },
        devServer: {
            allowedHosts: 'all',
            port: 8080
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: "pre",
                    use: ["source-map-loader"],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|wav|mp3|glb|gltf)$/,
                    type: 'asset/resource',
                },
            ],
        },
        // use Croquet loaded via <script>
        externals: {
            "@croquet/croquet": "Croquet",
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: 'labyrinth.html',   // input
                filename: 'labyrinth.html',   // output filename in dist/
                chunks: ['labyrinth'],
                templateParameters: { croquet_script },
            }),
            new HtmlWebPackPlugin({
                template: 'lobby.html',
                filename: 'index.html',   // output filename in dist/
                chunks: ['lobby'],
                templateParameters: { croquet_script, apiKey },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'draco', to: 'draco' },
                    { from: 'assets', to: 'assets' } 
                ]
            })
        ],
        experiments: {
            asyncWebAssembly: true,
        },
    };
};
