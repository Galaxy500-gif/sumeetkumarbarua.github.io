// The MIT License (MIT)// Typed.js | Copyright (c) 2016 Matt Boldt | www.mattboldt.com// Permission is hereby granted, free of charge, to any person obtaining a copy// of this software and associated documentation files (the "Software"), to deal// in the Software without restriction, including without limitation the rights// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell// copies of the Software, and to permit persons to whom the Software is// furnished to do so, subject to the following conditions:// The above copyright notice and this permission notice shall be included in// all copies or substantial portions of the Software.// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN// THE SOFTWARE.! function(window, document, $){"use strict";var Typed=function(el, options){var self=this;// chosen element to manipulate textthis.el=el;// optionsthis.options={};Object.keys(defaults).forEach(function(key){self.options[key]=defaults[key];});Object.keys(options).forEach(function(key){self.options[key]=options[key];});// attribute to type intothis.isInput=this.el.tagName.toLowerCase()==='input';this.attr=this.options.attr;// show cursorthis.showCursor=this.isInput ? false : this.options.showCursor;// text content of elementthis.elContent=this.attr ? this.el.getAttribute(this.attr) : this.el.textContent;// html or plain textthis.contentType=this.options.contentType;// typing speedthis.typeSpeed=this.options.typeSpeed;// add a delay before typing startsthis.startDelay=this.options.startDelay;// backspacing speedthis.backSpeed=this.options.backSpeed;// amount of time to wait before backspacingthis.backDelay=this.options.backDelay;// div containing stringsif($ && this.options.stringsElement instanceof $){this.stringsElement=this.options.stringsElement[0]}else{this.stringsElement=this.options.stringsElement;}// input strings of textthis.strings=this.options.strings;// character number position of current stringthis.strPos=0;// current array positionthis.arrayPos=0;// number to stop backspacing on.// default 0, can change depending on how many chars// you want to remove at the timethis.stopNum=0;// Looping logicthis.loop=this.options.loop;this.loopCount=this.options.loopCount;this.curLoop=0;// for stoppingthis.stop=false;// custom cursorthis.cursorChar=this.options.cursorChar;// shuffle the stringsthis.shuffle=this.options.shuffle;// the order of stringsthis.sequence=[];// All systems go!this.build();};Typed.prototype={constructor: Typed,init: function(){// begin the loop w/ first current string (global self.strings)// current string will be passed as an argument each time after thisvar self=this;self.timeout=setTimeout(function(){for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;// shuffle the array if trueif(self.shuffle) self.sequence=self.shuffleArray(self.sequence);// Start typingself.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);}, self.startDelay);},build: function(){var self=this;// Insert cursorif (this.showCursor===true){this.cursor=document.createElement('span');this.cursor.className='typed-cursor';this.cursor.innerHTML=this.cursorChar;this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);}if (this.stringsElement){this.strings=[];this.stringsElement.style.display='none';var strings=Array.prototype.slice.apply(this.stringsElement.children);strings.forEach(function(stringElement){self.strings.push(stringElement.innerHTML);});}this.init();},// pass current string state to each function, types 1 char per calltypewrite: function(curString, curStrPos){// exit when stoppedif (this.stop===true){return;}// varying values for setTimeout during typing// can't be global since number changes each time loop is executedvar humanize=Math.round(Math.random() * (100 - 30)) + this.typeSpeed;var self=this;// ------------- optional ------------- //// backpaces a certain string faster// ------------------------------------ //// if (self.arrayPos==1){// self.backDelay=50;//}// else{self.backDelay=500;}// contain typing function in a timeout humanize'd delayself.timeout=setTimeout(function(){// check for an escape character before a pause value// format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^// single ^ are removed from stringvar charPause=0;var substr=curString.substr(curStrPos);if (substr.charAt(0)==='^'){var skip=1; // skip atleast 1if (/^\^\d+/.test(substr)){substr=/\d+/.exec(substr)[0];skip +=substr.length;charPause=parseInt(substr);}// strip out the escape character and pause value so they're not printedcurString=curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);}if (self.contentType==='html'){// skip over html tags while typingvar curChar=curString.substr(curStrPos).charAt(0);if (curChar==='<' || curChar==='&'){var tag='';var endTag='';if (curChar==='<'){endTag='>'}else{endTag=';'}while (curString.substr(curStrPos + 1).charAt(0) !==endTag){tag +=curString.substr(curStrPos).charAt(0);curStrPos++;if (curStrPos + 1 > curString.length){break;}}curStrPos++;tag +=endTag;}}// timeout for any pause after a characterself.timeout=setTimeout(function(){if (curStrPos===curString.length){// fires callback functionself.options.onStringTyped(self.arrayPos);// is this the final stringif (self.arrayPos===self.strings.length - 1){// animation that occurs on the last typed stringself.options.callback();self.curLoop++;// quit if we wont loop backif (self.loop===false || self.curLoop===self.loopCount)return;}self.timeout=setTimeout(function(){self.backspace(curString, curStrPos);}, self.backDelay);}else{/* call before functions if applicable */if (curStrPos===0){self.options.preStringTyped(self.arrayPos);}// start typing each new char into existing string// curString: arg, self.el.html: original text inside elementvar nextString=curString.substr(0, curStrPos + 1);if (self.attr){self.el.setAttribute(self.attr, nextString);}else{if (self.isInput){self.el.value=nextString;}else if (self.contentType==='html'){self.el.innerHTML=nextString;}else{self.el.textContent=nextString;}}// add characters one by onecurStrPos++;// loop the functionself.typewrite(curString, curStrPos);}// end of character pause}, charPause);// humanized value for typing}, humanize);},backspace: function(curString, curStrPos){// exit when stoppedif (this.stop===true){return;}// varying values for setTimeout during typing// can't be global since number changes each time loop is executedvar humanize=Math.round(Math.random() * (100 - 30)) + this.backSpeed;var self=this;self.timeout=setTimeout(function(){// ----- this part is optional ----- //// check string array position// on the first string, only delete one word// the stopNum actually represents the amount of chars to// keep in the current string. In my case it's 14.// if (self.arrayPos==1){// self.stopNum=14;//}//every other time, delete the whole typed string// else{// self.stopNum=0;//}if (self.contentType==='html'){// skip over html tags while backspacingif (curString.substr(curStrPos).charAt(0)==='>'){var tag='';while (curString.substr(curStrPos - 1).charAt(0) !=='<'){tag -=curString.substr(curStrPos).charAt(0);curStrPos--;if (curStrPos < 0){break;}}curStrPos--;tag +='<';}}// ----- continue important stuff ----- //// replace text with base text + typed charactersvar nextString=curString.substr(0, curStrPos);if (self.attr){self.el.setAttribute(self.attr, nextString);}else{if (self.isInput){self.el.value=nextString;}else if (self.contentType==='html'){self.el.innerHTML=nextString;}else{self.el.textContent=nextString;}}// if the number (id of character in current string) is// less than the stop number, keep goingif (curStrPos > self.stopNum){// subtract characters one by onecurStrPos--;// loop the functionself.backspace(curString, curStrPos);}// if the stop number has been reached, increase// array position to next stringelse if (curStrPos <=self.stopNum){self.arrayPos++;if (self.arrayPos===self.strings.length){self.arrayPos=0;// Shuffle sequence againif(self.shuffle) self.sequence=self.shuffleArray(self.sequence);self.init();}elseself.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);}// humanized value for typing}, humanize);},/** * Shuffles the numbers in the given array. * @param{Array}array * @returns{Array}*/shuffleArray: function(array){var tmp, current, top=array.length;if(top) while(--top){current=Math.floor(Math.random() * (top + 1));tmp=array[current];array[current]=array[top];array[top]=tmp;}return array;},// Start & Stop currently not working// , stop: function(){// var self=this;// self.stop=true;// clearInterval(self.timeout);//}// , start: function(){// var self=this;// if(self.stop===false)// return;// this.stop=false;// this.init();//}// Reset and rebuild the elementreset: function(){var self=this;clearInterval(self.timeout);var id=this.el.getAttribute('id');this.el.textContent='';if (typeof this.cursor !=='undefined' && typeof this.cursor.parentNode !=='undefined'){this.cursor.parentNode.removeChild(this.cursor);}this.strPos=0;this.arrayPos=0;this.curLoop=0;// Send the callbackthis.options.resetCallback();}};Typed.new=function(selector, option){var elements=Array.prototype.slice.apply(document.querySelectorAll(selector));elements.forEach(function(element){var instance=element._typed, options=typeof option=='object' && option;if (instance){instance.reset();}element._typed=instance=new Typed(element, options);if (typeof option=='string') instance[option]();});};if ($){$.fn.typed=function(option){return this.each(function(){var $this=$(this), data=$this.data('typed'), options=typeof option=='object' && option;if (data){data.reset();}$this.data('typed', (data=new Typed(this, options)));if (typeof option=='string') data[option]();});};}window.Typed=Typed;var defaults={strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],stringsElement: null,// typing speedtypeSpeed: 0,// time before typing startsstartDelay: 0,// backspacing speedbackSpeed: 0,// shuffle the stringsshuffle: false,// time before backspacingbackDelay: 500,// looploop: false,// false=infiniteloopCount: false,// show cursorshowCursor: false,// character for cursorcursorChar: "|",// attribute to type (null==text)attr: null,// either html or textcontentType: 'html',// call when done callback functioncallback: function(){},// starting callback function before each stringpreStringTyped: function(){},//callback for every typed stringonStringTyped: function(){},// callback for resetresetCallback: function(){}};}(window, document, window.jQuery);
