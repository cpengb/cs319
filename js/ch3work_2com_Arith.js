// ch3work_2com_Arith.js
// for CS319 ch3 exercises: 2's complement arithmetic

// Author: Bin Peng
// Created:  10/15/2019
// Last updated: 12/8/2020
// Copyright reserved


//==================================
// Global constants and variables
//==================================

var SIZE = 8;  // global var


//==================================
// helper functions
//==================================

// fill str with leading single-char fillerStr to n bits
// will chop the str if the str is longer than n bits
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

// get the 1's complement of a binary number: flip every bit of a binary number
// Pre: str must already be n bits
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
// Pre: str must already be n bits
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

// add two 2's complement numbers and return result as a string
// Pre: str1 and str2 must already be n bits
function addTwoCompl(str1, str2, n) {
  var i; // index into str
  var bStr2ComResult = "";
  var carry = 0;
  for (i=n-1; i>=0 && i<str1.length && i<str1.length; i--) { // [0] is MSB, [n-1] is LSB
	var c1 = str1.charAt(i) - '0';
	var c2 = str2.charAt(i) - '0';

	// c1 + c2 + carry
	var r = c1 + c2 + carry;
	if (r > 1) {
	  r -= 2;
	  carry = 1;
	} else {
	  carry = 0;
	}

    if (r==0) {
	  bStr2ComResult = "0" + bStr2ComResult;
	} else {
	  bStr2ComResult = "1" + bStr2ComResult;
	}
  } // end loop

  if (carry==0) {
  	bStr2ComResult = "0" + bStr2ComResult;
  } else {
  	bStr2ComResult = "1" + bStr2ComResult;
  }

  return bStr2ComResult; // will be n+1 bits
}

//==================================

// sub two 2's complement numbers and return result as a string
// Pre: str1 and str2 must already be n bits
function subTwoCompl(str1, str2, n) {
  return addTwoCompl(str1, negate(str2, n), n);
}

//==================================

// generate a random 2's complement number and return as a string
function genRndTwoCompl(n) {
  var max = Math.pow(2, n-1) - 1;
  var min = -(max + 1);

  var num = Math.floor(Math.random() * (max - min + 1)) + min;
    // Returns a random integer between min (include) and max (include)

  return decTo2Com(num, n);
}


//==================================
// P1 Arith. Negate
//==================================

// generate a random 8-bit 2's complement number
function p1A_RandomN() {
  // random n
  var bStr2Com = genRndTwoCompl(SIZE);
  // display number
  document.getElementById("p1A_Data").innerHTML = bStr2Com;

  // reset other fields
  document.getElementById("p1A_Input").value = ""; // user input
  document.getElementById("p1A_Input_Overflow").checked = false; // user checkbox input
  document.getElementById("p1A_Result").innerHTML = "-";
  document.getElementById("p1A_Answer").innerHTML = "-";
  document.getElementById("p1A_CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p1A_AnswerBtn").disabled = true; // turn off Answer button
} // end p1A_RandomN

//==================================

function p1A_CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p1A_Input").value.trim();

  var text =""; // result to display

  // The purpose is to decide if the student answer is a valid binary number
  // if not, will get a NaN
  // otherwise the result is valid only if a positve num
  var digit = parseInt(x, 2); // student answer

  if (x.length == 0) {
	text = "Please provide a response.";
  } else if (isNaN(digit)) {
    text = "Incorrect - not a Two's Complement number. Try again.";
  } else if (x.length != SIZE) {
    text = "Incorrect - not " + (+SIZE).toString() + " bits. Try again.";
  } else {
	var bStr2Com = document.getElementById("p1A_Data").innerHTML; // given 2's complement as string
    var bStr2ComNeg = negate(bStr2Com, SIZE); // the expected result after negation

	var isOverflow = false; // mostly no overflow
	if ( bStr2Com.charAt(0) == bStr2ComNeg.charAt(0) ) {
	  isOverflow = true; // overflow happens in negate when the sign bit [0]
	                         // remains same
	}
    var overflowInput = document.getElementById("p1A_Input_Overflow").checked;

	if (x == bStr2ComNeg) {
      if (overflowInput == isOverflow) {
	    text = "Correct!";
	  }
	  else { // wrong overflow input
	    text = "Correct negatation, but incorrect overflow result.";
	  }
    } else {
	  text = "Incorrect negation. Try again.";
    }

  } // else

  document.getElementById("p1A_Result").innerHTML = text;
  document.getElementById("p1A_AnswerBtn").disabled = false; // turn on Answer button
} // end p1CheckResult

