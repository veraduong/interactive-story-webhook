DROP TABLE IF EXISTS Complete;
DROP TABLE IF EXISTS Play;

CREATE TABLE IF NOT EXISTS Complete (
  ID SERIAL PRIMARY KEY,
  endName VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Play (
  ID SERIAL PRIMARY KEY,
  pageID VARCHAR(255),
  pageTag VARCHAR(50)
);

-- /* Test data */

-- INSERT INTO Complete (endName) VALUES ('myrtle');
-- INSERT INTO Complete (endName) VALUES ('myrtle');
-- INSERT INTO Complete (endName) VALUES ('bruce');
-- INSERT INTO Complete (endName) VALUES ('blade');

/* 

To init the db on Heroku, run:

$ heroku login
$ heroku pg:psql --app interactive-story-game < init.sql 

*/