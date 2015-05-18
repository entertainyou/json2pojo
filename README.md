# json2pojo
JSON to POJO with duplicate key handling

for generate POJO like the following:
    {
      "foo": {
        "dup": {"value": 10},
      },
      "dup": {"value": 20},
    }
