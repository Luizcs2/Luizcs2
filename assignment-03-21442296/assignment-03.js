var assaignment = 5;
var counter = 6;
var tableWidth = 8;
var tableHeight = 10;

var emptyCells = 50;
var cellCount = 0;

function average() {
  var table = document.getElementById('Table');
  var row = table.rows, col = table.rows[0].cells, sum = 0;
  cellCount = 0;
  emptyCells = 0;
  for (var i = 1; i < row.length; i++) {
    sum = 0;
    for (var x = 2; x < col.length - 1; x++) {  
      if (parseInt(table.rows[i].cells[x].innerText) <= 100 && parseInt(table.rows[i].cells[x].innerText) >= 0) {
        sum += parseInt(table.rows[i].cells[x].innerText);
        table.rows[i].cells[x].setAttribute('class', 'right');
        cellCount++;
      }
      else{
        table.rows[i].cells[x].innerText = "-"
        table.rows[i].cells[x].setAttribute('class', 'unSubmittedCenter');
      }
      emptyCells++;
    }

    var a = Math.round(sum / assaignment);
    
    table.rows[i].cells[col.length - 1].innerText = a;
    
    if (a < 60) {
      var final = table.rows[i].cells[col.length - 1];
      final.setAttribute('class', 'fail');
    } 
   else {
      var final = table.rows[i].cells[col.length - 1];
      final.setAttribute('class', 'pass');
    }
  }
  emptyCells = emptyCells - cellCount;
  document.getElementById('emptyCells').innerHTML = "Un-submitted	assignments: " + emptyCells;
}



function addRow() {
  tableHeight++;
  var tab = document.getElementById("Table");
  var len = tab.rows.length;
  var row = tab.insertRow(-1);
  var col = tab.rows[0].cells.length;


  for (var x = 0; x < col; x++) {
    var newCell = row.insertCell(x);

    if (x < 2) {
      newCell.className = 'left';
      newCell.setAttribute('contenteditable', 'true');
    }
    else if (x < col-1) {
      newCell.className = 'unSubmittedCenter';
      newCell.setAttribute('contenteditable', 'true');
      newCell.setAttribute('onblur', 'average()');
      emptyCells++;
    }
    if (x == col - 1)
      newCell.className = 'result';
    newCell.innerHTML = "-";
    newCell.setAttribute('contenteditable', 'true');
    newCell.setAttribute('onblur', 'average()');
    
    
  }

  document.getElementById('emptyCells').innerHTML = "Un-submitted	assignments: " + emptyCells;

}
function addCol() {
  tableWidth++;
  assaignment++;
  var tab = document.getElementById("Table");
  var row = tab.rows.length,
    colunm = tab.rows[0].cells.length,
    head = 0;
  

  emptyCells = emptyCells + row-1;

  for (var i = 0; i < row; i++) {
    var newCell = tab.rows[i].insertCell(colunm - 1);
    if (i == 0) {
      newCell.innerHTML = "Assignment " + counter;
      newCell.setAttribute('class', 'heading');
      counter++;
    } else{
      newCell.innerHTML = "-";
      newCell.className = 'unSubmittedCenter';}
      
    newCell.setAttribute('contenteditable', 'true');
    newCell.setAttribute('onblur', 'average()');
  }


  document.getElementById('emptyCells').innerHTML = "Un-submitted	assignments: " + emptyCells;
}


const finalGrade = document.querySelector("#finalGrade");
var gradeType = 0;

