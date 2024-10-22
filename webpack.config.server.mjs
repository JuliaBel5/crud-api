import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
    chunkFormat: 'module',
  },
  optimization: {
    usedExports: true,
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isProduction ? false : 'source-map',
  mode: isProduction ? 'production' : 'development',
  target: 'node',
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

export default config;
