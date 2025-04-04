import { Sala } from "./sala.js";
import { Msg } from "./msg.js";
import { URLBASE,TOKENAPI } from "./config.js";


export const whatsapp =async (sender,msg)=>{  
    const options ={
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": TOKENAPI
        },
        body: JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": sender,
                "type": "text",
                "text": {
                    "preview_url": "false",
                    "body": msg
                }
          })
  }
 const request =  await fetch(URLBASE,options);
 const response = await request.json();
 return response;
}

export const menssagem ={
    'bem vindo':`Bom dia! Sou Mercadinho seu assistente virtual,
digite o numero correspondente ao atendimento que procura!

1- Falar com Atendente.
2- Consultar Preços.
3- Fazer Pedido.
4- Finalizar Atendimento.   `,
    'erro':`
1- Falar com Atendente.
2- Consultar Preços.
3- Fazer Pedido.
4- Finalizar Atendimento.`,
    'fechado':`
No momento estamos fechado
horário de atendimento
08:30 as 19:30hras

Agradecemos a compreenção!
Tenha um ótimo dia!`,
    'menu':`
#######--MENU--#######
    
1- Falar com Atendente.
2- Consultar Preços.
3- Fazer Pedido.
4- Finalizar Atendimento.    
    `
                
};

export const protocolo = async(id)=>{
    return Math.random();
}

export const busca =async (produto)=>{
   try {
    const request =  await fetch('http://mercadinhodacachaca.ddns.net:8282/api/produtos/listar/'+produto);
    const response = await request.json();
    return response;
   } catch (error) {
    return {
        "status":"erro",
        "resposta":{
            "DESCRICAO":"Produto nao encontrado"
        }
    }
   }
    
}