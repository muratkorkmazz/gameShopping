

document.querySelector('.card-number-input').oninput = () =>{
    document.querySelector('.card-number-box').innerText = document.querySelector('.card-number-input').value;
}

document.querySelector('.card-holder-input').oninput = () =>{
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () =>{
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () =>{
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () =>{
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () =>{
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}





// 






document.querySelectorAll(".sub-img").forEach((sub) => {
    sub.addEventListener("click", changeMainImg);

})


function changeMainImg(e) {
    document.querySelector(".main-img").src = e.target.src;
}



document.getElementById("pay-button").addEventListener("click",()=>{

document.getElementById("modalButton").click();
});


document.getElementById("purchaseForm").addEventListener("submit",initializePayment);




function initializePayment(e){


    e.preventDefault();
    
    var cardNumber=document.getElementById("cardNumber").value;
    var cardHolder= document.getElementById("cardHolder").value
    var cardMonth=document.getElementById("cardMonth").value
    var cardYear=document.getElementById("cardYear").value
    var cardCvv= document.getElementById("cardCvv").value
    var list=document.querySelector(".mainContainer").dataset.listid;


    if(cardNumber && cardHolder && cardMonth && cardYear && cardCvv && list){

        $.ajax({
    url:"/payment",
    method:"POST",
    data:{
       "cardNumber":cardNumber,
       "cardHolder":cardHolder,
       "cardMonth":cardMonth,
       "cardYear":cardYear,
       "cardCvv":cardCvv,
       "list":list
    },
    success:function(data){
        if(data.result=="ok"){
            document.getElementById("alerts").style.display="block";
            setTimeout(()=>{
                window.location.href="http://localhost:3000/myList/waiting/alis";
            },1000)
        }
    },
    error:function (err){


      var alerte= document.getElementById("alerte")
      if(err.responseJSON){

        alerte.innerHTML=`${err.responseJSON.result}`;
      }else{
        alerte.innerHTML="Hata oluştu ...";
      }
   
      alerte.style.display="block";
      setTimeout(()=>{
        alerte.style.display="none";
        alerte.innerHTML="";
      },2000)

        
    } 
})



    }








}

