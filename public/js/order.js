let ingredient_items= document.querySelectorAll('.order-ingredient__item-ingredient');
let price_pizza= parseInt(document.querySelector('.price-pizza').textContent);
let ingredient_elts_selected=[];
let order_btn= document.querySelector('.order-ingredient__button-order');
let warning_msg_order= document.querySelector('.warning-msg-order');
let pizza_name= document.querySelector('.pizza-name').innerText
let section_order= document.querySelector('.order');

function order_save(node,response){
    if(response=== 'success'){
        node.innerHTML='<p class="order-save"> заказ принят</p>'
    }
}

if(warning_msg_order){
    order_btn.setAttribute('disabled','disabled');
    order_btn.classList.add('disable')
}else{
    order_btn.removeAttribute('disabled');
    order_btn.classList.remove('disable');
}




function selected_item_final(tab){
    let array=[];
    for(let i=0;i<tab.length;i++)
    {
        if(tab[i].classList.contains('selected'))
        {
            array.push(tab[i])
        }
    }

    return array;
}

function price_ingredient_total(tab){

    let price_ingredients=[];

    let total;
    for(let i=0;i<tab.length;i++)
    {
      price_ingredients.push( tab[i].lastElementChild.textContent)
    }




    return price_ingredients;

}


ingredient_items.forEach((ingredient_item, index,tab)=>{
    ingredient_item.addEventListener('click',e=>{
        let total_ingredient_price=0;
        let price_total=[];
        let total_price_order=0
        ingredient_item.classList.toggle('selected')
        if(ingredient_item.classList.contains('selected') && ingredient_elts_selected.indexOf(ingredient_item)==-1)
        {
            ingredient_elts_selected.push(ingredient_item)
        }
        
       let ingredient_elts_selected_final= selected_item_final(ingredient_elts_selected)
       price_total=price_ingredient_total(ingredient_elts_selected_final)
    
     
        for(let i=0;i<price_total.length;i++)
        {
            total_ingredient_price+=parseFloat(price_total[i])
        }
       total_price_order= price_pizza+ total_ingredient_price;
       
       document.querySelector('.price-pizza').textContent= total_price_order
      // console.log(ingredient_elts_selected_final)
      
       
       
     
      

       
    })
})

order_btn.addEventListener('click',(e)=>{
    let ingredient_adds=[]
    let final_order= {name_pizza:'',list_ingredients:[] };
    let req= new XMLHttpRequest();
  
    ingredient_items.forEach(element => {
      if(element.classList.contains('selected')){
         
         ingredient_adds.push(element.querySelector('.order-ingredient__name-ingredient').textContent)
      }
     
    });
  final_order.name_pizza=pizza_name;
  final_order.list_ingredients=ingredient_adds

  req.open('POST','/saveOrder',true);
    console.log(final_order)
  req.onreadystatechange=function(){
      if(req.readyState==4 && req.status==200){
          console.log(req.responseText)
          order_save(section_order,req.responseText)
      }
  }

  req.setRequestHeader('content-type','application/x-www-form-urlencoded')
  
  req.send('order='+JSON.stringify(final_order))
    
})

