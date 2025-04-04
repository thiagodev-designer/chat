import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Server } from 'socket.io';
import bcrypt from "bcrypt";


import { User } from './models/usuario.js';
import{Msg} from './models/msg.js';
import { Sala } from './models/sala.js';
import { Att } from './models/atendimento.js';
import { Av } from './models/avaliacao.js'
import jwt from 'jsonwebtoken';
import { timeStamp } from 'node:console';
import { whatsapp,menssagem,protocolo,busca } from './models/api.js';
import { log } from 'node:util';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
const server = createServer(app);
const io = new Server(server);
app.use(express.static (join (__dirname, 'public' )));
app.set('views',join(__dirname,'public'));
app.set('view engine','html');

let conectado='';
io.on('connection', (socket) => {
   conectado = socket.id;
   socket.on('enviar-Msg',async(dados)=>{
    await whatsapp(dados.sala,dados.text);
    
  });
  socket.on('Finalizar',async(dados)=>{
    
    await Sala.update(
      { status: 'Avaliacao' },
      {
        where: {
          sala: dados,
        },
      },
    );
    await whatsapp(dados,`
O atendimento foi encerrado. 
Por favor avalie sua experiência.

1- Ruim.
2- Satisfeito.
3- Muito Satisfeito.

`);

    
  })
});



app.post('/webhook',async(req,res)=>{ 
  var msg = '';
  
  if(conectado == ''){
    
    await whatsapp(req.body.from,menssagem.fechado)
    res.sendStatus(200);
    return
  }else{
    
    
  //verificar o status da menssagem ['chatRobo','Atendimento','Finalizado','Consulta','Pedido','Avaliacao']
  const sala = await Sala.findOne({
    attributes:['sala','status'],
    where:{
      'sala':req.body.from
    }
  });
  if(!sala){
    await Sala.create({
      'sala':req.body.from,
      'status':'chat'
    });
    //envia menssagem
   const response =  await whatsapp(req.body.from,`
Olá ${req.body.name}! Sou Mercadinho seu assistente virtual,
digite o numero correspondente ao atendimento que procura!

1- Falar com Atendente.
2- Consultar Preços.
3- Fazer Pedido.
4- Finalizar Atendimento.  
 `);
 res.sendStatus(200);
 return  
  }
  
  if(sala && sala.status == 'chat'){
     switch(req.body.text.body){
      case '1':
        //gerar protocolo de atendimento
        const numero = await protocolo(req.body.from);
        await whatsapp(req.body.from,`
        Ok! Aguarde enquanto redireciono o atendimento para um de nossos agentes.

        seu protocolo de atendimento é AT${numero}`);
        //atualiza o status para atendimento
        await Sala.update(
          { status: 'Atendimento' },
          {
            where: {
              sala: req.body.from,
            },
          },
        );
        //salva o atendimento na tabela Atendimento
        await Att.create({
          'sala':req.body.from,
          'nome':req.body.name
        })
        //busca os dados do atendimento
        const atend ={
          'sala':req.body.from,
          'nome':req.body.name,
          'text':req.body.text.body,
          'data':req.body.timestamp,
          'status':''
        }
        //direciona o atendimento com os dados da tabela
        io.emit('Atendimento',atend)
        break;
      case '2':
        //envia menssagem para buscar o produto.
        await whatsapp(req.body.from,`
        OK! digite o nome do produto que deseja saber o preço!
        Obs: não ultilize acentuação ou caracter especial &%#$@!`);
        //atualiza o status pra Consulta
        await Sala.update(
          { status: 'Consulta' },
          {
            where: {
              sala: req.body.from,
            },
          },
        );
        //chama a função para buscar os preços
        break;
      case '3':
        //atualiza o status pra pedido
        //anotar pedido
        await whatsapp(req.body.from,`Função Indisponivel no momento!`);
        break;
      case '4':
        await Sala.update(
          { status: 'Avaliacao' },
          {
            where: {
              sala: req.body.from,
            },
          },
        );
        await whatsapp(req.body.from,`
        Foi um prazer te atender!
        Avalie nosso atendimento.

        1- Ruim.
        2- Satisfeito.
        3- Muito Satisfeito.

        `);
        //atualiza para avaliação 
        //chama a função de avaliação
        //deleta a sala e cria tabela de atendimento
        break;
      default:
        await whatsapp(req.body.from,`
          Não entendi o que procura por favor digite o numero correspondente ao atendimento
          `+menssagem.erro);       
     }
        
    
  }
  
  if(sala && sala.status =='Atendimento'){
    if(req.body.text.body == 'sair'){
      await Sala.update(
        { status: 'chat' },
          {
            where: {
              sala: req.body.from,
            },
          },
      );
      await whatsapp(req.body.from,`OK!`+menssagem.menu);
      io.emit('sair',req.body.from);
      res.sendStatus(200);
      return;
    }
    const atend ={
      'sala':req.body.from,
      'nome':req.body.name,
      'text':req.body.text.body,
      'data':req.body.timestamp,
      'status':''
    }
    //direciona o atendimento com os dados da tabela
    io.emit('Atendimento',atend)
    //envia via socket menssagem para atendimento
  }
  if(sala && sala.status =='Consulta'){
    
    if(req.body.text.body == '2'){
      await Sala.update(
        { status: 'Atendimento' },
        {
          where: {
            sala: req.body.from,
          },
        },
      );
      const atend ={
        'sala':req.body.from,
        'nome':req.body.name,
        'text':req.body.text.body,
        'status':''
      }
      //direciona o atendimento com os dados da tabela
      await whatsapp(req.body.from,`
OK! Aguarde enquanto direciono o atendimento.
Se desejar encerrar o atendimento 
digite 'sair' a qualquer momento!`);
      io.emit('Atendimento',atend)

      res.sendStatus(200);
      return
    }
    if(req.body.text.body == '3'){
      await Sala.update(
        { status: 'Avaliacao' },
        {
          where: {
            sala: req.body.from,
          },
        },
      );
      await whatsapp(req.body.from,`
OK!
Foi um prazer te atender!
Avalie nosso atendimento.

1- Ruim.
2- Satisfeito.
3- Muito Satisfeito.`)
      res.sendStatus(200);
      return
    }
    const rep = req.body.text.body.replace(' ','%');
    await whatsapp(req.body.from,`
VOCÊ DIGITOU "${req.body.text.body}"! 
AGUARDE UM MOMENTO QUE ESTOU REALIZANDO A BUSCA EM MEU SISTEMA! `);
    const nome = await busca(rep);
    
    
    const nomebusca = nome.resposta;
   
    
    
    if(!nome.status){
      await whatsapp(req.body.from,`
SUA PESQUISA NÃO FOI ENCONTRADA EM NOSSO SISTEMA!
VERIFIQUE A ORTOGRAFIA E DIGITE NOVAMENTE.

EX: SUBISTITUA "ANTARC269" POR "ANTARC 269"

OU DIGITE.:

2 -FALAR COM ATENDENTE.
3 -SAIR.  
        `);

      res.sendStatus(200);
      return  
      
    }
    nomebusca.forEach(e => {
msg+=`
PRODUTO..: 
  ${e.DESCRICAO}.
EMBALAGEM..:     ${e.EMBALAGEM}.
VALOR..:            ${e.PVENDA.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}.
 --------------------------------------
  `; 
    });
        
    await whatsapp(req.body.from,msg);
    setTimeout(()=>{
      whatsapp(req.body.from,`
******--ATENÇÃO--*****
confirme com atendente se o produto tem desconto.!
obs: valores podem ser alterado a qualquer momento sem aviso prévio!
     `);
   },3000);
    setTimeout(()=>{
       whatsapp(req.body.from,`
#######--MENU--########

DIGITE NOVAMENTE O QUE PROCURA PARA CONTINUAR BUSCANDO!
2- Falar com Atendente.
3- Finalizar Atendimento.  
        `)
    },5000);
    

  }
  if(sala && sala.status =='Avaliacao'){
    switch(req.body.text.body){
      case '1':
        await Av.create({
          nota:'1'
        });
        await whatsapp(req.body.from,`
Obrigado por participar da nossa pesquisa!
Apartir de agora as novas menssagens 
inicia um novo atendimento!  
          `);
          await Sala.destroy({
            where: {
              sala: req.body.from,
            },
          });  

        break;
      case '2':
        await Av.create({
          nota:'2'
        });
        await whatsapp(req.body.from,`
Obrigado por participar da nossa pesquisa!
Apartir de agora as novas menssagens 
inicia um novo atendimento!  
          `);
          await Sala.destroy({
            where: {
              sala: req.body.from,
            },
          });  

        break;
      case '3':
        await Av.create({
          nota:'3'
        });
        await whatsapp(req.body.from,`
Obrigado por participar da nossa pesquisa!
Apartir de agora as novas menssagens 
inicia um novo atendimento!  
          `);
          await Sala.destroy({
            where: {
              sala: req.body.from,
            },
          });  

        break;
      default:
        await whatsapp(req.body.from,`
Obrigado por participar da nossa pesquisa!
Apartir de agora as novas menssagens 
inicia um novo atendimento!  
          `);
          await Sala.destroy({
            where: {
              sala: req.body.from,
            },
          });  
    }
  }
  
}
 
  
  res.sendStatus(200);
     
});

