// ch3work_2com.js
// for CS319 ch3 exercises: 2's complement representation

// Author: Bin Peng
// Created:  7/5/2018
// Last updated: 10/22/2021
// Copyright reserved

//==================================
// Global constants and variables
//==================================

const SIZE = 8;  // 8-bit two's complement


//==================================
// helper functions
//==================================

// fill str with leading single-char fillerStr to n bits
function fillTo(str, fillerStr, n) {
  var resultStr = "";
  if (str.length < n) { // too few, need to add
	  resultStr = str;
	  var i;
	  for (i=str.length; i<n; i++) {
      resultStr = fillerStr + resultStr;
	  }
  } else if (str.length > n) { // too many, need to chop
	  resultStr = str.substr(str.length-n, n);
  } else {
	  resultStr = str;
  }
  return resultStr;
} // end function fillTo

//==================================

// convert decimal param to n-bit 2's complement
function decTo2Com(num, n) {
  var bStr2Com = "";  // 2's complement

  if (num >= 0) {
	  bStr2Com = (+num).toString(2); // binary. [0] is MSB, [str.length-1] is LSB
    bStr2Com = fillTo(bStr2Com, "0", n);  // fill to 8 bits with leading 0s
  } else { // negative
	  var tmp = (-num).toString(2); // -n's binary. [0] is MSB, [str.length-1] is LSB
	  tmp = fillTo(tmp, "0", n); // fill to 8 bits with leading 0s

	  // flip to get 1's complement
	  var i;
	  var bStr1Com = "";  // 1's complement
	  for (i=0; i<tmp.length; i++) {
	    if (tmp.charAt(i)=='0') {
		    bStr1Com += "1";
	    } else {
	      bStr1Com += "0";
	    }
	  }

	  // add 1. pretend bStr1Com is a unsigned binary
	  var n1Com = parseInt(bStr1Com, 2);  // 1's complement as an unsigned int value
	  n1Com = n1Com + 1;
	  tmp = n1Com.toString(2);

    bStr2Com = fillTo(tmp, "1", n);  // maybe longer than n bits
  }

  return bStr2Com;
} // end function decTo2Com

//==================================

// convert a n-bit 2's complement (as a string) to decimal
function twoComToDec(str, n) {
  // if positive
  var num = 0;
  if (str.charAt(0) == '0') { // positive
	  num = parseInt(str, 2);
  } else { // negative
	  var tmp = negate(str, n); // find (-n)'s 2's complement.
	  num = parseInt(tmp, 2);  // -n, a positive value
	  num = -num;
  }

  return num;
} // end function twoComToDec

//==================================

// the steps in a big string to convert an unsigned binary to decimal 
function getUnsignedBinStrSteps(str) {
  var stepStrs = "";
  var i = 0; // bit position
  while (i < str.length && str.charAt(i) == '0') { // find first 1 bit starting from MSB [0]
    i++;
  }
  if (i==str.length) // all 0s. return ""
    return stepStrs;  

  var foundOne = false;  // used to detect the first 1s
  for (; i<str.length; i++) {
    var ch = str.charAt(i);
    if (ch == '1') {
      if (!foundOne) // this is the first 1s
        foundOne = true;
      else
        stepStrs += " + ";

      stepStrs += "2<sup>" + (str.length-1 - i) + "</sup>";
    }
  }
  return stepStrs;
} // end function getUnsignedBinStrSteps

//==================================

// get the 1's complement of a binary number: flip every bit of a binary number
// str must already be n bits
function get1Com(str, n) {
  // flip to get 1's complement
  var i; // index into str
  var bStr1Com = "";  // 1's complement
  for (i=0; i<str.length && i<n; i++) { // [0] is MSB
    if (str.charAt(i)=='0') {
      bStr1Com += "1";
    } else {
	    bStr1Com += "0";
	  }
  }

  return bStr1Com;
}

//==================================

