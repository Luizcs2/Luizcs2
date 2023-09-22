let step1 = 0;
let step2 = 0;
let step3 = 0;
let step4 = 0;
let step5 = 0;
let step6 = 0;

document.getElementById("plus1").onclick = function() {
    step1+=1;
    document.getElementById("step1").innerHTML=step1;
}
document.getElementById("take1").onclick = function() {
    step1-=1;
    if(step1 < 0)
    {
        step1=0;
    }
    document.getElementById("plus1").innerHTML=step1;
}

document.getElementById("plus2").onclick = function() {
    step2+=1;
    document.getElementById("step2").innerHTML=step2;
}
document.getElementById("take2").onclick = function() {
    step2-=1;
    if(step2 < 0)
    {
        step2=0;
    }
    document.getElementById("step2").innerHTML=step1;
}

document.getElementById("plus3").onclick = function() {
    step3+=1;
    document.getElementById("step3").innerHTML=step3;
}
document.getElementById("take3").onclick = function() {
    step3-=1;
    if(step3 <0)
    {
        step3=0;
    }
    document.getElementById("step3").innerHTML=step3;

}

document.getElementById("plus4").onclick = function() {
    step4+=1;
    document.getElementById("step4").innerHTML=step4;
}
document.getElementById("take4").onclick = function() {
    step4-=1;
    if(step4 <0)
    {
        step4=0;
    }
    document.getElementById("step4").innerHTML=step4;
}

document.getElementById("plus5").onclick = function() {
    step5+=1;
    document.getElementById("step5").innerHTML=step5;
}
document.getElementById("take5").onclick = function() {
    step5-=1;
    if(step5 < 0)
    {
        step5=0;
    }
    document.getElementById("step5").innerHTML=step5;
}

document.getElementById("plus6").onclick = function() {
    step6+=1;
    document.getElementById("step6").innerHTML=step6;
}
document.getElementById("take6").onclick = function() {
    step6-=1;
    if(step6 < 0)
    {
        step6=0;
    }
    document.getElementById("step6").innerHTML=step6;

}