//==================================

function p1A_ShowAnswer() {
  var bStr2Com = document.getElementById("p1A_Data").innerHTML; // given 2's complement as string
  var bStr1Com = get1Com(bStr2Com, SIZE);  // result after flipping
  var bStr2ComNeg = negate(bStr2Com, SIZE); // the expected result after negation

  var stepsStr = " First flip each bit: " + bStr1Com;
  stepsStr += "<br> -> Now add 1:           " + bStr2ComNeg;

  var isOverflow = false; // mostly no overflow
  if ( bStr2Com.charAt(0) == bStr2ComNeg.charAt(0) ) {
  	isOverflow = true; // overflow happens in negate when the sign bit [0]
  	                         // remains same
  }

  if (isOverflow) {
    stepsStr += "<br><br> -> (Negation) Overflow happened, as the expected result has the same sign as the given number.";
    stepsStr += "<br> -> The result " + bStr2ComNeg + " is invalid. Should not be used." ;
  } else {
	stepsStr += "<br><br> -> (Negation) There is no overflow, as the expected result and the given number have different signs.";
    stepsStr += "<br> -> The result is: " + bStr2ComNeg + " ( negate "
      + twoComToDec(bStr2Com, SIZE) + " -> " + twoComToDec(bStr2ComNeg, SIZE) + " )";
  }
  document.getElementById("p1A_Answer").innerHTML = "Answer: " + "<br><pre>Given " +
                               bStr2Com + "<br> ->" + stepsStr + "</pre>";
  document.getElementById("p1A_AnswerBtn").disabled = true; // turn off Answer button
} // end p1A_ShowAnswer

//==================================
// P2 Arith. Addition
//==================================

// generate two random 8-bit 2's complement numbers
function p2A_RandomTwoN() {
  // random n1
  var bStr2Com1 = genRndTwoCompl(SIZE);
  // display number
  document.getElementById("p2A_Data1").innerHTML = bStr2Com1;

  // random n2
  var bStr2Com2 = genRndTwoCompl(SIZE);
  // display number
  document.getElementById("p2A_Data2").innerHTML = bStr2Com2;

  // reset other fields
  document.getElementById("p2A_Input").value = ""; // user input
  document.getElementById("p2A_Input_Carry").checked = false; // user carry out of MSB input
  document.getElementById("p2A_Input_Overflow").checked = false; // user overflow input
  document.getElementById("p2A_Result").innerHTML = "-";
  document.getElementById("p2A_Answer").innerHTML = "-";
  document.getElementById("p2A_CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p2A_AnswerBtn").disabled = true; // turn off Answer button
} // end p2A_RandomTwoN

//==================================

