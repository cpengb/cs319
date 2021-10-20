// ch2work.js
// for CS319 ch2 exercises: unsigned int/fraction <-> binary

// Author: Bin Peng
// Created:  7/5/2018
// Last updated: 10/20/2021
// Copyright reserved

//==================================
// P1. binary to decimal
//==================================

// generate a random binary int
function p1Random0ToN() {
  var seed = 800;
  var n = Math.floor(Math.random()*seed);
  var bStr = (+n).toString(2); // int to binary

  // display number
  document.getElementById("p1Data").innerHTML = bStr;
  // reset other fields
  document.getElementById("p1Input").value = ""; // user input
  document.getElementById("p1Result").innerHTML = "-";
  document.getElementById("p1Answer").innerHTML = "-";
  document.getElementById("p1CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1Random0ToN

//==================================

function p1CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p1Input").value.trim();

  var text; // result to display

  // parse the number in it. if not a valid number, will get a NaN
  var digit = parseInt(x); // student answer

  if (x.length == 0)
    text = "Please provide a response.";
  else if (isNaN(digit))
    text = "Incorrect - not a decimal number. Try again.";
  else {
    var n = parseInt(document.getElementById("p1Data").innerHTML, 2); // given number
    if (digit == n)
      text = "Correct!";
    else
      text = "Incorrect. Try again.";
  }

  document.getElementById("p1Result").innerHTML = text;
  document.getElementById("p1AnswerBtn").disabled = false; // turn on Answer button
} // end p1CheckResult

//==================================

function p1ShowAnswer() {
  var bStr = document.getElementById("p1Data").innerHTML; // given number, in binary
  var nStr = parseInt(bStr, 2); // result

  var n = 0; // result
  var steps1 = "those bit positions have 1s: ";
  var steps2 = "";
  var i = 0; // loop variables

  for (i=0; i<bStr.length; i++) { // [0] is the MSB
    var ch = bStr.charAt(i);
    if (ch == '1') {
      if (i>0) { 
        steps1 += ", ";
        steps2 += " + ";
      }
      steps1 += "" + (bStr.length-1 - i);
      steps2 += "2<sup>" + (bStr.length-1 - i) + "</sup>";
    }
  }

  document.getElementById("p1Answer").innerHTML = "Answer: " + nStr + 
      "<br>Given " + bStr + ", <br>" + steps1 + 
      "<br>(The rightmost bit/least significant bit/LSB is at position 0)<br>" + 
      " -> the value is " + steps2 + 
      "<br> (The least significant bit/LSB has weight 2<sup>0</sup>)";
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1ShowAnswer


//==================================
// P2. decimal to binary - integer
//==================================

// generate a random int
function p2Random0ToN() {
  var seed = 300;
  var n = Math.floor(Math.random()*seed);
  // display number
  document.getElementById("p2Data").innerHTML = n;
  // reset other fields
  document.getElementById("p2Input").value = ""; // user input
  document.getElementById("p2Result").innerHTML = "-";
  document.getElementById("p2Answer").innerHTML = "-";
  document.getElementById("p2CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2Random0ToN

//==================================

function p2CheckResult() {
  // Get the value of the input field with id="p2input"
  var x = document.getElementById("p2Input").value.trim();

  var text; // result to display

  // parse the binary in it. if not a valid binary number, will get a NaN
  var digit = parseInt(x, 2);

  if (x.length == 0)
    text = "Please provide a response.";
  else if (isNaN(digit))
    text = "Incorrect - not a binary number. Try again.";
  else {
    var n = parseInt(document.getElementById("p2Data").innerHTML);
    if (digit == n)
      text = "Correct!";
    else
      text = "Incorrect. Try again.";
  }

  document.getElementById("p2Result").innerHTML = text;
  document.getElementById("p2AnswerBtn").disabled = false; // turn on Answer button
} // end p2CheckResult

//==================================

function p2ShowAnswer() {
  var nStr = document.getElementById("p2Data").innerHTML;
  var bStr = (+nStr).toString(2); // binary

  var n = parseInt(nStr);

  var steps = "";
  var i = 0;

  if (n == 0)
    steps = "none.";
  else {
    for (i=0; i<bStr.length; i++) {
      var ch = bStr.charAt(bStr.length-1 - i);
      var half = Math.floor(n / 2);
      steps += "<br />" + n + " / 2 = " + half + ", remainder " + ch ;
      n = half;
    }
  }

  document.getElementById("p2Answer").innerHTML = "Answer: " + bStr + "<br><pre>" + steps + "--> MSB </pre>";
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2ShowAnswer


//==================================
// P3. decimal to binary - fraction
//==================================

// generate a random int
function p3Random0ToN() {
  var n = Math.random();
  n = Math.floor(n * 1000) / 1000; // 3 decimal digits

  // display number
  document.getElementById("p3Data").innerHTML = n;
  // reset other fields
  document.getElementById("p3Input").value = ""; // user input
  document.getElementById("p3Result").innerHTML = "-";
  document.getElementById("p3Answer").innerHTML = "-";
  document.getElementById("p3CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p3AnswerBtn").disabled = true; // turn off Answer button
} // end p3Random0ToN

//==================================

function p3CheckResult() {
  // Get the value of the input field with id="p3Input"
  var x = document.getElementById("p3Input").value.trim();

  var text; // result to display

  // parse the binary in it. if not a valid binary number, will get a NaN
  var digit = parseInt(x, 2);

  if (x.length == 0)
    text = "Please provide a response.";
  else if (isNaN(digit))
    text = "Incorrect - not a binary number. Try again.";
  else {
    var nStr = document.getElementById("p3Data").innerHTML;
    var bStr = (+nStr).toString(2); // binary
	if (bStr.length > 10)
      bStr = bStr.substr(0, 10); // chop off extra bits beyond 8

    if (x == bStr) // only okay up to 8 bits after point. Can't have extra bits, even if 0s. !!
      text = "Correct!";
    else
      text = "Incorrect. Try again.";
  }

  document.getElementById("p3Result").innerHTML = text;
  document.getElementById("p3AnswerBtn").disabled = false; // turn on Answer button
} // end p3CheckResult

//==================================

function p3ShowAnswer() {
  var nStr = document.getElementById("p3Data").innerHTML;
  var bStr = (+nStr).toString(2); // binary
  if (bStr.length > 10)
    bStr = bStr.substr(0, 10); // chop off extra bits beyond 8 binary digits
                               // 10 chars: 0. + 8 digits after .

  var n = nStr;

  var steps = "";
  var i = 0; // # of binary digits

  if (n == 0)
    steps = "0";
  else {
    while (n > 0 && i<8) {
      var dbl = (n * 2).toFixed(3);  // to maintain at most 3 decimal digits
      var ch = 0;
      if (dbl >=1)
        ch = 1;
      steps += "<br />" + n + " * 2 = " + dbl + ", int " + ch ;

      n = dbl;
      if (dbl >= 1)
        n = (dbl - 1).toFixed(3);  // to maintain at most 3 decimal digits

      i++;
    }
  }

  document.getElementById("p3Answer").innerHTML = "Answer: " + bStr + "<br><pre>" + steps + "--> LSB </pre>";
  document.getElementById("p3AnswerBtn").disabled = true; // turn off Answer button
} // end p3ShowAnswer