app.post('/cadastrar-usuario', async(req,res)=>{
  const usuario = await User.findOne({
    where:{
      'usuario':req.body.usuario
    }
  })
  if(usuario){
    res.status(400).json({
      'erro':true,
      'msg':'Usuario já cadastrado deseja fazer login?'
    })
    
  }else{
    req.body.senha = await bcrypt.hash(req.body.senha,10);
    await User.create(req.body);

    res.status(200).json({
      'erro':false,
      'msg':'usuario cadastrado com sucesso'
    })
  }
  
  
  
  
  
})
app.post('/login', async(req,res)=>{
   const usuario = await User.findOne({
    attributes:['usuario','senha'],
    where:{
      'usuario':req.body.usuario
    }
  })
   
  if(!usuario){
    res.status(400).json({
      'erro':true,
      'msg':'Usuario ou senha invalida!'
    })
  }else{
    const senhac = await bcrypt.compare(req.body.senha,usuario.senha)
       
      if(!senhac){
        res.status(400).json({
          'erro':true,
          'msg':'Usuario ou senha invalida!'
        })
      }else{
      var key =   jwt.sign({
          usuario: req.body.usuario
        }, 'TOKEN', { expiresIn: '1h' });

        res.status(200).json({
          'erro':false,
          'msg':'Login realizado com sucesso!',
          'usuario': req.body.usuario,
          'token':key
        })
        io.emit('login',req.body.usuario);
    }
    
  }
  
  
  
 
  
})

app.get('/', (req, res) => {
  res.render('index');
});


server.listen(process.env.PORT||3000, () => {
  console.log('servidor iniciado 3000');
});