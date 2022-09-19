# interactive-story-webhook
Project Description:
Our project started out as an idea for a choice-based story that one could play on a google home assistant, but it ended up becoming a choice-based story that could be deployed to a website as a live assistant tool. The story can be explored through chat messages sent to the bot assistant, and the story is very in-depth and heavy and leaves you with a critical choice at the end that determines the ending you get. This ending can be tracked and displayed on the website it is implemented into.
Interacting with the application is extremely intuitive, as there is a tutorial to adjust the user. You are able to visit a certain amount of “rooms” (pieces of dialogue) per in-game day. This will limit you to experiencing ⅔ of the rooms per day, which can increase replay value. You can also ask the assistant to repeat themselves at any point, and there is a confirmation at the end of each day that makes sure you’re ready to go to the next one.
Our webpage detailing player statistics is deployed through Heroku, and written in Javascript. The accompanying database, in which all information detailing the amount of players and their decisions is written in SQL.

Repo Description:
This repo is dedicated to managing the nodejs part of the project, as the rest of the project is hosted on dialogflow.
The main project

Structure:
The structure of this repo is similar to that of any other nodejs server repo, with the index.js file containing most of the important code related to how the server works and interacts with the dialogflow client, and init.sql being a file that adds the tables into the database.

Testing/running:
This repo is directly linked to a heroku project for deployment, which can be found at https://dashboard.heroku.com/apps/interactive-story-game with a proper invite to the heroku. The server also displays statistics about the game in the heroku app, which can be accessed in https://interactive-story-game.herokuapp.com/. (CI)
