// ch3work.js
// for CS319 ch3 exercises: IEEE 754
//
// Author: Bin Peng
// Created:  8/27/2019
// Last updated: 12/8/2020
// Copyright reserved

//==================================
// Global constants and variables
//==================================

//== used by Part 1 and Part 2 ==
const SIZE = 32;  // global var. 32-bit
const BIAS = 127; // bias of 32-bit IEEE 754 is 127

//== used by Part 2 only (decimal to IEEE) ==
const POS_ZERO_IEEE_STR = "0 00000000 00000000000000000000000";
const NEG_ZERO_IEEE_STR = "1 00000000 00000000000000000000000";

var realExp = 0; // save the value between function calls decToIEEE() and p2ShowAnswer()

// save values between p2RandomN() and p2ShowAnswer()
// fraction: 0.1 ~ 0.9 or
//     a combination of 0.5, 0.25, 0.125, 0.0625
//                      2^-1, 2^02, 2^-3, 2^-4
//                     .xxxx
// Note: no 0.0. as x.0 is covered by int x
var f_arr = [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9,
             0.5, 0.25, 0.125, 0.0625,
             0.75, 0.625, 0.5625,
             0.375, 0.3125, 0.1875,
             0.875,0.6875, 0.8125, 0.4375,
             0.9375];
var f_binStrArr = [".00011(0011)*", ".0011(0011)*", ".01001(1001)*", ".0110(0110)*",
             ".1001(1001)*", ".1(0110)*", ".1100(1100)*", ".1(1100)*",
             ".1", ".01", ".001", ".0001",
             ".11", ".101", ".1001",
             ".011", ".0101", ".0011",
             ".111", ".1011", ".1101", ".0111",
			 ".1111"];
             /*
             ".1000", ".0100", ".0010", ".0001",
			 ".1100", ".1010", ".1001",
			 ".0110", ".0101", ".0011",
			 ".1110", ".1011", ".1101", ".0111",
			 ".1111"
             */
var f_index = 0;


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

// pad str with trailing single-char fillerStr to n bits
function padTo(str, fillerStr, n) {
  var resultStr;
  if (str.length > n)
    resultStr = str.substr(0, n); // chop off
  else if (str.length < n) {
    // add trailing fillers
    var numOfFillersToAdd = n - str.length;
    resultStr = str + fillerStr.repeat(numOfFillersToAdd);
  }
  else
    resultStr = str;

  return resultStr;
} // end function padTo


//==================================

// Part 1
// convert a 32-bit IEEE 754 (as a string) to decimal (as a string)
function ieeeStrToDecStr(str, n) {
  var x1 = str.substr(0, 1);  // sign
  var x2 = str.substr(1, 8);  // exponent
  var x3 = str.substr(9);     // significand

  // x2: get true value of exponent
  var biasedExp = parseInt(x2, 2);
  var realExp = biasedExp - BIAS;

  // x3: discard trailing zeros
  var indexOfLastOne = x3.lastIndexOf("1");
  var x3_trimmed = x3.substr(0, indexOfLastOne+1);

  // put x2 and x3 together
  // highest power is realExp, lowest power is (realExp - x3_trimmed.length)
  var numStr = "2<sup>" + realExp + "</sup>";
  var index = 1;
  for (;index <= x3_trimmed.length; index++)
    if (x3_trimmed.charAt(index-1) == '1')
      numStr += " + " + "2<sup>" + (realExp - index) + "</sup>";

  // sign at last
  if (x1 == "1")
    numStr = "-(" + numStr + ")";

  return numStr;
} // end function ieeeStrToDecStr

//==================================