function p2A_CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p2A_Input").value.trim();

  var text =""; // result to display

  // The purpose is to decide if the student answer is a valid binary number
  // if not, will get a NaN
  // otherwise the result is valid only if a positve num
  var digit = parseInt(x, 2); // student answer

  if (x.length == 0) {
	text = "Please provide a response.";
  } else if (isNaN(digit)) {
    text = "Incorrect - not a Two's Complement number. Try again.";
  } else if (x.length != SIZE) {
    text = "Incorrect - not " + (+SIZE).toString() + " bits. Try again.";
  } else {
	var bStr2Com1 = document.getElementById("p2A_Data1").innerHTML; // given n1, 2's complement as string
	var bStr2Com2 = document.getElementById("p2A_Data2").innerHTML; // given n2, 2's complement as string

    var bStrAddResultRaw = addTwoCompl(bStr2Com1, bStr2Com2, SIZE); // raw addition result
    var bStrAddResult = bStrAddResultRaw.substr(1, SIZE);
    var carryBit = bStrAddResultRaw.charAt(0);

    var isCarryOut = (carryBit == '1'); // carry out of MSB?
    var isOverflow = false; // assume no overflow

	if ( bStr2Com1.charAt(0) == bStr2Com2.charAt(0) && bStr2Com1.charAt(0) != bStrAddResult.charAt(0) ) {
	  isOverflow = true; // overflow happens in addition when operands have same sign [0]
	                         // but result has a different sign
	}

    var carryInput = document.getElementById("p2A_Input_Carry").checked;
    var overflowInput = document.getElementById("p2A_Input_Overflow").checked;

	if (x == bStrAddResult) {
      if (overflowInput == isOverflow && carryInput == isCarryOut) {
	    text = "Correct!";
	  }
	  else { // wrong overflow/carry input
	    text = "Correct addition result, but ";
	    if (overflowInput != isOverflow) {
	      text += "incorrect overflow result.";
	    }
	    if (carryInput != isCarryOut) {
		  text += "incorrect carry-out-of-MSB result.";
	    }
	  }
    } else {
	  text = "Incorrect addition result. Try again.";
    }

  } // end else

  document.getElementById("p2A_Result").innerHTML = text;
  document.getElementById("p2A_AnswerBtn").disabled = false; // turn on Answer button
} // end p2CheckResult

//==================================

function p2A_ShowAnswer() {
  var bStr2Com1 = document.getElementById("p2A_Data1").innerHTML; // given n1, 2's complement as string
  var bStr2Com2 = document.getElementById("p2A_Data2").innerHTML; // given n2, 2's complement as string

  var bStrAddResultRaw = addTwoCompl(bStr2Com1, bStr2Com2, SIZE); // raw addition result
  var bStrAddResult = bStrAddResultRaw.substr(1, SIZE);
  var carryBit = bStrAddResultRaw.charAt(0);

  var isCarryOut = (carryBit == '1'); // carry out of MSB?
  var isOverflow = false; // assume no overflow

  if ( bStr2Com1.charAt(0) == bStr2Com2.charAt(0) && bStr2Com1.charAt(0) != bStrAddResult.charAt(0) ) {
    isOverflow = true; // overflow happens in addition when operands have same sign [0]
                         // but result has a different sign
  }

  var stepsStr = " Perform bit wise addition, starting from LSB:<br>" +
  "    " + bStr2Com1 + "<br>" +
  "+   " + bStr2Com2 + "<br>" +
  "------------ <br>" + "=" ;
  if (isCarryOut) {
    stepsStr += "(1)" + bStrAddResult + "<br>";
  } else {
    stepsStr += "   " + bStrAddResult + "<br>";
  }

  if (isOverflow) { // overflow, no need to discuss the result
    stepsStr += "<br> -> (Addition) Overflow happened, as the operands have the same sign, but the result has a different sign.";
    stepsStr += "<br> -> The result " + bStrAddResult + " is invalid. Should not be used.";
    stepsStr += " ( " +
        twoComToDec(bStr2Com1, SIZE) + " + " + twoComToDec(bStr2Com2, SIZE) +
        " ? " + twoComToDec(bStrAddResult, SIZE) + " )";
  } else { //no overflow
    if ( bStr2Com1.charAt(0) == bStr2Com2.charAt(0) ) { // result same sign as operands
	  stepsStr += "<br> -> (Addition) No overflow, as the result has the same sign as the operands.";
    } else { // different sign operands
      stepsStr += "<br> -> (Addition) No overflow, as the operands have different signs.";
    }

    if (isCarryOut) {
	  stepsStr += "<br>There is a carry out of MSB, just drop it.";
    }
    stepsStr += "<br>The result is: " + bStrAddResult + " ( " +
        twoComToDec(bStr2Com1, SIZE) + " + " + twoComToDec(bStr2Com2, SIZE) +
        " = " + twoComToDec(bStrAddResult, SIZE) + " )";
  }
  document.getElementById("p2A_Answer").innerHTML = "Answer: " + "<br><pre>Given " +
                               bStr2Com1 + " + " + bStr2Com2 + "<br> ->" + stepsStr + "</pre>";
  document.getElementById("p2A_AnswerBtn").disabled = true; // turn off Answer button
} // end p2A_ShowAnswer

