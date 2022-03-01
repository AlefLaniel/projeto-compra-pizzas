let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cl = (el) => document.querySelectorAll(el);


// Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
   
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `A partir de ${item.price[0].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[2].toLocaleString("pt-br", { style: "currency", currency:"BRL"})}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cl('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
        });

        cl('.pizzaInfo--size').forEach((sizeItem, sizeIndex)=> {
            sizeItem.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity= 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity= 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
const closeModal = () =>{
    c('.pizzaWindowArea').style.opacity= 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display= 'none';
    }, 500);
};
cl('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

function inputClass(event){
    let clickedItem = event.currentTarget;
    let dataKey = clickedItem.getAttribute('data-key')
    cl('.pizzaInfo--size').forEach((element)=>{
        element.classList.remove("selected");
    });
    clickedItem.classList.add("selected");
    c('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `${pizzaJson[modalKey].price[dataKey].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
}

cl('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', inputClass);
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=> item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{

        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            price: pizzaJson[modalKey].price[size],
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
       c('aside').style.left = '0'; 
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){

            let pizzaItem = pizzaJson.find( (item)=> item.id == cart[i].id );

            subtotal += cart[i].price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2: 
                    pizzaSizeName = 'G';
                    break;
                default:
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;


        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}


// Mascaras de inputs
function mascaraTel(telefone){ 
    if(telefone.value.length == 0)
        telefone.value = '(' + telefone.value; 
    if(telefone.value.length == 3)
        telefone.value = telefone.value + ') '; 

    if(telefone.value.length == 10)
        telefone.value = telefone.value + '-';

}

function mascaraCEP(cep) {
    if(cep.value.length == 5)
        cep.value = cep.value + '-';

}

// Requisição para o email
let inputDetailsp = document.getElementsByName('detailsp');
let inputSubtotal = document.getElementsByName('subtotal');
let inputDesconto = document.getElementsByName('desconto');
let inputTotal = document.getElementsByName('total');
let inputNome = document.getElementsByName('nome');
let inputEmail = document.getElementsByName('email');
let inputTelefone = document.getElementsByName('telefone');
let inputRua = document.getElementsByName('rua');
let inputNumeroCasa = document.getElementsByName('numerocasa');
let inputComplemento = document.getElementsByName('complemento');
let inputCep = document.getElementsByName('cep');




function send(campos){
    fetch("http://localhost:3030/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(campos),
})
  .then((response) => response.json())
  .then((campos) => {
    console.log("Success:", campos);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

function handleFormSubmit(event){  
    event.preventDefault()
    
    const detailsp = inputDetailsp[0].value;
    const subtotal = inputSubtotal[0].value;
    const desconto = inputDesconto[0].value;
    const total = inputTotal[0].value;
    const nome  = inputNome[0].value;
    const email  = inputEmail[0].value;
    const telefone = inputTelefone[0].value;
    const rua = inputRua[0].value;
    const numerocasa = inputNumeroCasa[0].value;
    const complemento = inputComplemento[0].value;
    const cep = inputCep[0].value;
    const campos ={
        detailsp: detailsp,
        subtotal: subtotal,
        desconto: desconto,
        total: total,
        nome: nome,
        email: email,
        telefone: telefone,
        rua: rua,
        numerocasa: numerocasa,
        complemento: complemento,
        cep: cep
    }
    console.log(campos); 
    send(campos);
    /*
    setTimeout(function(){
      window.location.href = "https://anuscabarros.com.br/obrigado";
    }, 1500);
    */
  }