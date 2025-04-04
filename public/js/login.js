const containerLogin = document.getElementById('login');
const containerCadastro = document.getElementById('cadastro');
const btnCadastro = document.getElementById('btncad');
const voltar = document.getElementById('voltar');
const logar = document.getElementById('logar');
const msglogin = document.getElementById('msg');
const Cadastrar = document.getElementById('cadastrar');
const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');


btnCadastro.addEventListener('click',()=>{
    containerLogin.style.display='none';
    containerCadastro.style.display='block';
});

voltar.addEventListener('click',()=>{
    containerLogin.style.display='block';
    containerCadastro.style.display='none';
});

logar.addEventListener('submit',async(e)=>{
    e.preventDefault();
    

    if(usuario.value ==''|| senha.value ==''){
        msglogin.innerText='Existe Campo vazio por favor verifique e preencha corretamete';
        msglogin.classList.add('toogle');
    }else{

        const headers ={
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },   
            body:JSON.stringify({
                'usuario': usuario.value,
                'senha':senha.value
            })
        };
        const requisicao = await fetch('https://chat-han4.onrender.com/login',headers);
        const response = await requisicao.json();
        if(!response.erro){
            localStorage.setItem('Usuario',JSON.stringify({'usuario':response.usuario,'token':response.token}))
            location.href='home.html';
        }else{
            msglogin.innerHTML=`<div class="erro">
                            ${response.msg} 
                        </div>`   
        }
        
        
    }   
})


Cadastrar.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const nome = document.getElementById('Cadnome');
    const usuario = document.getElementById('Cadusuario');
    const senha = document.getElementById('Cadsenha');
    const msg = document.getElementById('Cadmsg');

    if(nome.value == '' || usuario.value =='' || senha.value ==''){
        msg.innerText='Existe campo em branco por favor preencha corretamente';
    }else{
        const options ={
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },   
            body:JSON.stringify({
                'nome':nome.value,
                'usuario': usuario.value,
                'senha':senha.value
            })
        };
        const requisicao = await fetch('https://chat-han4.onrender.com/cadastrar-usuario',options);
        const response = await requisicao.json();
         if(requisicao.status == 400){
            msg.innerHTML=`<div class="erro">
                            ${response.msg} <button id="clickvoltar" class="voltar">Click aqui</button>
                        </div>`
         }else{
            msg.innerHTML=`<div class="sucesso">
                            ${response.msg} 
                        </div>`
                        nome.value ='';
                        usuario.value='';
                        senha.value='';
         }
        
    }
})





