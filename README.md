# json2pojo [![Build Status](https://travis-ci.org/entertainyou/json2pojo.png)](https://travis-ci.org/entertainyou/json2pojo)
JSON to POJO with duplicate key handling, uses jsonschema2pojo(http://jsonschema2pojo.org/) to do the schema to POJO code generation.

For generate POJO from the following json:

    # test
    {
      "foo": {
        "dup": {"value": 10},
      },
      "dup": {"value": 20},
    }

Generated POJO:

    Foo.java Dup.java Test.java
    