finalGrade.addEventListener('click',(event) =>{
  var table = document.getElementById('Table');
  var row = table.rows, col = table.rows[0].cells;

  gradeType++;
  console.log(gradeType);

  for (var i = 1; i < row.length; i++) {
    var final = table.rows[i].cells[col.length - 1];
    if(gradeType == 1){
      finalGrade.innerHTML = "Average [Letter]";
      if(parseInt(final.innerText) < 60){
        table.rows[i].cells[col.length - 1].innerText = "F";
      }
      else if(parseInt(final.innerText) > 59 && parseInt(final.innerText) < 63){
        table.rows[i].cells[col.length - 1].innerText = "D-";
      }
      else if(parseInt(final.innerText) > 62 && parseInt(final.innerText) < 67){
        table.rows[i].cells[col.length - 1].innerText = "D";
      }
      else if(parseInt(final.innerText) > 66 && parseInt(final.innerText) < 70){
        table.rows[i].cells[col.length - 1].innerText = "D+";
      }
      else if(parseInt(final.innerText) > 69 && parseInt(final.innerText) < 73){
        table.rows[i].cells[col.length - 1].innerText = "C-";
      }
      else if(parseInt(final.innerText) > 72 && parseInt(final.innerText) < 77){
        table.rows[i].cells[col.length - 1].innerText = "C";
      }
      else if(parseInt(final.innerText) > 76 && parseInt(final.innerText) < 80){
        table.rows[i].cells[col.length - 1].innerText = "C+";
      }
      else if(parseInt(final.innerText) > 79 && parseInt(final.innerText) < 83){
        table.rows[i].cells[col.length - 1].innerText = "B-";
      }
      else if(parseInt(final.innerText) > 82 && parseInt(final.innerText) < 87){
        table.rows[i].cells[col.length - 1].innerText = "B";
      }
      else if(parseInt(final.innerText) > 86 && parseInt(final.innerText) < 90){
        table.rows[i].cells[col.length - 1].innerText = "B+";
      }
      else if(parseInt(final.innerText) > 89 && parseInt(final.innerText) < 93){
        table.rows[i].cells[col.length - 1].innerText = "A-";
      }
      else if(parseInt(final.innerText) > 92){
        table.rows[i].cells[col.length - 1].innerText = "A";
      }
    }

    if(gradeType == 2){
      finalGrade.innerHTML = "Average [4.0]";
      if((final.innerText).toString() == "F"){
        table.rows[i].cells[col.length - 1].innerText = "0.0";
      }
      else if((final.innerText).toString() == "D-"){
        table.rows[i].cells[col.length - 1].innerText = "0.7";
      }
      else if((final.innerText).toString() == "D"){
        table.rows[i].cells[col.length - 1].innerText = "1.0";
      }
      else if((final.innerText).toString() == "D+"){
        table.rows[i].cells[col.length - 1].innerText = "1.3";
      }
      else if((final.innerText).toString() == "C-"){
        table.rows[i].cells[col.length - 1].innerText = "1.7";
      }
      else if((final.innerText).toString() == "C"){
        table.rows[i].cells[col.length - 1].innerText = "2.0";
      }
      else if((final.innerText).toString() == "C+"){
        table.rows[i].cells[col.length - 1].innerText = "2.3";
      }
      else if((final.innerText).toString() == "B-"){
        table.rows[i].cells[col.length - 1].innerText = "2.7";
      }
      else if((final.innerText).toString() == "B"){
        table.rows[i].cells[col.length - 1].innerText = "3.0";
      }
      else if((final.innerText).toString() == "B+"){
        table.rows[i].cells[col.length - 1].innerText = "3.3";
      }
      else if((final.innerText).toString() == "A-"){
        table.rows[i].cells[col.length - 1].innerText = "3.7";
      }
      else if((final.innerText).toString() == "A"){
        table.rows[i].cells[col.length - 1].innerText = "4.0";
      }
    }

    if(gradeType == 3){
      finalGrade.innerHTML = "Average [%]";
      gradeType = 0;
      average();
    }
  }
});

function retrieveTable(){
  var table = document.getElementById("Table");
  while(tableWidth > 8){
    var rowCount = table.rows.length; 
    for(i = 0; i < rowCount; i++){
      table.rows[i].deleteCell(tableWidth-2)
      emptyCells--;
    }
    tableWidth--;
  }
  while(tableHeight> 10){
    table.deleteRow(tableHeight);
    emptyCells = emptyCells - 5;
    tableHeight--;
  }
  document.getElementById('emptyCells').innerHTML = "Un-submitted	assignments: " + emptyCells;
}