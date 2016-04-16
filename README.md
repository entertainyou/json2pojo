# json2pojo

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

JSON to POJO with duplicate key handling, uses jsonschema2pojo(http://jsonschema2pojo.org/) to do the schema to POJO code generation.

Install:

    npm install -g json2pojo

Usage:

    json2pojo API -p com.example

For generate POJO from the following json:

    # API
    GET https://api.github.com/users/nodejs/repos Repo
    GET https://api.github.com/repos/nodejs/node/branches Branch

Generated POJO(under com.example package):

    Branch.java  Commit.java  Owner.java  Repo.java

[npm-image]: https://img.shields.io/npm/v/json2pojo.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/json2pojo
[travis-image]: https://travis-ci.org/entertainyou/json2pojo.png
[travis-url]: https://travis-ci.org/entertainyou/json2pojo
[downloads-image]: https://img.shields.io/npm/dm/json2pojo.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/json2pojo
