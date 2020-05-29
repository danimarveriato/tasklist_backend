const restify = require('restify');

const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'job_tasklist.mysql.dbaas.com.br',
      user : 'job_tasklist',
      password : 'bdtasklist',
      database : 'job_tasklist'
    }
  });

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

//Rotas da API

//Busca os dados da Tabela
server.get('/', (req, res, next) => {
    knex('task').then((dados) => {
        res.send(dados);
    }, next)

  });

//Insere dados na tabela
server.post('/create', (req, res, next) => {
    knex('task')
        .insert(req.body)

        .then((dados) => {
        //Variável dados recebe o ID que foi criado no insert
        res.send(dados);
    }, next)
  });

  //Busca uma tarefa pelo ID
  server.get('/show/:id', (req, res, next) => {
    const { id } = req.params;

    knex('task')
        .where('CodTarefa', id)
        //Busca apenas o primeiro registro
        .first() 

        .then((dados) => {
            if(!dados)
                return res.send(new errs.BadRequestError('Nenhum registro foi encontrado'))
            res.send(dados);
    }, next)
  });

    //Atualiza uma tarefa baseado nos parâmetros recebidos pelo body
    server.put('/update/:id', (req, res, next) => {
        const { id } = req.params;
    
        knex('task')    
            .where('CodTarefa', id)
            .update(req.body) 
    
            .then((dados) => {
                if(!dados)
                    return res.send(new errs.BadRequestError('Nenhum registro foi encontrado'))
                res.send('A tarefa foi atualizada com sucesso!');
        }, next)
      });
  
    //Deleta uma tarefa baseada no ID
    server.del('/delete/:id', (req, res, next) => {
        const { id } = req.params;
    
        knex('task')    
            .where('CodTarefa', id)
            .delete() 
    
            .then((dados) => {
                if(!dados)
                    return res.send(new errs.BadRequestError('Nenhum registro foi encontrado'))
                res.send('A tarefa foi excluída com sucesso!');
        }, next)
      });