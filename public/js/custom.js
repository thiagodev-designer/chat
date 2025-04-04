

const usuario = JSON.parse(localStorage.getItem('Usuario'));
const usuarioLogado = document.getElementById('usuarioLogado');
usuarioLogado.innerText= usuario.usuario;
const chat = document.getElementById('conversation');
const contChat = document.getElementById('chat');
const comment = document.getElementById('comment');
const form = document.getElementById('form');
const hidden = document.getElementById('hidden');
const hiddensair = document.getElementById('hiddensair');
const FinalizarAtt = document.getElementById('FinalizarAtt');
let localname;

const listaMsg = lista =>{   
    
   const data = new Date(lista.time*1000);
   const hora = data.getHours();
   const minuto = data.getMinutes().toFixed(0); 

    var classe = lista.status;// receiver sender
    chat.innerHTML+=`
      
      <div class="row message-body">
        <div class="col-sm-12 message-main-${classe}">
          <div class="receiver">
            <div class="message-text">
             ${lista.text}
            </div>
            <span class="message-time pull-right">
              ${hora}:${minuto}
            </span>
            <span class=""></span>
          </div>
        </div>
      </div>
      
    `;
    
   chat.scrollTo(0,chat.scrollHeight); 
}

const buscaDados =async (dados)=>{
  chat.innerHTML=''; 
  localname = dados.toString();
  const lisMsg = JSON.parse(localStorage.getItem(localname));
  
  const usuario = JSON.parse(localStorage.getItem('received'));
  usuario[0].status='ok';
  
  const busca= usuario.filter((usuario)=>{
    if(usuario.sala == dados){

      return usuario
    }
  });
  const upp = busca[0].nome.toUpperCase()
  const um =upp.split("",1);
  const text = um + busca[0].nome.replace(busca[0].nome.split("",1),"") 

  
  const nome = document.getElementById('nome')
  nome.innerText =text  
  salaId=dados;
  const id = document.getElementById(dados);
  id.innerText="";
  id.style.display="none";
  
    
  lisMsg.forEach(listaMsg);
    
    
contChat.style.display='block';
contChat.setAttribute('data-js',dados)

chat.scrollTo(0,chat.scrollHeight);

}  
form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const arr = JSON.parse(localStorage.getItem(localname));
  const msg={
    'text': comment.value,
    'time':new Date(Date()).getTime(),
    'status':'sender'
  }
  arr.push(msg);
  
  

  localStorage.setItem(localname,JSON.stringify(arr));
  chat.innerHTML='';
  arr.forEach(listaMsg);
  socket.emit('enviar-Msg',{
    'sala':localname,
    'text':comment.value
  })

  comment.value='';
  
  
}) 

hidden.addEventListener('click',()=>{
  hiddensair.classList.toggle('hide');
})
FinalizarAtt.addEventListener('click',()=>{
  const nome = contChat.getAttribute('data-js').toString();
  socket.emit('Finalizar',nome);
  localStorage.removeItem(nome);
  
   const data = JSON.parse(localStorage.getItem('received'));
    const delet = data.filter(item =>item.sala != nome);
    console.log(delet);
    
    localStorage.setItem('received',JSON.stringify(delet));
    
    
    atualizaTela(delet);
})