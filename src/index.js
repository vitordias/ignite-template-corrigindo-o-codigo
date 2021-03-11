const express = require("express");
const cors = require('cors');

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const repositories = [];


function checksExistsUserAccount(request, response, next) {
  const { id } = request.params;

  if(!(validate(id))){
    return response.status(404).send();
  }

  const repository = repositories.find(
    (to) => to.id === id
  );

  if(!repository){
    return response.status(404).send();
  }

  request.repository = repository;

  return next();
}


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});


app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  //const updatedRepository = request.body;

  repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repository.title = title;
  repository.url   = url;
  repository.techs = techs;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checksExistsUserAccount, (request, response) => {
  
  const repository = request.repository;

  repositoryIndex = repositories.findIndex(to => to.id === repository.id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsUserAccount, (request, response) => {
 
  const repository = request.repository;
  repository.likes = ++repository.likes;

  return response.status(200).json(repository);
});

module.exports = app;