// Part 2
// convert decimal param (float) to n-bit IEEE 754 (with space between sections)
function decToIEEE(num, n) {
  var ieeeStr = "";  // result

  if (num == 0)
    return POS_ZERO_IEEE_STR; // use +0 result. -0 result is added to steps

  // sign
  if (num < 0) { // negative
	ieeeStr = "1 ";
	num = -num;
  } else {
	ieeeStr = "0 ";
  }

  var bStr = (+num).toString(2); // raw binary

  // find binary point -> decide real exp and significant portion bits
  realExp = 0; // global var: true exp value
  var indexOfPoint = bStr.indexOf(".");
  var fStr = "";

  if (indexOfPoint >=0 ) { // with a binary point
    if (indexOfPoint == 1 && bStr.charAt(0)=="1" || indexOfPoint > 1) { // non-zero int
      realExp = indexOfPoint - 1;
      if (indexOfPoint == 1) // 1.xxx
        fStr = bStr.substr(indexOfPoint+1); // just fraction
      else
        fStr = bStr.substring(1, indexOfPoint-1) + bStr.substr(indexOfPoint+1); // after 1st one in int, including fraction bits
      // if indexOfPoint is 1 i.e. 1.xxx, first substring call
    } else { // int part is zero, a fraction smaller than 1
      var indexOfFirstOne = bStr.indexOf("1"); // must have such a one
      realExp = -(indexOfFirstOne - 1);
      fStr = bStr.substr(indexOfFirstOne + 1); // after 1st one in fraction
	}
  } else { // all int bits
    realExp = bStr.length - 1;
    fStr = bStr.substr(1); // after 1st bit
  }

  // biased exponent
  var biasedExp = realExp + BIAS;
  var biasedExpStr = biasedExp.toString(2);
  biasedExpStr = fillTo(biasedExpStr, "0", 8);

  // significand, tail pad to 23 bits
  var lenOfF = 23;
  fStr = padTo(fStr, "0", lenOfF);

  ieeeStr += biasedExpStr + " " + fStr;
  return ieeeStr;
} // end function decToIEEE


//==================================
// P1. 32-bit IEEE 754 to decimal
//==================================

