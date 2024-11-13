/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import HtmlWebPackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import latestVersion from 'latest-version';

export default async (_env, { mode }) => {
    const prod = mode === 'production';
    const croquet_version = await latestVersion('@croquet/croquet', {version: 'dev'});
    const croquet_script =`<script src="https://cdn.jsdelivr.net/npm/@croquet/croquet@${croquet_version}"></script>`;
    // const croquet_script =`<script src="https://cdn.jsdelivr.net/npm/@croquet/croquet@1.1.0"></script>`;
    return {
        entry : './labyrinth.js',
        devtool: 'source-map',
        output: {
            filename: '[name]-[contenthash:8].js',
            chunkFilename: 'chunk-[contenthash:8].js',
            assetModuleFilename: 'assets/[contenthash:8][ext]',
            clean: prod,
        },
        devServer: {
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
                template: 'index.html',   // input
                filename: 'index.html',   // output filename in dist/
                templateParameters: { croquet_script },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'draco', to: 'draco' },
                ]
            })
        ],
        experiments: {
            asyncWebAssembly: true,
        },
    };
};