// negate a 2's complement number
// str must already be n bits
function negate(str, n) {
  // flip to get 1's complement
  var bStr1Com = get1Com(str, n);

  // add 1. pretend bStr1Com is a unsigned binary
  var n1Com = parseInt(bStr1Com, 2);  // 1's complement as an unsigned int value
  n1Com = n1Com + 1;
  var tmpStr = (+n1Com).toString(2);

  tmpStr = fillTo(tmpStr, "0", n);  // if first digit is 1, must already be n bits long. won't do anything
                                    // can only be shorter if first digit is 0

  return tmpStr;
}

//==================================
// P1. 8-bit 2's complement to decimal
//==================================

// generate a random 8-bit 2's complement number
function p1RandomN() {
  var max = Math.pow(2, SIZE-1) - 1;
  var min = -(max + 1);

  var n = Math.floor(Math.random() * (max - min + 1)) + min;
    // Returns a random integer between min (include) and max (include)

  var bStr2Com = decTo2Com(n, SIZE);

  // display number
  document.getElementById("p1Data").innerHTML = bStr2Com;
  // reset other fields
  document.getElementById("p1Input").value = ""; // user input
  document.getElementById("p1Result").innerHTML = "-";
  document.getElementById("p1Answer").innerHTML = "-";
  document.getElementById("p1CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1RandomN

//==================================

function p1CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p1Input").value.trim();

  var text =""; // result to display

  // parse the number in it. if not a valid number, will get a NaN
  var digit = parseInt(x); // student answer

  if (x.length == 0)
    text = "Please provide a response.";
  else if ( isNaN(digit) )
    text = "Incorrect - not a decimal number. Try again.";
  else {
	  var bStr2Com = document.getElementById("p1Data").innerHTML; // given 2's complement as string
    var n = twoComToDec(bStr2Com, SIZE); // given number
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
  var bStr2Com = document.getElementById("p1Data").innerHTML; // given 2's complement as string
  var n = twoComToDec(bStr2Com, SIZE);  // result

  var tmpStr = "";  // will hold the unsigned binary str
  var stepsStr = "";
  if (n>=0) { // positive
	  stepsStr = "<br> -> MSB is 0: not negative<br> -> same as unsigned binary int<br> -> ";
	  tmpStr = bStr2Com;
    stepsStr += getUnsignedBinStrSteps(tmpStr);
    if (n > 0) 
      stepsStr += " = " + (n).toString();
    else
      stepsStr += "0"; 
  } else {
	  stepsStr = "<br> -> MSB is 1: negative";
    stepsStr += "<br><br> -> Approach 1: similar to converting an unsiged binary int, <br>    but MSB carries a negative weight:";
    stepsStr += "<br> ->-> -(2)<sup>"+ (SIZE).toString() + "</sup> " ;
    tmpStr = bStr2Com.substr(1); // chop off MSB, the leading 1s. 
    var resultStr = getUnsignedBinStrSteps(tmpStr);
    if (resultStr.length != 0) { // not "" result i.e. not 0
      stepsStr += " + " + resultStr;
    }
    stepsStr += " = " + (n).toString();  

    stepsStr += "<br><br> -> Approach 2: find out its absolute value<br> ->-> Flip each bit: ";
	  stepsStr += get1Com(bStr2Com, SIZE) + "<br> ->-> Add 1:         ";
	  tmpStr = negate(bStr2Com, SIZE);
	  stepsStr += tmpStr + "<br> ->-> now same as unsigned binary int <br> ->-> ";
    stepsStr += getUnsignedBinStrSteps(tmpStr);
    stepsStr += " = " + (-n).toString();
    stepsStr += "<br> ->-> add - to the result";
  }

  document.getElementById("p1Answer").innerHTML = "Answer: " + n + "<br><pre>Given " +
      bStr2Com + stepsStr + 
      "<br> (The least significant bit/LSB has weight 2<sup>0</sup>)</pre>";
  
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1ShowAnswer


//=====================================
// P2. Decimal to 8-bit 2's complement
//=====================================

// generate a random decimal number
function p2RandomN() {
  var max = Math.pow(2, SIZE-1) - 1;
  var min = -(max + 1);

  var n = Math.floor(Math.random() * (max - min + 1)) + min;
    // Returns a random integer between min (include) and max (include)

  // display number
  document.getElementById("p2Data").innerHTML = (+n).toString();
  // reset other fields
  document.getElementById("p2Input").value = ""; // user input
  document.getElementById("p2Result").innerHTML = "-";
  document.getElementById("p2Answer").innerHTML = "-";
  document.getElementById("p2CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2RandomN

//==================================

function p2CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p2Input").value.trim();

  var text =""; // result to display

  // Decide if the student answer is a valid binary number
  // if not, will get a NaN
  // otherwise the result is valid only if a positve num
  var digit = parseInt(x, 2); // student answer

  if (x.length == 0)
    text = "Please provide a response.";
  else if (isNaN(digit))
    text = "Incorrect - not a Two's Complement number. Try again.";
  else if (x.length != SIZE)
    text = "Incorrect - not " + (+SIZE).toString() + " bits. Try again.";
  else {
	  var nStr = document.getElementById("p2Data").innerHTML; // given num as string
    var n = parseInt(nStr); // given number
    var bStr2Com = decTo2Com(n, SIZE);  // given number's 2's complement

    if (x == bStr2Com)
      text = "Correct!";
    else
      text = "Incorrect. Try again.";
  }

  document.getElementById("p2Result").innerHTML = text;
  document.getElementById("p2AnswerBtn").disabled = false; // turn on Answer button
} // end p2CheckResult

//==================================

function p2ShowAnswer() {
  var nStr = document.getElementById("p2Data").innerHTML; // given num as string
  var n = parseInt(nStr);  // given number
  var bStr2Com = decTo2Com(n, SIZE); // 2's complement result

  // steps to convert the absolute value of n to binary
  var stepsStr = "";
  var bStr = ""; // hold unsigned binary str
  if (n != 0) {
	  var absN = Math.abs(n);  // absolute value of n
	  bStr = (+absN).toString(2);  // hold unsigned binary str
    for (i=0; i<bStr.length; i++) {
      var ch = bStr.charAt(bStr.length-1 - i);
      var half = Math.floor(absN / 2);
      stepsStr += "<br />" + absN + " / 2 = " + half + ", rem " + ch ;
      absN = half;
    }
    bStr = fillTo(bStr, "0", SIZE); // absolute value's binary in SIZE # of bits
    stepsStr += "<br> -> " +  bStr +
                    " (The first remainder is the least significant bit/LSB. <br>" +
  					"Add additional leading 0s to make " + (+SIZE).toString() + " bits. )";
  }

  // show how to convert a decimal to 2's complement
  if (n == 0) {
	  var tempStr = "0";
	  stepsStr = "Zero, its 2's complement is the same as unsigned binary int: " + fillTo(tempStr, "0", SIZE);
  } else if (n>0) { // positive
	  stepsStr = " Positive<br> -> its 2's complement is the same as unsigned binary int<br> ->" + stepsStr;
  } else { // negative
	  stepsStr = " Negative: find 2's complement of its absolute value and then negate<br> -> (-n)'s 2's complement<br> ->" + stepsStr;
	  stepsStr += "<br> -> Next negate this 2's complement number: " + bStr;
	  stepsStr += "<br> -> -> Flip each bit: " + get1Com(bStr, SIZE);
	  stepsStr += "<br> -> -> Add 1:         " + bStr2Com;
  }

  document.getElementById("p2Answer").innerHTML = "Answer: " + bStr2Com + "<br><pre>Given " + n + "<br> ->" + stepsStr + "</pre>";
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2ShowAnswer