//==================================
// P3 Arith. Subtraction
//==================================

// generate two random 8-bit 2's complement numbers
function p3A_RandomTwoN() {
  // random n1
  var bStr2Com1 = genRndTwoCompl(SIZE);
  // display number
  document.getElementById("p3A_Data1").innerHTML = bStr2Com1;

  // random n2
  var bStr2Com2 = genRndTwoCompl(SIZE);
  // display number
  document.getElementById("p3A_Data2").innerHTML = bStr2Com2;

  // reset other fields
  document.getElementById("p3A_Input").value = ""; // user input
  document.getElementById("p3A_Input_Carry").checked = false; // user carry out of MSB input
  document.getElementById("p3A_Input_Overflow").checked = false; // user overflow input
  document.getElementById("p3A_Result").innerHTML = "-";
  document.getElementById("p3A_Answer").innerHTML = "-";
  document.getElementById("p3A_CheckBtn").disabled = false; // turn on Check button
  document.getElementById("p3A_AnswerBtn").disabled = true; // turn off Answer button
} // end p3A_RandomTwoN

//==================================

function p3A_CheckResult() {
  // Get the value of the input field
  var x = document.getElementById("p3A_Input").value.trim();

  var text ="test"; // result to display

  // The purpose is to decide if the student answer is a valid binary number
  // if not, will get a NaN
  // otherwise the result is valid only if a positve num
  var digit = parseInt(x, 2); // student answer

  if (x.length == 0) {
	text = "Please provide a response.";
  } else if (isNaN(digit)) {
    text = "Incorrect - not a Two's Complement number. Try again.";
  } else if (x.length != SIZE) {
    text = "Incorrect - not " + (+SIZE).toString() + " bits. Try again.";
  } else {
	var bStr2Com1 = document.getElementById("p3A_Data1").innerHTML; // given n1, 2's complement as string
	var bStr2Com2 = document.getElementById("p3A_Data2").innerHTML; // given n2, 2's complement as string

    var bStrSubResultRaw = subTwoCompl(bStr2Com1, bStr2Com2, SIZE); // raw subtraction result
    var bStrSubResult = bStrSubResultRaw.substr(1, SIZE);
    var carryBit = bStrSubResultRaw.charAt(0);

    var isCarryOut = (carryBit == '1'); // carry out of MSB?
    var isOverflow = false; // assume no overflow

	if ( bStr2Com1.charAt(0) != bStr2Com2.charAt(0) && bStr2Com1.charAt(0) != bStrSubResult.charAt(0) ) {
	  isOverflow = true; // overflow happens in subtraction when operands have different signs [0]
	                     // and result has a different sign from n1, minuend
	}

    var carryInput = document.getElementById("p3A_Input_Carry").checked;
    var overflowInput = document.getElementById("p3A_Input_Overflow").checked;

	if (x == bStrSubResult) {
      if (overflowInput == isOverflow && carryInput == isCarryOut) {
	    text = "Correct!";
	  }
	  else { // wrong overflow/carry input
	    text = "Correct subtraction result, but ";
	    if (overflowInput != isOverflow) {
	      text += "incorrect overflow result.";
	    }
	    if (carryInput != isCarryOut) {
		  text += "incorrect carry-out-of-MSB result.";
	    }
	  }
    } else {
	  text = "Incorrect subtraction result. Try again.";
    }

  } // end else

  document.getElementById("p3A_Result").innerHTML = text;
  document.getElementById("p3A_AnswerBtn").disabled = false; // turn on Answer button
} // end p3CheckResult

