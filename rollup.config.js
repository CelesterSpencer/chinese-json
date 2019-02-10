import resolve from 'rollup-plugin-node-resolve';
import pegjs from 'rollup-plugin-pegjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
    name: 'ZhJson',
    input: './src/index.js',
    output: {
        file: 'build/zhjson.js',
        format: 'iife'
    },
    plugins: [
        pegjs(),
        resolve({
            module: true,
            jsnext: true,
            browser: true,
        }),
        json({
            exclude: 'node_modules/**',
            preferConst: true,
            indent: '    '
        }),
        babel({
            comments: false,
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
        uglify({}, minify)
    ]
}