// generate a random 32-bit IEEE 754 number
function p1RandomN() {
  // sign
  var sign = 0;
  if (Math.random() >=0.5) // neg
    sign = 1;

  // biased exponent: 1 ~ 254
  // 0 and 255 are reserved for special values, so just 1 ~ 254
  var seed = 254;
  var biasedExp = Math.floor(Math.random()*seed) + 1; // (0~253) + 1

  // fraction part: 0, 1, 10, 11, 100, 101, 110, 111 (the higher bits portion. rest will be 0)
  // pad with trailing zeros
  var f_bArr = ["0", "1", "10", "11", "100", "101", "110", "111"];
  var f_index = Math.floor(Math.random() * f_bArr.length);
  var f_bPart = f_bArr[f_index];

  var ieeeStr = sign.toString() + fillTo(biasedExp.toString(2), "0", 8) + padTo(f_bPart, "0", 23);
  var ieeeStrDisplay = ieeeStr.substr(0, 8) + " " +
                       ieeeStr.substr(8, 8) + " " +
                       ieeeStr.substr(16, 8) + " " +
                       ieeeStr.substr(24); // space between every 8 bits

  // display number
  document.getElementById("p1Data").innerHTML = ieeeStrDisplay;
  // reset other fields
  document.getElementById("p1Input").value = ""; // user input
  document.getElementById("p1Result").innerHTML = "-";
  document.getElementById("p1Answer").innerHTML = "-";
  document.getElementById("p1CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1RandomN

//==================================

function p1CheckResult() {
  // hard to check user work. Just show answer

  // Get the question
  var ieeeStrDisplay = document.getElementById("p1Data").innerHTML; // given IEEE 754 as string with spaces
  var ieeeStr = ieeeStrDisplay.substr(0, 8) +
                ieeeStrDisplay.substr(9, 8) +
                ieeeStrDisplay.substr(18, 8) +
                ieeeStrDisplay.substr(27); // take out spaces between 8-bit sets

  var nStr = ieeeStrToDecStr(ieeeStr, SIZE);  // result as String
  var text ="Answer shoud be: " + nStr + " or equivalent."; // result to display

  document.getElementById("p1Result").innerHTML = text;
  document.getElementById("p1AnswerBtn").disabled = false; // turn on Answer button
} // end p1CheckResult

//==================================

function p1ShowAnswer() {
  var ieeeStrDisplay = document.getElementById("p1Data").innerHTML; // given IEEE 754 as string with spaces
  var ieeeStr = ieeeStrDisplay.substr(0, 8) +
                ieeeStrDisplay.substr(9, 8) +
                ieeeStrDisplay.substr(18, 8) +
                ieeeStrDisplay.substr(27); // take out spaces between 8-bit sets

  var nStr = ieeeStrToDecStr(ieeeStr, SIZE);  // result as String

  var stepsStr = "";

  // three parts
  var x1 = ieeeStr.substr(0, 1);  // sign
  var x2 = ieeeStr.substr(1, 8);  // exponent
  var x3 = ieeeStr.substr(9);     // significand
  stepsStr = " three parts: " + x1 + " " + x2 + " " + x3;

  // sign
  stepsStr += "<br/>-> sign bit " + x1;
  if (x1 == "1")
	stepsStr += ": negative";
  else
    stepsStr += ": positive";

  // exponent
  var biasedExp = parseInt(x2, 2);
  var realExp = biasedExp - BIAS;
  stepsStr += "<br/>-> biased exp " + x2 + " i.e. " + biasedExp + " -> true exp: " + biasedExp + "-127 = " + realExp;

  // fraction: discard trailing zeros
  var indexOfLastOne = x3.lastIndexOf("1");
  var x3_trimmed = x3.substr(0, indexOfLastOne+1);
  stepsStr += "<br/>-> fraction part after discarding trailing 0s: " + x3_trimmed;
  var x3_trimmed_with1dot; // 1. + x3_trimmed
  if (x3_trimmed.length == 0) { // nothing in fraction
    x3_trimmed_with1dot = "1.0";
  } else {
    x3_trimmed_with1dot = "1." + x3_trimmed;
  }
  stepsStr += "<br/>->-> add 1. to fraction: " + x3_trimmed_with1dot;

  // together: put x2 and x3 together
  var numStr = x3_trimmed_with1dot + "<sub>2</sub> x 2<sup>" + realExp + "</sup>";
  if (x1 == "1")
    numStr = "-" + numStr;
  stepsStr += "<br/><br/>-> together: " + numStr;

  // expand out the expression
  // highest power is realExp, lowest power is (realExp - x3_trimmed.length)
  numStr = "2<sup>" + realExp + "</sup>";
  var index = 1;
  // if x3_trimmed is empty i.e. no fraction part, will skip this loop
  for (;index <= x3_trimmed.length; index++)
    if (x3_trimmed.charAt(index-1) == '1')
      numStr += " + " + "2<sup>" + (realExp - index) + "</sup>";

  // sign at last
  if (x1 == "1")
    numStr = "-(" + numStr + ")";

  stepsStr += "<br/>->-> which is: " + numStr;

  document.getElementById("p1Answer").innerHTML = "Answer: " + nStr + "<br><pre>Given " +
                               ieeeStrDisplay + "<br>->" + stepsStr +"</pre>";
  document.getElementById("p1AnswerBtn").disabled = true; // turn off Answer button
} // end p1ShowAnswer


//=====================================
// P2. Decimal to 32-bit IEEE 754
//=====================================

// generate a random decimal number
function p2RandomN() {
  // sign +/-, int 100

  // fraction: 0.1 ~ 0.9 or
  //     a combination of 0.5, 0.25, 0.125, 0.0625
  //                      2^-1, 2^02, 2^-3, 2^-4
  //                     .xxxx
  // see global var arr f_arr, f_index

  f_index = Math.floor(Math.random() * f_arr.length);

  //var f1 = Math.floor(Math.random() * 10) / 10; // 0~9, then divided by 10 -> 0.0 -> 0.9
  var f_part = f_arr[f_index];

  // int
  var seed = 100;
  var int_part = Math.floor(Math.random()*seed); // [0, 99]

  // together
  var option = document.getElementById("p2Options").value;
  var n = 0;
  if (option == "int")
    n = int_part;
  else if (option == "f")
    n = f_part;
  else // "ddd.dd". Also the default option is user doesn't choose one!!!
    n = f_part + int_part;

  // sign
  if (Math.random() >=0.5)
    n = n * (-1);

  // display number
  document.getElementById("p2Data").innerHTML = (+n).toString();
  // reset other fields
  document.getElementById("p2Input1").value = ""; // user input
  document.getElementById("p2Input2").value = "";
  document.getElementById("p2Input3").value = "";
  document.getElementById("p2Result").innerHTML = "-";
  document.getElementById("p2Answer").innerHTML = "-";
  document.getElementById("p2CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2RandomN

//==================================

function p2CheckResult() {
  // Get the value of the input field
  var x1 = document.getElementById("p2Input1").value.trim();
  var x2 = document.getElementById("p2Input2").value.trim();
  var x3 = document.getElementById("p2Input3").value.trim();

  // piece three parts together
  var x = "" + x1 + x2 + x3; // first w/o spaces

  var text =""; // result to display

  // The purpose is to decide if the student answer is a valid IEEE 754 number
  // i.e. if 32 bits
  var regex=/[0|1]{32}/ // student answer

  if (x1.length==0 || x2.length==0 || x3.length==0)
    text = "At least one response field is empty";
  else if (!regex.test(x))
    text = "Incorrect - not 32 bits.";
  else {
	x = x1 + " " + x2 + " " + x3; // now with space between sections

	var nStr = document.getElementById("p2Data").innerHTML; // given num as string
    var n = parseFloat(nStr);

    // check for +0 or -0
    if (n == 0 && (x == POS_ZERO_IEEE_STR || x == NEG_ZERO_IEEE_STR) )
      text = "Correct! Special value for 0";
    else if (n>0 && x1 =="1" || n<0 && x1=="0") // check sign
	  text = "Incorrect sign bit. No further checking";
    else {
      // now check values
      var resultStr = decToIEEE(n, SIZE);

      if (x == resultStr)
        text = "Correct!";
      else
        text = "Incorrect. Try again.";
    }
  }
  document.getElementById("p2Result").innerHTML = text;
  document.getElementById("p2AnswerBtn").disabled = false; // turn on Answer button
} // end p2CheckResult

//==================================

function p2ShowAnswer() {
  var nStr = document.getElementById("p2Data").innerHTML; // given num as string
  var n = parseFloat(nStr);  // given number
  var resultStr = decToIEEE(n, SIZE); // IEEE 754 result

  // steps
  var stepsStr = "";

  // +0 or -0 is a special value in IEEE 754
  if (n==0) {
    stepsStr = "Special value for 0 (or: " + NEG_ZERO_IEEE_STR + ")";
    document.getElementById("p2Answer").innerHTML = "Answer: " + resultStr + "<br><pre>Given " + nStr + "<br>->" + stepsStr + "</pre>";
	document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
    return;
  }

  // now not zero
  stepsStr = nStr;

  // sign
  if (n > 0) // positive
	stepsStr = " positive: sign bit 0";
  else
	stepsStr = " negative: sign bit 1";

  // int
  var absN = Math.abs(n);
  var intAbsN = Math.floor(absN);
  var intBStr = intAbsN.toString(2);

  // f
  var fBStr = "";
  if (absN - intAbsN > 0) // w fraction
	fBStr = f_binStrArr[f_index];

  stepsStr += "<br/>-> " + Math.abs(n) + " to unsigned binary: " + intBStr + fBStr;

  // normalize
  stepsStr += "<br/>-> normalize: ";
  var newFBStr = "";
  if (realExp > 0) { // global var: realExp
                     // move dot left
    //stepsStr += intBStr.substr(0, intBStr.length-realExp) + ".";
    newFBStr = intBStr.substr(intBStr.length-realExp) + fBStr.substr(1);
  } else if (realExp < 0) { // move dot right
    newFBStr = fBStr.substr(1-realExp);
  }
  if (newFBStr.length==0) // nothing i.e. 1.
    newFBStr = "0";
  stepsStr += "1." + newFBStr;
  stepsStr += " x 2<sup>" + realExp + "</sup>";

  // into three parts
  var biasedExpStr = fillTo((realExp+127).toString(2), "0", 8);
  stepsStr += "<br/>->-> biased exp is: " + (realExp) + " + 127 = " + (realExp+127) + " -> " + biasedExpStr;
  stepsStr += "<br/>->-> drop leading 1. of " + "1." + newFBStr + " -> fraction part: " + newFBStr;
  stepsStr += "<br/><br/>-> together: sign-bit " + biasedExpStr + " " + newFBStr;
  if (newFBStr.charAt(newFBStr.length-1) != '*')
    stepsStr += " (add trailing 0s to reach 23 bits)";

  document.getElementById("p2Answer").innerHTML = "Answer: " + resultStr + "<br><pre>Given " + nStr + "<br>->" + stepsStr + "</pre>";
  document.getElementById("p2AnswerBtn").disabled = true; // turn off Answer button
} // end p2ShowAnswer