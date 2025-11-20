-- SQL schema for 3D Printing parameter project

CREATE TABLE printing_parameters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    layer_height REAL,
    print_speed REAL,
    temperature REAL,
    result_quality REAL
);

-- Sample query
SELECT * FROM printing_parameters;