//==================================

function p3A_ShowAnswer() {
  var bStr2Com1 = document.getElementById("p3A_Data1").innerHTML; // given n1, 2's complement as string
  var bStr2Com2 = document.getElementById("p3A_Data2").innerHTML; // given n2, 2's complement as string

  var bStrSubResultRaw = subTwoCompl(bStr2Com1, bStr2Com2, SIZE); // raw subtraction result
  var bStrSubResult = bStrSubResultRaw.substr(1, SIZE);
  var carryBit = bStrSubResultRaw.charAt(0);

  var isCarryOut = (carryBit == '1'); // carry out of MSB?
  var isOverflow = false; // assume no overflow

  if ( bStr2Com1.charAt(0) != bStr2Com2.charAt(0) && bStr2Com1.charAt(0) != bStrSubResult.charAt(0) ) {
    isOverflow = true; // overflow happens in subtraction when operands have different signs [0]
                       // and result has a different sign from n1, minuend
  }

  var stepsStr = " Perform a - b as a + (-b), starting from LSB:<br>" +
  "    " + bStr2Com1 + "<br>" +
  "-   " + bStr2Com2 + "<br>" +
  "------------ <br>" + "=" +
  "   " + bStr2Com1 + "<br>" +
  "    " + get1Com(bStr2Com2, SIZE) + "<br>" +
  "+          1<br>" +
  "------------ <br>" + "=";
  if (isCarryOut) {
    stepsStr += "(1)" + bStrSubResult + "<br>";
  } else {
    stepsStr += "   " + bStrSubResult + "<br>";
  }

  if (isOverflow) { // overflow, no need to discuss the result
    stepsStr += "<br> -> (Subtraction) Overflow happened, as the operands of subtraction have different signs <br>(operands of addition have the same sign), and the result has a different sign from<br> the 1st operand, minuend.";
    stepsStr += "<br> -> The result " + bStrSubResult + " is invalid. Should not be used.";
    stepsStr += " ( " +
        twoComToDec(bStr2Com1, SIZE) + " - " + twoComToDec(bStr2Com2, SIZE) +
        " ? " + twoComToDec(bStrSubResult, SIZE) + " )";
  } else { //no overflow
    if ( bStr2Com1.charAt(0) != bStr2Com2.charAt(0) ) { // result same sign as 1st operand, minuend
	  stepsStr += "<br> -> (Subtraction) No overflow, as [the operands of subtraction have different signs <br>(operands of addition have the same sign),] the result has the same sign as <br>the first operand.";
    } else { // subtraction operands have same sign (addition operands have different signs)
      stepsStr += "<br> -> (Subtraction) No overflow, as the operands of subtraction have the same sign <br>(operands of addition have different signs).";
    }

    if (isCarryOut) {
	  stepsStr += "<br><br>There is a carry out of MSB, just drop it.";
    }
    stepsStr += "<br> -> The result is: " + bStrSubResult + " ( " +
        twoComToDec(bStr2Com1, SIZE) + " - " + twoComToDec(bStr2Com2, SIZE) +
        " = " + twoComToDec(bStrSubResult, SIZE) + " )";
  }
  document.getElementById("p3A_Answer").innerHTML = "Answer: " + "<br><pre>Given " +
                               bStr2Com1 + " - " + bStr2Com2 + "<br> ->" + stepsStr + "</pre>";
  document.getElementById("p3A_AnswerBtn").disabled = true; // turn off Answer button
} // end p3A_ShowAnswer