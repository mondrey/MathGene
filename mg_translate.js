/*
    MathGene Translation/Rendering Library - Version 1.30
    Copyright (C) 2018  George J. Paulos

    MathGene is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    MathGene is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//external callable functions
function mgTranslate(expression,scale) { //translate between MG, HTML, and LaTex
    if (typeof expression == "undefined") {return {html:"",latex:"",mg:"",} }
    if (typeof scale == "undefined") {scale = 100}
    var mgFmt = texImport(expression);
    return {
        html:   "<span title='MathGene HTML' style='font-family:"+mgConfig.htmlFont+";font-size:"+scale+"%'>"+htmlExport(mgFmt)+"</span>",
        latex:  texExport(mgFmt),
        mg:     mgFmt,
        log:    calcLog,
        }
}
function mgOutput(expression,scale) { //output MG, HTML, and LaTex from MG without LaTex import
    if (typeof scale == "undefined") {scale = 100}
    return {
        html:   "<span title='MathGene HTML' style='font-family:"+mgConfig.htmlFont+";font-size:"+scale+"%'>"+htmlExport(expression)+"</span>",
        latex:  texExport(expression),
        mg:     expression,
        log:    calcLog,
        }
}

// internal objects
var mgConfig =
{
    trigBase:   1,          //trig base 1=radians. Math.pi/180 for degrees, Math.pi/200 gradians
    divScale:   85,         //default scale factor for x/y division in percent
    divSymbol:  "Over",     //default HTML divide symbol "Slash" or "Over"
    fnFmt: "    fn x",      //function format "fn(x)" or "fn x"
    invFmt:     "asin",     //inverse trig function format "asin" or "sin<sup>-1</sup>"
    cplxFmt:    "Rect",     //complex numbers "Rect" or "Polar"
    pctFactor:  100,        //percent factor 100 for percent, 1 for n.nn decimal
    dPrecision: 16,         //decimal precision
    Domain:     "Complex",  //domain Complex or Real
    editMode:   false,      //edit mode formatting
    htmlFont:   "Times,Serif", //default HTML font-family
    calcLogLevel: 0         //calculation logger level
}
var calcLog = []; //calculation log
var Cv = new Array(11000); //symbol array
var Cs = new Array(11000); //symbol rendering
var Cd = new Array(50); //constant description
var Cu = new Array(50); //constant units

//Initialize constants
Cv[0] = 7.2973525698e-3;    Cu[0]="";               Cs[0]="&#945;";                                         Cd[0]="fine structure const";
Cv[1] = 5.2917721092e-11;   Cu[1]="m";              Cs[1]="&#945;<span style='font-size:50%'>0</span>";     Cd[1]="Bohr radius";
Cv[2] = 2.8977721e-3;       Cu[2]="m&#8226;K";      Cs[2]="<i>b</i>";                                       Cd[2]="Wein displacement const.";
Cv[3] = 299792458;          Cu[3]="m/s";            Cs[3]="<i>c</i>";                                       Cd[3]="speed of light";
Cv[4] = 0.577215664901532;  Cu[4]="";               Cs[4]="&#947;";                                         Cd[4]="Euler–Mascheroni constant";

Cv[5] = 3.74177153e-16;     Cu[5]="W/m&#178;";      Cs[5]="c<span style='font-size:50%'>1</span>";          Cd[5]="1<sup>st</sup> radiation constant";
Cv[6] = 1.4387770e-2;       Cu[6]="m&#8226;K";      Cs[6]="c<span style='font-size:50%'>2</span>";          Cd[6]="2<sup>nd</sup> radiation constant";
Cv[7] = 8.854187817e-12;    Cu[7]="F/m";            Cs[7]="&#949;<span style='font-size:50%'>0</span>";     Cd[7]="vacuum permittivity";
Cv[8] = 2.718281828459045;  Cu[8]="";               Cs[8]="<i>e</i>";                                       Cd[8]="Euler constant";
Cv[9] = 1.602176565e-19;    Cu[9]="J";              Cs[9]="eV";                                             Cd[9]="electron volt";

Cv[10] = 96485.3365;        Cu[10]="C/mol";         Cs[10]="<i>F</i>";                                      Cd[10]="Faraday constant";
Cv[11] = 6.67384e-11;       Cu[11]="m&#179;/kg&#8226;s&#178;";Cs[11]="<i>G</i>";                            Cd[11]="Newton constant";
Cv[12] = 9.80665;           Cu[12]="m/s&#178;";     Cs[12]="g";                                             Cd[12]="Earth gravity accel";
Cv[13] = 7.7480917346e-5;   Cu[13]="s";             Cs[13]="<i>G<span style='font-size:50%'>0</span><i>";   Cd[13]="conductance quantum";
Cv[14] = 6.62606957e-34;    Cu[14]="J&#8226;s";     Cs[14]="<i>h</i>";                                      Cd[14]="Planck constant";

Cv[15] = 1.054571726e-34;   Cu[15]="J&#8226;s";     Cs[15]="<i>&#295;</i>";                                 Cd[15]="<i>h</i>/2&#295;";
Cv[16] = 483597.870e9;      Cu[16]="Hz/V";          Cs[16]="<i>K<span style='font-size:50%'>j</span></i>";  Cd[16]="Josephson constant";
Cv[17] = 1.3806488e-23;     Cu[17]="J/K";           Cs[17]="k";                                             Cd[17]="Boltzmann constant";
Cv[18] = 2.4263102389e-12;  Cu[18]="m";             Cs[18]="&#955;";                                        Cd[18]="Compton wavelength";
Cv[19] = 1.616199e-35;      Cu[19]="m";             Cs[19]="<i>l</i><span style='font-size:50%'>P</span>";  Cd[19]="Planck length";

Cv[20] = 12.566370614e-7;   Cu[20]="N/A&#178;";     Cs[20]="&#956;<span style='font-size:50%'>0</span>";    Cd[20]="vacuum permeability";
Cv[21] = 927.400968e-26;    Cu[21]="J/T";           Cs[21]="&#956;<span style='font-size:50%'>B</span>";    Cd[21]="Bohr magneton";
Cv[22] = 9.10938291e-31;    Cu[22]="kg";            Cs[22]="<i>M<span style='font-size:50%'>e</span></i>";  Cd[22]="electron mass";
Cv[23] = 1.672621777e-27;   Cu[23]="kg";            Cs[23]="<i>M<span style='font-size:50%'>p</span></i>";  Cd[23]="proton mass";
Cv[24] = 1.674927351e-27;   Cu[24]="kg";            Cs[24]="<i>M<span style='font-size:50%'>n</span></i>";  Cd[24]="neutron mass";

Cv[25] = 2.17651e-8;        Cu[25]="kg";            Cs[25]="<i>M<span style='font-size:50%'>P</span></i>";  Cd[25]="Planck mass";
Cv[26] = 1.660538921e-27;   Cu[26]="kg";            Cs[26]="<i>M<span style='font-size:50%'>u</span></i>";  Cd[26]="atomic mass constant";
Cv[27] = 6.02214129e23;     Cu[27]="/mol";          Cs[27]="<i>N<span style='font-size:50%'>a</span></i>";  Cd[27]="Avogadro constant";
Cv[28] = 2.6867805e25;      Cu[28]="m&#179;";       Cs[28]="n<span style='font-size:50%'>0</span>";         Cd[28]="Loschmidt constant";
Cv[29] = 3.141592653589793; Cu[29]="";              Cs[29]="&#960;";                                        Cd[29]="Archimedes constant";

Cv[30] = 6.283185307179586; Cu[30]="";              Cs[30]="2&#960;";                                       Cd[30]="2&times;&#960;";
Cv[31] = 1.61803398874989;  Cu[31]="";              Cs[31]="&#966;";                                        Cd[31]="golden ratio";
Cv[32] = 2.0678346161e-15;  Cu[32]="Wb";            Cs[32]="&#966;<span style='font-size:50%'>0</span>";    Cd[32]="magnetic flux quantum";
Cv[33] = 101325;            Cu[33]="Pa";            Cs[33]="<i>P<span style='font-size:50%'>atm</span></i>";Cd[33]="standard pressure";
Cv[34] = 1.602176566e-19;   Cu[34]="C";             Cs[34]="q<span style='font-size:50%'>e</span>";         Cd[34]="elementary charge";

Cv[35] = 8.3144621;         Cu[35]="J/mol&#8226;K"; Cs[35]="<i>R<span style='font-size:50%'>c</span></i>";  Cd[35]="Universal gas constant";
Cv[36] = 25812.8074434;     Cu[36]="&#937;";        Cs[36]="<i>R<span style='font-size:50%'>k</span></i>";  Cd[36]="von Klitzing constant";
Cv[37] = 10973731.568539;   Cu[37]="/m";            Cs[37]="<i>R<span style='font-size:50%'>&#8734;</span></i>";Cd[37]="Rydberg constant";
Cv[38] = 2.8179403267e-15;  Cu[38]="m";             Cs[38]="r<span style='font-size:50%'>e</span>";         Cd[38]="classical electron radius";
Cv[39] = 5.670373e-8;       Cu[39]="W/m&#178;&#8226;K&#8308;";Cs[39]="&#963;";                              Cd[39]="Stefan-Boltzmann";

Cv[40] = 1.416833e32;       Cu[40]="K";             Cs[40]="<i>T<span style='font-size:50%'>P</span></i>";  Cd[40]="Planck temperature";
Cv[41] = 5.39106e-44;       Cu[41]="s";             Cs[41]="<i>t</i><span style='font-size:50%'>P</span>";  Cd[41]="Planck time";
Cv[42] = 2.241409e-2;       Cu[42]="m&#179;/mol";   Cs[42]="<i>V<span style='font-size:50%'>m</span></i>";  Cd[42]="molar volume";
Cv[43] = 376.730313461;     Cu[43]="&#937;";        Cs[43]="<i>Z<span style='font-size:50%'>0</span></i>";  Cd[43]="vacuum impedance";
Cv[44] = 0;                 Cu[44]="";              Cs[44]="0";                                             Cd[44]="Null";

Cv[45] = {r:1, i:0, s:"!"};             Cs[45]="!";
Cv[46] = {r:0, i:1};                    Cs[46] = "<i>i</i>";
Cv[8230] = 0;
Cv[8734] = "Infinity";

//initialize symbols
var iAl = 0;
for (iAl=47;iAl<10000;iAl++)    {Cs[iAl]="&#"+(iAl)+";"}
for (iAl=58;iAl<=127;iAl++)     {Cs[iAl]=String.fromCharCode(iAl)}//ascii
for (iAl=48;iAl<=57;iAl++)      {Cs[iAl]="<i>"+String.fromCharCode(iAl)+"</i>"}//0-9
for (iAl=65;iAl<=90;iAl++)      {Cs[iAl]="<b>"+String.fromCharCode(iAl)+"</b>"}//A-Z bold
for (iAl=97;iAl<=122;iAl++)     {Cs[iAl]="<b>"+String.fromCharCode(iAl)+"</b>"}//a-z bold
for (iAl=10032;iAl<=10047;iAl++){Cs[iAl]=String.fromCharCode(iAl-10000)}//punc
for (iAl=10065;iAl<=10090;iAl++){Cs[iAl]="<i>"+String.fromCharCode(iAl-10000)+"</i>"}//A-Z italic
for (iAl=10097;iAl<=10122;iAl++){Cs[iAl]="<i>"+String.fromCharCode(iAl-10000)+"</i>"}//a-z italic
for (iAl=10768;iAl<=10879;iAl++){Cs[iAl]="<i>&#"+(iAl-10000)+";</i>"}//italic accents
Cs[11100]="<i>C</i>";//constants of integration
for (iAl=11101;iAl<=11110;iAl++) {Cs[iAl]="<i>C<sub>"+(iAl-11100)+"</sub></i>"}//constants of integration
Cv[10047] = {s:"/"}; //slash
Cv[247] = {s:"&divide;"}; //quotient
Cs[59] = "; ";
Cs[10013] = "<br>"; //line break
Cs[10044] = ", ";
Cs[60] = " &lt; ";
Cs[61] = " = ";
Cs[62] = " &gt; ";
Cs[8800] = " &#8800; "; //not equal
Cs[8804] = " &#8804; "; //less than or equal
Cs[8805] = " &#8805; "; //greater than or equal
Cs[8773] = " &#8773; "; //congruent
Cs[8747] = "<Xdiv><span style='display:inline-block;'><span style='vertical-align:middle;display:inline-table;'><span style='display:table-row;line-height:90%'>&#8992;</span><span style='display:table-row;line-height:90%'>&#8993;</span></span></span><Xdve>"; //integral
Cs[8748] = " <i>d</i>";//differential
Cs[8750] = "<Xdiv><span style='display:inline-block;'><span style='vertical-align:middle;font-size:200%'>&#8750;</span></span><Xdve>";
Cs[8751] = "<Xdiv><span style='display:inline-block;'><span style='vertical-align:middle;font-size:200%'>&#8751;</span></span><Xdve>";
Cs[8752] = "<Xdiv><span style='display:inline-block;'><span style='vertical-align:middle;font-size:200%'>&#8752;</span></span><Xdve>";
Cs[8592] = " &#8592; ";
Cs[8594] = " &#8594; ";
Cs[9998] = "<span style='color:#880000'>Error</span>";

//HTML/LaTex Translation map for functions
var funcMap =
{
sin:{   htmlL1:"'<Xfnc>sin<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>sin<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"asn",
        texfunc:"\\sin",
        latexL1:"'\\\\sin(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\sin<Xfxp> {'",
        latexR2:"'}'",
        mg: "'sin('+mA+')'",
        },
cos:{   htmlL1:"'<Xfnc>cos<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>cos<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"acs",
        texfunc:"\\cos",
        latexL1:"'\\\\cos(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\cos<Xfxp> {'",
        latexR2:"'}'",
        mg: "'cos('+mA+')'",
        },
tan:{   htmlL1:"'<Xfnc>tan<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>tan<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"atn",
        texfunc:"\\tan",
        latexL1:"'\\\\tan(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\tan<Xfxp> {'",
        latexR2:"'}'",
        mg: "'tan('+mA+')'",
        },
sec:{   htmlL1:"'<Xfnc>sec<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>sec<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"asc",
        texfunc:"\\sec",
        latexL1:"'\\\\sec(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\sec<Xfxp> {'",
        latexR2:"'}'",
        mg: "'sec('+mA+')'",
        },
csc:{   htmlL1:"'<Xfnc>csc<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>csc<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"acc",
        texfunc:"\\csc",
        latexL1:"'\\\\csc(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\csc<Xfxp> {'",
        latexR2:"'}'",
        mg: "'csc('+mA+')'",
        },
cot:{   htmlL1:"'<Xfnc>cot<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>cot<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"act",
        texfunc:"\\cot",
        latexL1:"'\\\\cot(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\cot<Xfxp> {'",
        latexR2:"'}'",
        mg: "'cot('+mA+')'",
        },
snh:{   htmlL1:"'<Xfnc>sinh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>sinh<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"ash",
        texfunc:"\\sinh",
        latexL1:"'\\\\sinh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\sinh<Xfxp> {'",
        latexR2:"'}'",
        mg: "'snh('+mA+')'",
        },
csh:{   htmlL1:"'<Xfnc>cosh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>cosh<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"ach",
        texfunc:"\\cosh",
        latexL1:"'\\\\cosh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\cosh<Xfxp> {'",
        latexR2:"'}'",
        mg: "'csh('+mA+')'",
        },
"tnh":{ htmlL1:"'<Xfnc>tanh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>tanh<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"ath",
        texfunc:"\\tanh",
        latexL1:"'\\\\tanh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\tanh<Xfxp> {'",
        latexR2:"'}'",
        mg: "'tnh('+mA+')'",
        },
sch:{   htmlL1:"'<Xfnc>sech<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>sech<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"axh",
        texfunc:"\\sech",
        latexL1:"'\\\\sech(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\sech<Xfxp> {'",
        latexR2:"'}'",
        mg: "'sch('+mA+')'",
        },
cch:{   htmlL1:"'<Xfnc>csch<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>csch<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"ayh",
        texfunc:"\\csch",
        latexL1:"'\\\\csch(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\csch<Xfxp> {'",
        latexR2:"'}'",
        mg: "'cch('+mA+')'",
        },
cth:{   htmlL1:"'<Xfnc>coth<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>coth<Xfxp> '",
        htmlR2:"' '",
        trig:true,
        invfunc:"azh",
        texfunc:"\\coth",
        latexL1:"'\\\\coth(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\coth<Xfxp> {'",
        latexR2:"'}'",
        mg: "'cth('+mA+')'",
        },
asn:{   htmlL1:"'<Xfnc>asin<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>asin '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>sin<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>sin<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arcsin",
        latexL1:"'\\\\arcsin(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arcsin {'",
        latexR2:"'}'",
        latexInv1:"'\\\\sin^{-1}(<Xfnx>'",
        latexInv2:"'\\\\sin^{-1} {'",
        mg: "'asn('+mA+')'",
        },
acs:{   htmlL1:"'<Xfnc>acos<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acos '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>cos<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>cos<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccos",
        latexL1:"'\\\\arccos(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccos {'",
        latexR2:"'}'",
        latexInv1:"'\\\\cos^{-1}(<Xfnx>'",
        latexInv2:"'\\\\cos^{-1} {'",
        mg: "'acs('+mA+')'",
        },
atn:{   htmlL1:"'<Xfnc>atan<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>atan '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>tan<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>tan<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arctan",
        latexL1:"'\\\\arctan(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arctan {'",
        latexR2:"'}'",
        latexInv1:"'\\\\tan^{-1}(<Xfnx>'",
        latexInv2:"'\\\\tan^{-1} {'",
        mg: "'atn('+mA+')'",
        },
asc:{   htmlL1:"'<Xfnc>asec<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>asec '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>sec<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>sec<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arcsec",
        latexL1:"'\\\\arcsec(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arcsec {'",
        latexR2:"'}'",
        latexInv1:"'\\\\sec^{-1}(<Xfnx>'",
        latexInv2:"'\\\\sec^{-1} {'",
        mg: "'asc('+mA+')'",
        },
acc:{   htmlL1:"'<Xfnc>acsc<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acsc '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>csc<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>csc<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccsc",
        latexL1:"'\\\\arccsc(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccsc {'",
        latexR2:"'}'",
        latexInv1:"'\\\\csc^{-1}(<Xfnx>'",
        latexInv2:"'\\\\csc^{-1} {'",
        mg: "'acc('+mA+')'",
        },
act:{   htmlL1:"'<Xfnc>acot<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acot '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>cot<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>cot<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccot",
        latexL1:"'\\\\arccot(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccot {'",
        latexR2:"'}'",
        latexInv1:"'\\\\cot^{-1}(<Xfnx>'",
        latexInv2:"'\\\\cot^{-1} {'",
        mg: "'act('+mA+')'",
        },
ash:{   htmlL1:"'<Xfnc>asinh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>asinh '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>sinh<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>sinh<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arcsinh",
        latexL1:"'\\\\arcsinh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arcsinh {'",
        latexR2:"'}'",
        latexInv1:"'\\\\sinh^{-1}(<Xfnx>'",
        latexInv2:"'\\\\sinh^{-1} {'",
        mg: "'ash('+mA+')'",
        },
ach:{   htmlL1:"'<Xfnc>acosh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acosh '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>cosh<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>cosh<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccosh",
        latexL1:"'\\\\arccosh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccosh {'",
        latexR2:"'}'",
        latexInv1:"'\\\\cosh^{-1}(<Xfnx>'",
        latexInv2:"'\\\\cosh^{-1} {'",
        mg: "'ach('+mA+')'",
        },
ath:{   htmlL1:"'<Xfnc>atanh<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>atanh '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>tanh<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>tanh<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arctanh",
        latexL1:"'\\\\arctanh(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arctanh {'",
        latexR2:"'}'",
        latexInv1:"'\\\\tanh^{-1}(<Xfnx>'",
        latexInv2:"'\\\\tanh^{-1} {'",
        mg: "'ath('+mA+')'",
        },
axh:{   htmlL1:"'<Xfnc>asech<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>asech '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>sech<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>sech<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arcsech",
        latexL1:"'\\\\arcsech(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arcsech {'",
        latexR2:"'}'",
        latexInv1:"'\\\\sech^{-1}(<Xfnx>'",
        latexInv2:"'\\\\sech^{-1} {'",
        mg: "'axh('+mA+')'",
        },
ayh:{   htmlL1:"'<Xfnc>acsch<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acsch '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>csch<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>csch<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccsch",
        latexL1:"'\\\\arccsch(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccsch {'",
        latexR2:"'}'",
        latexInv1:"'\\\\csch^{-1}(<Xfnx>'",
        latexInv2:"'\\\\csch^{-1} {'",
        mg: "'ayh('+mA+')'",
        },
azh:{   htmlL1:"'<Xfnc>acoth<Xfnx>('",
        htmlR1:"')'",
        htmlL2:"'<Xfnc>acoth '",
        htmlR2:"' <Xfxp>'",
        htmlInv1:"'<Xfnc>coth<sup>-1</sup><Xfnx>('",
        htmlInv2:"'<Xfnc>coth<sup>-1</sup> <Xfnx>'",
        texfunc:"\\arccoth",
        latexL1:"'\\\\arccoth(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arccoth {'",
        latexR2:"'}'",
        latexInv1:"'\\\\coth^{-1}(<Xfnx>'",
        latexInv2:"'\\\\coth^{-1} {'",
        mg: "'azh('+mA+')'",
        },
sqt:{   htmlL1:"radL(0,strg)", //square root
        htmlR1:"radR()",
        htmlL2:"radL(0,strg)",
        htmlR2:"radR()",
        texfunc:"\\sqrt",
        latexL1:"'\\\\sqrt{'",
        latexR1:"'}'",
        latexL2:"'\\\\sqrt{'",
        latexR2:"'}'",
        mg: "'sqt('+mA+')'",
        },
cbt:{   htmlL1:"radL(1,strg)",   //cube root
        htmlR1:"radR()",
        htmlL2:"radL(1,strg)",
        htmlR2:"radR()",
        texfunc:"\\sqrt[3]",
        latexL1:"'\\\\sqrt[3]{'",
        latexR1:"'}'",
        latexL2:"'\\\\sqrt[3]{'",
        latexR2:"'}'",
        mg: "'cbt('+mA+')'",
        },
nrt:{   htmlL1:"radL(2,strg,mA)",  //nth root
        htmlR1:"radR()",
        htmlL2:"radL(2,strg,mA)",
        htmlR2:"radR()",
        texfunc:"\\sqrt[]",
        latexL1:"'\\\\sqrt['+mA+']{'",
        latexR1:"'}'",
        latexL2:"'\\\\sqrt['+mA+']{'",
        latexR2:"'}'",
        mg: "'nrt('+mA+','+mB+')'",
        },
lgn:{   htmlL1:"'<Xfnc>log<sub>'+mA+'</sub><Xfnx>('", //nth log
        htmlR1:"')'",
        htmlL2:"'<Xfnc>log<sub>'+mA+'</sub> '",
        htmlR2:"' <Xfxp>'",
        texfunc:"\\log_",
        latexL1:"'\\\\log_{'+mA+'}(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\log_{'+mA+'}{'",
        latexR2:"'}<Xfxp>'",
        mg: "'lgn('+mA+','+mB+')'",
        },
log:{   htmlL1:"'<Xfnc>log<Xfnx>('", //natural log
        htmlR1:"')'",
        htmlL2:"'<Xfnc>log '",
        htmlR2:"' <Xfxp>'",
        texfunc:"\\log",
        latexL1:"'\\\\log(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\log {'",
        latexR2:"'}<Xfxp>'",
        mg: "'log('+mA+')'",
        },
lne:{   htmlL1:"'<Xfnc>ln<Xfnx>('", //natural log
        htmlR1:"')'",
        htmlL2:"'<Xfnc>ln '",
        htmlR2:"' <Xfxp>'",
        texfunc:"\\ln",
        latexL1:"'\\\\ln(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\ln {'",
        latexR2:"'}<Xfxp>'",
        mg: "'lne('+mA+')'",
        },
int:{   htmlL1:"brkt('&#8970;',strg)",
        htmlR1:"brkt('&#8971;',strg)", //integer component
        htmlL2:"brkt('&#8970;',strg)",
        htmlR2:"brkt('&#8971;',strg)",
        texfunc:"\\lfloor",
        latexL1:"'\\\\left\\\\lfloor '",
        latexR1:"'\\\\right\\\\rfloor '",
        latexL2:"'\\\\left\\\\lfloor '",
        latexR2:"'\\\\right\\\\rfloor '",
        mg: "'int('+mA+')'",
        },
cei:{   htmlL1:"brkt('&#8968;',strg)",  //ceiling
        htmlR1:"brkt('&#8969;',strg)",
        htmlL2:"brkt('&#8968;',strg)",
        htmlR2:"brkt('&#8969;',strg)",
        texfunc:"\\XXX",
        latexL1:"'\\\\left\\\\lceil '",
        latexR1:"'\\\\right\\\\rceil '",
        latexL2:"'\\\\left\\\\lceil '",
        latexR2:"'\\\\right\\\\rceil '",
        mg: "'cei('+mA+')'",
        },
abs:{   htmlL1:"brkt('&#124;',strg)", //absolute value
        htmlR1:"brkt('&#124;',strg)",
        htmlL2:"brkt('&#124;',strg)",
        htmlR2:"brkt('&#124;',strg)",
        texfunc:"\\|",
        latexL1:"'\\\\left|'",
        latexR1:"'\\\\right|'",
        latexL2:"'\\\\left|'",
        latexR2:"'\\\\right|'",
        mg: "'abs('+mA+')'",
        },
erf:{   htmlL1:"'<Xfnc>erf<Xfnx>('", //error function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>erf<Xfnx>('",
        htmlR2:"')<Xfxp>'",
        texfunc:"\\erf",
        latexL1:"'\\\\erf('",
        latexR1:"')'",
        latexL2:"'\\\\erf('",
        latexR2:"')<Xfxp>'",
        mg: "'erf('+mA+')'",
        },
efc:{   htmlL1:"'<Xfnc>erfc<Xfnx>('",  //inverse error function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>erfc<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\erfc",
        latexL1:"'\\\\erfc('",
        latexR1:"')'",
        latexL2:"'\\\\erfc('",
        latexR2:"')'",
        mg: "'efc('+mA+')'",
        },
arg:{   htmlL1:"'<Xfnc>arg<Xfnx>('",  //arg
        htmlR1:"')'",
        htmlL2:"'<Xfnc>arg<Xfnx>('",
        htmlR2:"')<Xfxp>'",
        texfunc:"\\arg",
        latexL1:"'\\\\arg(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\arg {'",
        latexR2:"'}<Xfxp>'",
        mg: "'arg('+mA+')'",
        },
exp:{   htmlL1:"'<Xfnc>exp<Xfnx>('", //e^x
        htmlR1:"')'",
        htmlL2:"'<Xfnc>exp<Xfnx>('",
        htmlR2:"')<Xfxp>'",
        texfunc:"\\exp",
        latexL1:"'\\\\exp(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\exp {'",
        latexR2:"'}<Xfxp>'",
        mg: "'exp('+mA+')'",
        },
con:{   htmlL1:"conL()",   //conjugate
        htmlR1:"'</span>'",
        htmlL2:"conL()",
        htmlR2:"'</span>'",
        texfunc:"\\overline",
        latexL1:"'\\\\overline{'",
        latexR1:"'}'",
        latexL2:"'\\\\overline{'",
        latexR2:"'}'",
        mg: "'con('+mA+')'",
        },
gam:{   htmlL1:"'<Xfnc>&#915;<Xfnx>('",  //gamma
        htmlR1:"')'",
        htmlL2:"'<Xfnc>&#915;<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\Gamma(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\Gamma(<Xfnx>'",
        latexR2:"')'",
        mg: "'gam('+mA+')'",
        },
cdf:{   htmlL1:"'<Xfnc>&#934;<Xfnx>('",  //cumulative density function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>&#934;<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\Phi(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\Phi(<Xfnx>'",
        latexR2:"')'",
        mg: "'cdf('+mA+')'",
        },
pdf:{   htmlL1:"'<Xfnc>&#966;<Xfnx>('",  //probability density function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>&#966;<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\phi(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\phi(<Xfnx>'",
        latexR2:"')'",
        mg: "'pdf('+mA+')'",
        },
lcf:{   htmlL1:"'<Xfnc>&#934;<sub><i>ln</i></sub><Xfnx>('", //log cumulative density function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>&#934;<sub><i>ln</i></sub><Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\Phi_ln(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\Phi_ln(<Xfnx>'",
        latexR2:"')'",
        mg: "'lcf('+mA+')'",
        },
lpf:{   htmlL1:"'<Xfnc>&#966;<sub><i>ln</i></sub><Xfnx>('", //log probability density function
        htmlR1:"')'",
        htmlL2:"'<Xfnc>&#966;<sub><i>ln</i></sub><Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\phi_ln(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\phi_ln(<Xfnx>'",
        latexR2:"')'",
        mg: "'lpf('+mA+')'",
        },
rou:{   htmlL1:"'<Xfnc>rou<Xfnx>('",  //round to nearest int
        htmlR1:"')'",
        htmlL2:"'<Xfnc>rou<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\rou(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\rou(<Xfnx>'",
        latexR2:"')'",
        mg: "'rou('+mA+')'",
        },
rnd:{   htmlL1:"'<Xfnc>rnd<Xfnx>('",  //random number
        htmlR1:"')'",
        htmlL2:"'<Xfnc>rnd<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\rnd(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\rnd(<Xfnx>'",
        latexR2:"')'",
        mg: "'rnd('+mA+')'",
        },
rex:{   htmlL1:"'<Xfnc>Re<Xfnx>('",  //real component
        htmlR1:"')'",
        htmlL2:"'<Xfnc>Re<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\Re(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\Re(<Xfnx>'",
        latexR2:"'}'",
        mg: "'rex('+mA+')'",
        },
imx:{   htmlL1:"'<Xfnc>Im<Xfnx>('",  //imaginary component
        htmlR1:"')'",
        htmlL2:"'<Xfnc>Im<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\Im(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\Im(<Xfnx>'",
        latexR2:"')'",
        mg: "'imx('+mA+')'",
        },
frc:{   htmlL1:"'<Xfnc>frac<Xfnx>('",  //decimal component
        htmlR1:"')'",
        htmlL2:"'<Xfnc>frac<Xfnx>('",
        htmlR2:"')'",
        texfunc:"\\XXX",
        latexL1:"'\\\\frc(<Xfnx>'",
        latexR1:"')'",
        latexL2:"'\\\\frc(<Xfnx>'",
        latexR2:"')'",
        mg: "'frc('+mA+')'",
        },
sbr:{   htmlL1:"brkt('&#91;',strg)",  //straight bracket
        htmlR1:"brkt('&#93;',strg)",
        htmlL2:"brkt('&#91;',strg)",
        htmlR2:"brkt('&#93;',strg)",
        texfunc:"\\XXX",
        latexL1:"'\\\\left\\['",
        latexR1:"'\\\\right\\]'",
        latexL2:"'\\\\left\\['",
        latexR2:"'\\\\right\\]'",
        mg: "'sbr('+mA+')'",
        },
cbr:{   htmlL1:"brkt('&#123;',strg)",  //curly bracket
        htmlR1:"brkt('&#125;',strg)",
        htmlL2:"brkt('&#123;',strg)",
        htmlR2:"brkt('&#125;',strg)",
        texfunc:"\\XXX",
        latexL1:"'\\\\left\\\\{'",
        latexR1:"'\\\\right\\\\}'",
        latexL2:"'\\\\left\\\\{'",
        latexR2:"'\\\\right\\\\}'",
        mg: "'cbr('+mA+')'",
        },
fac:{   htmlL1:"''",   //factorial
        htmlR1:"'!'",
        htmlL2:"''",
        htmlR2:"'!'",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"'!'",
        latexL2:"''",
        latexR2:"'!'",
        mg: "facE(mA)",
        },
sum:{   htmlL1:"overUnder(mA,mB,'&#8721;',125)", //summation
        htmlR1:"' '",
        htmlL2:"overUnder(mA,mB,'&#8721;',125)",
        htmlR2:"' '",
        texfunc:"\\XXX",
        latexL1:"'\\\\sum_{'+mB+'}^{'+mA+'}'",
        latexR1:"' '",
        latexL2:"'\\\\sum_{'+mB+'}^{'+mA+'}'",
        latexR2:"' '",
        mg: "'sum('+mA+','+mB+')'",
        },
smm:{   htmlL1:"''", //summation from FUNC
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "'sum('+mB+','+mC+'Cv[61]'+mD+')'+mA",
        },
prd:{   htmlL1:"overUnder(mA,mB,'&#8719;',125)",  //product
        htmlR1:"' '",
        htmlL2:"overUnder(mA,mB,'&#8719;',125)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'\\\\prod_{'+mB+'}^{'+mA+'}'",
        latexR1:"' '",
        latexL2:"'\\\\prod_{'+mB+'}^{'+mA+'}'",
        latexR2:"' '",
        mg: "'prd('+mA+','+mB+')'",
        },
pmm:{   htmlL1:"''", //product from FUNC
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "'prd('+mB+','+mC+'Cv[61]'+mD+')'+mA",
        },
lim:{   htmlL1:"limL(mA,mB)",  //limit
        htmlR1:"' '",
        htmlL2:"limL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'\\\\lim_{'+mA+' \\\\to '+mB+'}'",
        latexR1:"' '",
        latexL2:"'\\\\lim_{'+mA+' \\\\to '+mB+'}'",
        latexR2:"' '",
        mg: "'lim('+mA+','+mB+')'",
        },
lmt:{   htmlL1:"''",  //limit from FUNC
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "'lim('+mB+','+mC+')'+mA",
        },
itg:{   htmlL1:"itgL(mA,mB)", //definite integral
        htmlR1:"' '",
        htmlL2:"itgL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'\\\\int_{'+mB+'}^{'+mA+'}'",
        latexR1:"' '",
        latexL2:"'\\\\int_{'+mB+'}^{'+mA+'}'",
        latexR2:"' '",
        mg: "'itg('+mA+','+mB+')'",
        },
drv:{   htmlL1:"''",  //partial derivative from func
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "drvE(mA,mB,mC)",
        },
tdv:{   htmlL1:"''", //total derivative from func
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "tdvE(mA,mB,mC)",
        },
tdr:{   htmlL1:"tdrL(mA,mB)",  //derivative
        htmlR1:"''",
        htmlL2:"tdrL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"tdrX(mA,mB)",
        latexR1:"''",
        latexL2:"tdrX(mA,mB)",
        latexR2:"''",
        mg: "tdrE(mA,mB)",
        },
sdr:{   htmlL1:"sdrL(mA,mB,mC)",  //derivative dy/dx
        htmlR1:"''",
        htmlL2:"sdrL(mA,mB,mC)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"sdrX(mA,mB,mC)",
        latexR1:"''",
        latexL2:"sdrX(mA,mB,mC)",
        latexR2:"''",
        mg: "'sdr('+mA+','+mB+')'"
        },
idr:{   htmlL1:"idrL(mA,mB)",  //partial derivative
        htmlR1:"''",
        htmlL2:"idrL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"idrX(mA,mB)",
        latexR1:"''",
        latexL2:"idrX(mA,mB)",
        latexR2:"''",
        mg: "idrE(mA,mB)",
        },
psd:{   htmlL1:"psdL(mA,mB,mC)",
        htmlR1:"' '", //partial derivative dy/dx
        htmlL2:"psdL(mA,mB,mC)",
        htmlR2:"' '",
        texfunc:"\\XXX",
        latexL1:"psdX(mA,mB,mC)",
        latexR1:"''",
        latexL2:"psdX(mA,mB,mC)",
        latexR2:"''",
        mg: "'psd('+mA+','+mB+')'",
        },
sbt:{   htmlL1:"'<sub><sub>'+mA+'</sub></sub>'" ,  //subscript
        htmlR1:"''",
        htmlL2:"'<sub><sub>'+mA+'</sub></sub>'",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'_{'+mA+'}'",
        latexR1:"''",
        latexL2:"'_{'+mA+'}'",
        latexR2:"''",
        mg: "'sbt('+mA+')'",
        },
cup:{   htmlL1:"overUnder(mA,mB,'&#8746;',150)", //cup
        htmlR1:"''",
        htmlL2:"overUnder(mA,mB,'&#8746;',150)",
        htmlR2:"' '",
        texfunc:"\\XXX",
        latexL1:"'\\\\cup_{'+mB+'}^{'+mA+'}'",
        latexR1:"''",
        latexL2:"'\\\\cup_{'+mB+'}^{'+mA+'}'",
        latexR2:"''",
        mg: "'cup('+mA+','+mB+')'",
        },
cap:{   htmlL1:"overUnder(mA,mB,'&#8745;',150)",  //cap
        htmlR1:"''",
        htmlL2:"overUnder(mA,mB,'&#8745;',150)",
        htmlR2:"' '",
        texfunc:"\\XXX",
        latexL1:"'\\\\cap_{'+mB+'}^{'+mA+'}'",
        latexR1:"''",
        latexL2:"'\\\\cap_{'+mB+'}^{'+mA+'}'",
        latexR2:"''",
        mg: "'cap('+mA+','+mB+')'",
        },
vec:{   htmlL1:"vecL()",   //vector
        htmlR1:"vecR()",
        htmlL2:"vecL()",
        htmlR2:"vecR()",
        texfunc:"\\vec",
        latexL1:"'\\\\vec{'",
        latexR1:"'}'",
        latexL2:"'\\\\vec{'",
        latexR2:"'}'",
        mg: "'vec('+mA+')'",
        },
hat:{   htmlL1:"hatL()", //hat
        htmlR1:"hatR()",
        htmlL2:"hatL()",
        htmlR2:"hatR()",
        texfunc:"\\hat",
        latexL1:"'\\\\hat{'",
        latexR1:"'}'",
        latexL2:"'\\\\hat{'",
        latexR2:"'}'",
        mg: "'hat('+mA+')'",
        },
und:{   htmlL1:"undL()",
        htmlR1:"'</span>'", //underline
        htmlL2:"undL()",
        htmlR2:"'</span>'",
        texfunc:"\\underline",
        latexL1:"'\\\\underline{'",
        latexR1:"'}'",
        latexL2:"'\\\\underline{'",
        latexR2:"'}'",
        mg: "'und('+mA+')'",
        },
udt:{   htmlL1:"udtL()",
        htmlR1:"udtR()",
        htmlL2:"udtL()",
        htmlR2:"udtR()",
        texfunc:"\\dot",
        latexL1:"'\\\\dot{'",
        latexR1:"'}'",
        latexL2:"'\\\\dot{'",
        latexR2:"'}'",
        mg: "'udt('+mA+')'",
        },
tld:{   htmlL1:"tldL()",   //tilde
        htmlR1:"tldR()",
        htmlL2:"tldL()",
        htmlR2:"tldR()",
        texfunc:"\\tilde",
        latexL1:"'\\\\tilde{'",
        latexR1:"''",
        latexL2:"'\\\\tilde{'",
        latexR2:"''",
        mg: "'tld('+mA+')'",
        },
cnt:{   htmlL1:"''",  //container
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "mA",
        },
dif:{   htmlL1:"'<i>d</i>'",  //differential
        htmlR1:"''",
        htmlL2:"'<i>d</i>'",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "'Cv[8748]'+mA",
        },
mat:{   htmlL1:"matL(parm)", //matrix
        htmlR1:"''",
        htmlL2:"matL(parm)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"matX(parm)",
        latexR1:"''",
        latexL2:"matX(parm)",
        latexR2:"''",
        mg: "matE(parm)",
        },
det:{   htmlL1:"'det'",  //matrix determinant
        htmlR1:"''",
        htmlL2:"'det'",
        htmlR2:"''",
        texfunc:"\\det",
        latexL1:"'\\\\det{'",
        latexR1:"'}'",
        latexL2:"'\\\\det{'",
        latexR2:"'}'",
        mg: "'det('+mA+')'",
        },
trc:{   htmlL1:"'tr'",  //matrix trace
        htmlR1:"''",
        htmlL2:"'tr'",
        htmlR2:"''",
        texfunc:"\\tr",
        latexL1:"'\\\\tr{'",
        latexR1:"'}'",
        latexL2:"'\\\\tr{'",
        latexR2:"'}'",
        mg: "'trc('+mA+')'",
        },
cAdd:{  htmlL1:"mA+'+'+mB", //add
        htmlR1:"''",
        htmlL2:"mA+'+'+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'+'+mB",
        latexR1:"''",
        latexL2:"mA+'+'+mB",
        latexR2:"''",
        mg: "mA+'+'+mB",
        },
cSub:{  htmlL1:"mA+'&minus;'+mB",  //subtract
        htmlR1:"''",
        htmlL2:"mA+'&minus;'+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'-'+mB",
        latexR1:"''",
        latexL2:"mA+'-'+mB",
        latexR2:"''",
        mg: "cSubE(mA,mB)",
        },
cTms:{  htmlL1:"mA+'&times;'+mB",  //multiply by x
        htmlR1:"''",
        htmlL2:"mA+'&times;'+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'\\\\times '+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\times '+mB",
        latexR2:"''",
        mg: "mA+'*'+mB",
        },
cDot:{  htmlL1:"mA+'&#8226;'+mB",  //multiply by dot
        htmlR1:"''",
        htmlL2:"mA+'&#8226;'+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'\\\\cdot '+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\cdot '+mB",
        latexR2:"''",
        mg: "mA+'Cv[8226]'+mB",
        },
cMul:{  htmlL1:"cMulL(mA,mB)",  //multiply
        htmlR1:"''",
        htmlL2:"cMulL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+' '+mB",
        latexR1:"''",
        latexL2:"mA+' '+mB",
        latexR2:"''",
        mg: "cMulE(mA,mB)",
        },
cDiv:{  htmlL1:"cDivL(mA,mB)", //divide
        htmlR1:"''",
        htmlL2:"cDivL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'<Xdiv>\\\\frac{'+oBrackets(mA)+'}{'+oBrackets(mB)+'}<Xdve>'",
        latexR1:"''",
        latexL2:"'<Xdiv>\\\\frac{'+oBrackets(mA)+'}{'+oBrackets(mB)+'}<Xdve>'",
        latexR2:"''",
        mg: "cDivE(mA,mB)",
        },
cPow:{  htmlL1:"cPowL(mA,mB)",  //x^n
        htmlR1:"''",
        htmlL2:"cPowL(mA,mB)",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'^{'+oBrackets(mB)+'}'",
        latexR1:"''",
        latexL2:"cPowX(mA,mB)",
        latexR2:"''",
        mg: "cPowE(mA,mB)",
        },
cNeg:{  htmlL1:"'&minus;'+mA", //negative
        htmlR1:"''",
        htmlL2:"'&minus;'+mA",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"'-'+mA",
        latexR1:"''",
        latexL2:"'-'+mA",
        latexR2:"''",
        mg: "cNegE(mA)",
        },
cAng:{  htmlL1:"mA+'&#8736;'+mB",  //angle (polar form)
        htmlR1:"''",
        htmlL2:"mA+'&#8736;'+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'\\\\angle '+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\angle '+mB",
        latexR2:"''",
        mg: "mA+'~'+mB",
        },
cBnd:{  htmlL1:"mA+''+mB",  //bind function
        htmlR1:"''",
        htmlL2:"mA+''+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+' '+mB",
        latexR1:"''",
        latexL2:"mA+' '+mB",
        latexR2:"''",
        mg: "mA+''+mB",
        },
cEql:{  htmlL1:"mA+' = '+mB",  //equal
        htmlR1:"''",
        htmlL2:"mA+' = '+mB",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"mA+'='+mB",
        latexR1:"''",
        latexL2:"mA+'='+mB",
        latexR2:"''",
        mg: "mA+'='+mB",
        },
cGth:{  htmlL1:"mA+' &gt; '+mB",  //greater than
        htmlR1:"''",
        htmlL2:"mA+' &gt; '+mB",
        htmlR2:"''",
        texfunc:">",
        latexL1:"mA+'>'+mB",
        latexR1:"''",
        latexL2:"mA+'>'+mB",
        latexR2:"''",
        mg: "mA+'Cv[62]'+mB",
        },
cLth:{  htmlL1:"mA+' &lt; '+mB",  //less than
        htmlR1:"''",
        htmlL2:"mA+' &lt; '+mB",
        htmlR2:"''",
        texfunc:"<",
        latexL1:"mA+'<'+mB",
        latexR1:"''",
        latexL2:"mA+'<'+mB",
        latexR2:"''",
        mg: "mA+'Cv[60]'+mB",
        },
cGeq:{  htmlL1:"mA+' &#8805; '+mB", //greater than or equal
        htmlR1:"''",
        htmlL2:"mA+' &#8805; '+mB",
        htmlR2:"''",
        texfunc:"\\geq",
        latexL1:"mA+'\\\\geq'+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\geq'+mB",
        latexR2:"''",
        mg: "mA+'Cv[8805]'+mB",
        },
cLeq:{  htmlL1:"mA+' &#8804; '+mB", //less than or equal
        htmlR1:"''",
        htmlL2:"mA+' &#8804; '+mB",
        htmlR2:"''",
        texfunc:"\\leq",
        latexL1:"mA+'\\\\leq'+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\leq'+mB",
        latexR2:"''",
        mg: "mA+'Cv[8804]'+mB",
        },
cNql:{  htmlL1:"mA+' &#8800; '+mB", //not equal
        htmlR1:"''",
        htmlL2:"mA+' &#8800; '+mB",
        htmlR2:"''",
        texfunc:"\\neq",
        latexL1:"mA+'\\\\neq'+mB",
        latexR1:"''",
        latexL2:"mA+'\\\\neq'+mB",
        latexR2:"''",
        mg: "mA+'Cv[8800]'+mB",
        },
ntg:{   htmlL1:"''",  //integral from func
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "ntgE(mA,mB,mC,mD)",
},
ntp:{   htmlL1:"''",  //integral container from func
        htmlR1:"''",
        htmlL2:"''",
        htmlR2:"''",
        texfunc:"\\XXX",
        latexL1:"''",
        latexR1:"''",
        latexL2:"''",
        latexR2:"''",
        mg: "ntgE(mA,mB,mC,mD)",
},
}

// internal functions
function strCount(xTarget,xSearch) {xTarget +="";xSearch+="";return xTarget.split(xSearch).length-1} //count occurrences of string
function funcTest(tFunc) {if (typeof funcMap[tFunc] == "undefined") {return false}; return true} //test for valid function key
function parseParens(xB,bSym) {//parse parens and return inside string, begin index, end index, source string, upper/lower args
    xB += "";
    var oComma = 0,lPar = 0,rPar = 0,bDelim = " ",eDelim = " ";cFind = "",ins = "";
    for (var iU=bSym;iU<xB.length;iU++) {
        cFind = xB.charAt(iU);
        if (cFind == "(") {bDelim = "(";eDelim = ")";break}
        if (cFind == "{") {bDelim = "{";eDelim = "}";break}
    }
    for (var iU=bSym;iU<xB.length;iU++) {
        cFind = xB.charAt(iU);
        if (cFind == "," && lPar-1 == rPar) {oComma = iU-bSym}
        if (cFind == bDelim ) {lPar++;if(lPar == 1) {bSym = iU}}
        if (cFind == eDelim ) {rPar++}
        if (lPar > 0 && lPar == rPar) {break}
    }
    ins = xB.substr(bSym+1,iU-bSym-1)
    return {begin:bSym,end:iU,source:xB,inside:ins,upper:ins.substr(0,oComma-1),lower:ins.substr(oComma)}
}
function oParens(xP) {//remove outside parens
    xP += "";
    if (xP.charAt(0) == "(" && xP.charAt(xP.length-1) == ")") {
        var tparens = parseParens(xP,0);
        if (tparens.end == xP.length-1) {return tparens.inside}
    }
    return xP
}
function parseArgs(xP) { //parse comma-delimited arguments into array
    var args = [];
    var strSplit = xP.split(",");
    args[0] = strSplit[0];
    for (var nXf=1;nXf<strSplit.length;nXf++) {
        if (strCount(args[args.length-1],"(") > strCount(args[args.length-1],")")) {args[args.length-1] = args[args.length-1]+","+strSplit[nXf]} //reassemble inside parens
        else {args.push(strSplit[nXf])}
    }
    return args
}
function parseBrackets(xB,bSym) {//parse brackets and return inside string, begin index, end index, source string
    xB += "";
    var lPar = 0;
    var rPar = 0;
    var bDelim = " ";
    var eDelim = " ";
    var lSym = xB.length;
    for (var iU=bSym;iU<lSym;iU++) {
        if (xB.charAt(iU) == " ") {iU++}
        if (xB.charAt(iU).charCodeAt(0) > 47 && tDelimiter.indexOf(xB.charAt(iU)) == -1){return {begin:bSym,inside:xB.charAt(iU),end:iU,source:xB}}
        if (xB.charAt(iU) == "\\") {
            var dTemp = xB.substr(iU,xB.length);
            for (var nXi=1;nXi<dTemp.length;nXi++) {if (tDelimiter.indexOf(dTemp.charAt(nXi)) > -1){break}}
            dTemp = dTemp.substr(0,nXi);
            return {begin:bSym,inside:dTemp,end:iU+dTemp.length,source:xB}
        }
        if (xB.charAt(iU) == "(") {bDelim = "(";eDelim = ")";break}
        if (xB.charAt(iU) == "{") {bDelim = "{";eDelim = "}";break}
        if (xB.charAt(iU) == "[") {bDelim = "[";eDelim = "]";break}
    }
    for (var iU=bSym;iU<lSym;iU++) {
        if (xB.charAt(iU) == bDelim ) {lPar++;if(lPar == 1) {bSym = iU}}
        if (xB.charAt(iU) == eDelim ) {rPar++}
        if (lPar > 0 && lPar == rPar) {break}
    }
    return {begin:bSym,inside:xB.substr(bSym+1,iU-bSym-1),end:iU,source:xB}
}
function dedupBrackets(dB) { //remove redundant brackets
    var sCount = strCount(dB,"{");
    var nXf = 0,dparens = "";
    for (nXf=0;nXf<sCount;nXf++) {
        dparens = parseBrackets(dB,dB.lastIndexOf("{{")+1);
        if (dB.substr(dparens.end,2) == "}}" ) {
            dB = dB.substr(0,dB.lastIndexOf("{{")+1)+dparens.inside+dB.substr(dparens.end+1,dB.length)
        }
    }
    sCount = strCount(dB,"(");
    for (nXf=0;nXf<sCount;nXf++) {
        dparens = parseBrackets(dB,dB.lastIndexOf("((")+1);
        if (dB.substr(dparens.end,2) == "))" ) {
            dB = dB.substr(0,dB.lastIndexOf("((")+1)+dparens.inside+dB.substr(dparens.end+1,dB.length)
        }
    }
    return dB
}
function oBrackets(xP) {//remove outside brackets
    var tparens = parseBrackets(xP,0);
    if (xP.charAt(0) == "(" && xP.charAt(xP.length-1) == ")") {
        if (tparens.end == xP.length-1) {return tparens.inside}
    }
    if (xP.charAt(0) == "{" && xP.charAt(xP.length-1) == "}") {
        if (tparens.end == xP.length-1) {return tparens.inside}
    }
    return xP
}
function brkt(xS,xO) {//scale brackets
    var iNest = dNest(xO);
    if (mgConfig.divScale == 50 || iNest == 0) {return xS}
    else {return "<span style='vertical-align:middle;display:inline-block;font-weight:100;font-size:"+Math.floor(100+(iNest*mgConfig.divScale*1.3))+"%'>"+xS+"</span>"}
}
function dNest(dN) {//count nested large elements
    var dDepth = 0,dSpan = 0;
    for (var iDp in dN) {
        if (dN.substr(iDp,6) == "<Xdiv>") {dSpan++}
        if (dN.substr(iDp,6) == "<Xdve>") {dSpan--}
        if (dSpan > dDepth) {dDepth = dSpan}
    }
    return dDepth
}
//

function htmlExport(htmlXpr) { //convert MG format to HTML
    function dedupParens(xP) {//remove duplicate parens
        xP += "";
        var dCount = strCount(xP,"(");
        for (var nXf=0;nXf<dCount;nXf++) {
            var dparens = parseParens(xP,xP.lastIndexOf("((")+1);
            if (xP.substr(dparens.end,2) == "))" ) {xP = xP.substr(0,xP.lastIndexOf("((")+1)+dparens.inside+xP.substr(dparens.end+1,xP.length)}
        }
        return xP
    }
    //
    if (htmlXpr == "NaN" || htmlXpr == "undefined") {return "undefined"}
    htmlXpr = cFunc(htmlXpr); //convert to FUNC
    if (mgConfig.editMode) {htmlXpr = htmlXpr.replace(/\,\)/g,",Cv[9643])").replace(/\(\,/g,"(Cv[9643],").replace(/\,\,/g,",Cv[9643],").replace(/\(\)/g,"(Cv[9643])")} //fill empty fields
    if (!mgConfig.editMode) {htmlXpr = dedupParens(htmlXpr);htmlXpr = oParens(htmlXpr)}
    htmlXpr = dFunc(htmlXpr, "html") //process functions
    //render symbols
    var sCount = strCount(htmlXpr,"Cv[");
    for (var nXf=0;nXf<sCount;nXf++) {htmlXpr = htmlXpr.replace(/Cv\[\d+\]/,Cs[(htmlXpr.match(/Cv\[\d+\]/)+"").replace(/Cv\[(\d+)\]/,"$1")])} //resolve Cv[] symbols
    //scale and fix parens
    htmlXpr = htmlXpr.replace(/\(/g,"{").replace(/\)/g,"}");
    sCount = strCount(htmlXpr,"{");
    var nXs = 0;
    for (nXs=0;nXs<sCount;nXs++) {
        var bSym = htmlXpr.indexOf("{");
        var lSym = htmlXpr.length;
        var iXs = parseParens(htmlXpr,bSym);
        var strg = iXs.inside;
        if (!mgConfig.editMode && htmlXpr.substr(bSym,7) == "{<Xdiv>" && htmlXpr.substr(iXs.end-6,7) == "<Xdve>}"  && htmlXpr.substr(bSym-6,6) != "<Xfnx>" && strg.search(/\<Xdve\>(.*)\<Xdiv\>/) == -1) {
            htmlXpr = htmlXpr.substr(0,bSym)+strg+htmlXpr.substr(iXs.end+1,lSym);
        }
        else if (dNest(strg) > 0) {//expanded parens
            if (strCount(htmlXpr.substr(0,bSym+1),"{") > strCount(htmlXpr.substr(iXs.end,lSym),"}")) {htmlXpr = htmlXpr.substr(0,bSym)+brkt("(",strg)+strg+htmlXpr.substr(iXs.end,lSym);}
            else {htmlXpr = htmlXpr.substr(0,bSym)+brkt("(",strg)+strg+brkt(")",strg)+htmlXpr.substr(iXs.end+1,lSym)}
        }
        else {//normal parens
            if (strCount(htmlXpr.substr(0,bSym+1),"{") > strCount(htmlXpr.substr(iXs.end,lSym),"}"))  {htmlXpr = htmlXpr.substr(0,bSym)+"("+strg+htmlXpr.substr(iXs.end,lSym);}
            else {htmlXpr = htmlXpr.substr(0,bSym)+"("+strg+")"+htmlXpr.substr(iXs.end+1,lSym)}
        }
    }
    // format arrays
    htmlXpr = htmlXpr.replace(/\<Xcel\>/g,"").replace(/\<Xrow\>/g,"{").replace(/\<Xrwe\>/g,"}");
    sCount = strCount(htmlXpr,"<Xcle>");
    for (nXs=0;nXs<sCount;nXs++) {
        if (nXs <sCount-1) {htmlXpr = htmlXpr.replace("<Xcle>",", ")}
        else {htmlXpr = htmlXpr.replace("<Xcle>","")}
    }
    htmlXpr = htmlXpr.replace(/\<X\w\w\w\>/g,"");//cleanup tags
    return htmlXpr
}
//
function mgExport(xFn) { //export from FUNC to MG format
    function toSciNot(xU) {xU+="";return xU.replace(/(\d+)e(\d+)/g,"$1*10^$2").replace(/(\d+)e\-(\d+)/g,"$1*10^-$2").replace(/(\d+)e\+(\d+)/g,"$1*10^$2")} //convert N.NNe+-NN notation to scientific
    if (xFn == "NaN" || xFn == "undefined") {return "undefined"}
    xFn += "";
    xFn = xFn.replace(/\,\)/g,",'')").replace(/\(\,/g,"('',").replace(/\,\,/g,",'',").replace(/\(\)/g,"('')");
    xFn = dFunc(xFn, "mg");
    xFn = xFn.replace(/\+\-/g,"-").replace(/\-\-/g,"");
    xFn = toSciNot(xFn);
    return xFn //process functions
}

//
function cFunc(cXpr) { //convert from MG format to FUNC format: a+bc/d -> cAdd(a,cDiv(cMul(b,c),d)))
    function cParse(xInp,xOp,xFunc) {//parse operators
        const zDelim = ["^","-","#","*","/","+",",","~","@","=","<",">",String.fromCharCode(8800),String.fromCharCode(8804),String.fromCharCode(8805),String.fromCharCode(8226)];
        var ztmp = "",bSym = "",lPar = 0,rPar = 0;
        if (xOp == "^") {bSym = xInp.lastIndexOf(xOp)+1}
        else  {bSym = xInp.indexOf(xOp)+1;}
        var aSym = bSym-2;
        var lSym = xInp.length;
        for (var iCp=bSym;iCp<=lSym;iCp++) {
            ztmp = xInp.charAt(iCp);
            if (ztmp == "(") {lPar++}
            if (ztmp == ")") {rPar++}
            if (lPar < rPar) {break;}
            if (lPar == rPar && xInp.charAt(iCp-1)!= "e") { if (zDelim.indexOf(ztmp) > -1) {break} }
        }
        lPar = 0;rPar = 0;
        for (var dCp=aSym;dCp>=0;dCp--) {
            ztmp = xInp.charAt(dCp);
            if (ztmp == "(") {lPar++}
            if (ztmp == ")") {rPar++}
            if (lPar > rPar) {break;}
            if (lPar == rPar && xInp.charAt(dCp-1)!= "e") { if (zDelim.indexOf(ztmp) > -1) {break} }
        }
        xInp = xInp.substr(0,dCp+1)+xFunc+"("+xInp.substr(dCp+1,aSym-dCp)+","+xInp.substr(bSym,iCp-bSym)+")"+xInp.substr(iCp);
        return xInp;
    }
    function nParse(xInp,xOp) {//parse negatives as cNeg()
        const zDelim = ["(",")","^","-","#","*","/","+",",","~","@","=","<",">",String.fromCharCode(8800),String.fromCharCode(8804),String.fromCharCode(8805),String.fromCharCode(8226)];
        var ztmp = "";
        var iNp = 0,lPar = 0,rPar = 0;
        var bSym = xInp.indexOf(xOp)+xOp.length;
        var lSym = xInp.length;
        for (iNp=bSym;iNp<=lSym;iNp++) {
            ztmp = xInp.charAt(iNp);
            if (ztmp == "(") {lPar++}
            if (ztmp == ")") {rPar++}
            if (lPar < rPar) {break;}
            if (lPar == rPar && xInp.charAt(iNp-1)!= "e") {if (zDelim.indexOf(ztmp) > -1) {break}}
        }
        xInp = xInp.substr(0,bSym-1)+"cNeg("+xInp.substr(bSym,iNp-bSym)+")"+xInp.substr(iNp);
        return xInp;
    }
    //
    // non-multiplying cBnd symbols
    const nBind = ["(Cv\\[8773\\])","(Cv\\[8750\\])","(Cv\\[8751\\])","(Cv\\[8752\\])",
                "(Cv\\[8592\\])","(Cv\\[8747\\])","(Cv\\[8748\\])","(Cv\\[59\\])",
                "(idr\\([^\\)]*\\))","(tdr\\([^\\)]*\\))","(lim\\([^\\)]*\\,[^\\)]*\\))",
                "(itg\\([^\\)]*\\,[^\\)]*\\))","(sdr\\([^\\)]*\\,[^\\)]*\\))","(sum\\([^\\)]*\\,[^\\)]*\\))",
                "(prd\\([^\\)]*\\,[^\\)]*\\))","(psd\\([^\\)]*\\,[^\\)]*\\))","(cap\\([^\\)]*\\,[^\\)]*\\))",
                "(cup\\([^\\)]*\\,[^\\)]*\\))","(dif\\([^\\)]*\\,[^\\)]*\\))","(Cv\\[10044])"];
    //relational operators
    const relOps = {"cEql":"=","cLth":"<","cGth":">","cNql":String.fromCharCode(8800),"cLeq":String.fromCharCode(8804),"cGeq":String.fromCharCode(8805)};//relational operators
    const relOperators = {"Cv[60]":"<","Cv[61]":"=","Cv[62]":">","Cv[8800]":String.fromCharCode(8800),"Cv[8804]":String.fromCharCode(8804),"Cv[8805]":String.fromCharCode(8805)};//relational operators
    //editing
    const pCases = ["^-","^|-"];
    const nCases = ["~-","~|-","+-","*-","/-","(-",",-","+|-","*|-","/|-","(|-",",|-","=-","=|-","@-","@|-","e|-",">-","<-",">|-","<|-",
                  String.fromCharCode(8804)+"-",String.fromCharCode(8804)+"|-",String.fromCharCode(8805)+"-",String.fromCharCode(8805)+"|-",
                  String.fromCharCode(8800)+"-",String.fromCharCode(8800)+"|-",String.fromCharCode(8226)+"-",String.fromCharCode(8226)+"|-"];
    var nCf = 0,iXX = 0,key = 0,sbtOperand = "",cIdx = 0,aIdx = 0;
    var sCount = strCount(cXpr,"]sbt(");//var&subscripts into container cnt()
    cXpr += "";
    cXpr = cXpr.replace(/\]sbt\(/g,"]SBT(");
    cXpr = cXpr.replace(/Infinity/g,"Cv[8734]");
    for (nCf=0;nCf<sCount;nCf++) {
        sbtOperand = parseParens(cXpr,cXpr.indexOf("]SBT("));
        cXpr = cXpr.replace(/Cv\[(\d+)\]SBT\(/,"cnt(Cv[$1]SBT(").replace("]SBT("+sbtOperand.inside,"]sbt("+oParens(sbtOperand.inside)+")");
    }
    sCount = strCount(cXpr,"Cv[8748]");//differential
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cXpr.replace(/Cv\[8748\]Cv\[(\d+)\]\/Cv\[8748\]Cv\[(\d+)\]/,"sdr(Cv[$1],Cv[$2])")}
    cXpr = cXpr.replace(/!/g,"Cv[45]"); //factorial
    cXpr = cXpr.replace(/Cv\[8226\]/g,String.fromCharCode(8226)); //dot operator
    for (key in relOperators) {
        sCount = strCount(cXpr,key);
        for (nCf=0;nCf<sCount;nCf++) {cXpr = cXpr.replace(key,relOperators[key])}
    }
    cXpr = cXpr.replace(/([\)\]])(\|?)(\d)/g,"$1$2#$3").replace(/([\)\]\d])(\|?)\(/g,"$1$2#(").replace(/([\)\]\d])(\|?)Cv\[/g,"$1$2#Cv[").replace(/([\)\]\d])(\|?)([a-z][a-z][a-z]\()/ig,"$1$2#$3");//terms to # multiply
    for (nCf in nBind) {//add @ between bind symbols
        var rgx = new RegExp(nBind[nCf]+"(\\|?)#");
        var rgy = new RegExp("#(\\|?)"+nBind[nCf]);
        while (cXpr.search(rgx) != -1 || cXpr.search(rgy) != -1) {cXpr = cXpr.replace(rgx,"$1$2@").replace(rgy,"@$1$2")}
    }
    if (cXpr.charAt(0) == "+") {cXpr = cXpr.substr(1)} //remove + at beginning of expression
    sCount = strCount(cXpr,"-");//parse power negatives to cPow(x,cNeg())
    for (nCf=0;nCf<sCount;nCf++) {
        for (iXX in pCases) {
            if (cXpr.indexOf(pCases[iXX]) > -1) {cXpr = nParse(cXpr,pCases[iXX])}
        }
    }
    sCount = strCount(cXpr,"^");//convert powers to cPow()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"^","cPow")}
    if (cXpr.charAt(0) == "-") {cXpr = nParse(cXpr,"-")}
    sCount = strCount(cXpr,"-");//parse negatives to cNeg()
    for (nCf=0;nCf<sCount;nCf++) {
        for (iXX in nCases) {
            if (cXpr.indexOf(nCases[iXX]) > -1) {cXpr = nParse(cXpr,nCases[iXX])}
        }
    }
    sCount = strCount(cXpr,"~");//convert angles to cAng()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"~","cAng")}
    sCount = strCount(cXpr,"#");//convert # to cMul() (multiply)
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"#","cMul")}
    sCount = strCount(cXpr,"/");//convert / to cDiv()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"/","cDiv")}
    sCount = strCount(cXpr,"*");//convert * to cTms()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"*","cTms")}
    sCount = strCount(cXpr,String.fromCharCode(8226));//convert dot to cDot()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,String.fromCharCode(8226),"cDot")}
    sCount = strCount(cXpr,"-") + strCount(cXpr,"+");//convert +- to cAdd() or cSub()
    for (nCf=0;nCf<sCount;nCf++) {
        aIdx = cXpr.indexOf("+");
        cIdx = cXpr.indexOf("-");
        if (aIdx == -1) {cXpr = cParse(cXpr,"-","cSub")}
        else if (cIdx == -1) {cXpr = cParse(cXpr,"+","cAdd")}
        else if (aIdx < cIdx) {cXpr = cParse(cXpr,"+","cAdd")}
        else {cXpr = cParse(cXpr,"-","cSub")}
    }
    sCount = strCount(cXpr,"@");//convert @ symbol handler to cBnd()
    for (nCf=0;nCf<sCount;nCf++) {cXpr = cParse(cXpr,"@","cBnd")}
    for (key in relOps) { //relational operators
        sCount = strCount(cXpr,relOps[key]);
        for (nCf=0;nCf<sCount;nCf++) {
            cXpr = cParse(cXpr,relOps[key],key)
        }
    }
    cXpr = cXpr.replace(/\[\[/g,"'[[").replace(/\]\]/g,"]]'") //quote matrices
    return cXpr;
}
function dFunc(dXpr, prefix) { //map FUNC format to export format
    function oprExtract(fExt) {//extract inside function in FUNC format, returns func,upper,lower
        function fTest(tFunc) {if (typeof funcMap[tFunc] == "undefined") {return false}; return true} //test for valid function key
        fExt = oParens(fExt);
        var opReturn = {func:"",upper:"",lower:""};
        var funcKey = fExt.substr(0,fExt.indexOf("("))
        if (funcKey != "" && fTest(funcKey)) {
            var strg = parseParens(fExt,fExt.indexOf("("));
            if (strg.upper != "") {opReturn = {func:funcKey,upper:strg.upper,lower:strg.lower}} //two operands
            else {opReturn = {func:funcKey,upper:strg.inside,lower:""}} //single operand
        }
        return opReturn
    }
    function numTest(xT) {if (+xT == +xT*1) {return true}; return false} //test for numerical string
    function overUnder(xA,xB,xS,xFsize) {
        if (xA == "") {xA = "&nbsp;"}
        if (xB == "") {xB = "&nbsp;"}
        return "<Xdiv><span style='display:inline-block;'><span style='vertical-align:middle;text-align:center;display:inline-table;'><span style='display:table-row;font-size:50%'>"
                +xA+"</span><span style='line-height:80%;display:table-row;font-size:"+xFsize+"%'>"+xS+"</span><span style='line-height:150%;display:table-row;font-size:50%'>"
                +xB+"</span></span></span><Xdve>"
    }
    function fAccentU(xA) {return "<Xfnc><span style='display:inline-block;'><span style='text-align:center;vertical-align:middle;display:inline-table;'><span style='display:table-row;line-height:20%;font-size:60%'>"+xA+"</span><span style='line-height:90%;display:table-row;'>"}
    function fAccentL(xB) {return "<Xfnc></span><span style='display:table-row;line-height:20%;font-size:60%'>"+xB+"</span></span></span>"}
    function xParens(xA) {return "(" + oParens(xA) + ")"}
    
    //MG handlers
    function cSubE(xU,xL) { //subtraction
        xTractL = oprExtract(cFunc(xL));
        if (xTractL.func == "cAdd") {return xU + "-" + xParens(xL)}
        return xU + "-" + xL
    }
    function cMulE(xU,xL) { //multiplication by term
        xTractU = oprExtract(cFunc(xU));
        xTractL = oprExtract(cFunc(xL));
        xL = oParens(xL);xU = oParens(xU);
        if (xTractU.func == "cAdd" || xTractU.func == "cSub" || xTractU.func == "fac") {xU  = xParens(xU)}
        if (xTractL.func == "cAdd" || xTractL.func == "cSub" || xTractL.func == "fac") {xL  = xParens(xL)}
        if (xTractL.func == "cDiv" && xTractU.func == "cDiv") {xU  = xParens(xU);xL  = xParens(xL)}
        if (xU.indexOf("Cv[45]") > -1 && xU.lastIndexOf("Cv[45]") == xU.length-6) {xU  = xParens(xU)}
        if (xL.indexOf("Cv[45]") > -1 && xL.lastIndexOf("Cv[45]") == xL.length-6) {xL  = xParens(xL)}
        if (xTractL.func == "cPow" && numTest(xU) && numTest(xTractL.upper)) {xL  = xParens(xL)}
        return xU + "" + xL
    }
    function cDivE(xU,xL) { //division
        xTractU = oprExtract(cFunc(xU));
        xTractL = oprExtract(cFunc(xL));
        if (xTractU.func == "cAdd" || xTractU.func == "cSub" || xTractU.func == "cMul" || xTractU.func == "cDiv" || xTractU.func == "cNeg" || xU.indexOf("Cv[8747]") > -1) {xU  = xParens(xU)}
        if (xTractL.func == "cAdd" || xTractL.func == "cSub" || xTractL.func == "cMul" || xTractL.func == "cDiv" || xTractL.func == "cNeg" || xL.indexOf("Cv[8747]") > -1) {xL  = xParens(xL)}
        return xU + "/" + xL
    }
    function cPowE(xU,xL) { //powers
        xTractU = oprExtract(cFunc(xU));
        xTractL = oprExtract(cFunc(xL));
        if (xTractU.func == "cAdd" || xTractU.func == "cSub" || xTractU.func == "cMul" || xTractU.func == "cDiv" || xTractU.func == "cNeg" || xTractU.func == "fac") {xU  = xParens(xU)}
        if (xTractL.func == "cAdd" || xTractL.func == "cSub" || xTractL.func == "cMul" || xTractL.func == "cDiv" || xTractL.func == "cNeg") {xL  = xParens(xL)}
        return xU + "^" + xL
    }
    function cNegE(xU) { //negative
        xTractU = oprExtract(cFunc(xU));
        if (xTractU.func == "cAdd" || xTractU.func == "cSub" || xTractU.func == "cDiv") {return "-" + xParens(xU)}
        return "-" + xU
    }
    function facE(xU) { //factorial
        if (!numTest(xU) && cFunc(xU) != oParens(xU)) {return xParens(xU) + "Cv[45]"}
        return xU + "Cv[45]"
    }
    function tdvE(xU,dV,xN) { //total derivative from FUNC format
        if (typeof xN == "undefined") {return "(tdr(" + dV + ")" + xU + ")"}
        return "(tdr(" + dV + "," + xN + ")" + xU + ")"
    }
    function drvE(xU,dV,xN) { //partial derivative from FUNC format
        if (typeof xN == "undefined") {return "(idr(" + dV + ")" + xU + ")"}
        return "(idr(" + dV + "," + xN + ")" + xU + ")"
    }
    function idrE(xU,xN) { //partial derivative
        if (typeof xN == "undefined") {return "idr(" + xU + ")"}
        return "idr(" + xU + "," + xN + ")"
    }
    function tdrE(xU,xN) { //total derivative
        if (typeof xN == "undefined") {return "tdr(" + xU + ")"}
        return "tdr(" + xU + "," + xN + ")"
    }
    function ntgE(xU,dV,mU,mL) { //integral from FUNC format
        if (typeof mU == "undefined" && typeof mL == "undefined") {return "Cv[8747]" + xU + "Cv[8748]" + dV}
        return "itg(" + mU + "," + mL + ")" + xU + "Cv[8748]" + dV
    }
    function matE() {return "mat(" + Array.prototype.slice.call(arguments) + ")"} // matrix object
    //html handlers
    function cMulL(xU,xL) {
        if (xL.indexOf("<Xfnc>") == 0) {return xU+" "+xL}
        return xU+""+xL
    }
    function cDivL(xU,xL) {
        if (mgConfig.divSymbol == "Slash") {return xU+"/"+xL}
        else {
            if (!mgConfig.editMode) {xU = oParens(xU);xL = oParens(xL)}
            return "<Xdiv> <span style='text-align:center;vertical-align:middle;display:inline-block;'><span style='display:table-row;'><span style='font-size:"
            +mgConfig.divScale+"%;display:table-cell'>"+xU+"</span></span><span style='display:table-row;vertical-align:top'><span style='font-size:"
            +mgConfig.divScale+"%;display:table-cell;border-top-style:solid;border-top-width:2px;padding:3px;'>"+xL+"</span></span></span> <Xdve>"
        }
    }
    function cPowL(xU,xL) {
        if (!mgConfig.editMode) {xL = oParens(xL)}
        if (dNest(xU) > 2) {return "<table style='text-align:center;display:inline-table;vertical-align:middle'><tr><td>"+xU+"</td><td style='vertical-align:top'><sup>"+xL+"</sup></td></tr></table>"}
        if (xU.indexOf(" <Xfxp>") > -1 && xU.indexOf(" <Xfxp>") ==  xU.length-7) {return "("+xU+")<sup>"+xL+"</sup> "} //(ln x)^2
        if (xU.indexOf("<Xfnc>") == 0 && xU.indexOf("<Xfxp> ") > -1 &&  xU.indexOf("<Xfxp> ") < 11) {return xU.replace("<Xfxp>","<sup>"+xL+"</sup> ")} //sin^2 x
        if (xL.indexOf("<Xdiv>") > -1 && xL.indexOf("<Xdve>") == xL.length-7 && !mgConfig.editMode) {xL = "("+xL+")"}
        if (xU.indexOf("<Xdiv>") == 1 && xU.indexOf("<Xdve>") == xU.length-7 && !mgConfig.editMode) {xU = "("+xU+")"}
        if ((dNest(xU) > 0 || dNest(xL) > 0 ) && mgConfig.divScale > 50) {return xU+"<sup><span style='vertical-align:super'>"+xL+"</span></sup>"} //lift exponent for big symbols
        return xU+"<sup>"+xL+"</sup>"
    }
    function radL(rSymb,xY,xZ) {//radicals
        var tgtRad = ["&#8730;","<span style='vertical-align:top;display:inline-block;position:relative;'><span style='vertical-align:top;position:absolute;'>&#8730;</span><span style='vertical-align:top;position:absolute;font-size:50%;'><sup>&nbsp;3</sup></span>&nbsp;&nbsp;</span>",
                    "<span style='vertical-align:top;display:inline-block;position:relative;'><span style='vertical-align:top;position:absolute;'>&#8730;</span><span style='vertical-align:top;position:absolute;font-size:50%;'><sup>&nbsp;"+xZ+"</sup></span>&nbsp;&nbsp;</span>"];
        if (mgConfig.divScale != 50) {
            var xNest = Math.floor(100+(dNest(xY)*mgConfig.divScale*1.2));
            return "<span style='vertical-align:middle;display:inline-block;padding:3px'><span style='vertical-align:top;font-size:"+xNest+"%'>"
                    +tgtRad[rSymb]+"</span><span style='vertical-align:top;border-top-style:solid;border-top-width:2px;'><span style='vertical-align:top;'><span style='vertical-align:middle;font-size:90%'>";
        }
        else {return "<span style='display:inline-block;'>"+tgtRad[rSymb]+"</span><span style='border-top-style:solid;border-top-width:2px;'><span style='font-size:90%'>";}
    }
    function radR() {//radicals
        if (mgConfig.divScale == 50) {return "</span></span>"}
        else {return "</span></span></span></span>"}
    }
    function conL() {return "<Xfnc><span style='border-top-style:solid;border-top-width:2px;padding:4px;font-size:90%'>"}
    function undL() {return "<Xfnc><span style='border-bottom-style:solid;border-bottom-width:2px;padding:4px;font-size:90%'>"}
    function limL(xA,xB) {
        return "<Xfnc><span style='display:inline-block;'><span style='text-align:center;vertical-align:middle;display:inline-table;'><span style='display:table-row;font-size:40%'>&nbsp;</span><span style='line-height:50%;display:table-row;'>lim</span><span style='display:table-row;font-size:60%'>"+xA+"&#8594;"+xB+"</span></span></span>"
    }
    function itgL(xA,xB) {
        return "<Xdiv><span style='display:inline-block;vertical-align:middle;'><table cellpadding='0' cellspacing='0'><tr><td rowspan='4'><span style='vertical-align:middle;display:inline-table;'><span style='display:table-row;line-height:90%'>&#8992;</span><span style='display:table-row;line-height:90%'>&#8993;</span></span></td><tr><td style='font-size:45%'>"
                +xA+"</td></tr><tr><td>&nbsp;</td></tr><td style='font-size:45%'>"+xB+"</td></tr></table></span><Xdve>"
    }
    function vecL()  {return fAccentU("<i>&#8594;</i>")}
    function vecR()  {return fAccentL("<span style='line-height:50%'>&nbsp;</span>")}
    function hatL()  {return fAccentU("<i>&#8963;</i>")}
    function hatR()  {return fAccentL("<span style='line-height:50%'>&nbsp;</span>")}
    function tldL()  {return fAccentU("&#8764;")}
    function tldR()  {return fAccentL("<span style='line-height:50%'>&nbsp;</span>")}
    function udtL()  {return fAccentU("&#8226;")}
    function udtR()  {return fAccentL("<span style='line-height:50%'>&nbsp;</span>")}
    function tdrL(xA,xN) {
        var xTmp = "";
        var tmpDivSym = mgConfig.divSymbol;mgConfig.divSymbol = "Over";
        if (typeof xN =="undefined" || xN == 1) {xTmp = cDivL("<i>d</i>","<i>d</i>"+xA)}
        else {xTmp = cDivL("<i>d</i><sup>"+xN+"</sup>","<i>d</i>"+xA+"<sup>"+xN+"</sup>")}
        mgConfig.divSymbol =  tmpDivSym;
        return xTmp
    }
    function idrL(xA,xN) {
        var xTmp = "";
        var tmpDivSym = mgConfig.divSymbol;mgConfig.divSymbol = "Over";
        if (typeof xN =="undefined" || xN == 1) {xTmp = cDivL("&#8706;","&#8706;"+xA)}
        else {xTmp = cDivL("&#8706;<sup>"+xN+"</sup>","&#8706;"+xA+"<sup>"+xN+"</sup>")}
        mgConfig.divSymbol =  tmpDivSym;
        return xTmp
    }
    function sdrL(xA,xB,xN) {
        var xTmp = "";
        var tmpDivSym = mgConfig.divSymbol;mgConfig.divSymbol = "Over";
        if (typeof xN =="undefined" || xN == 1) {xTmp = cDivL("<i>d</i>"+xA,"<i>d</i>"+xB)}
        else {xTmp = cDivL("<i>d</i><sup>"+xN+"</sup>"+xA,"<i>d</i>"+xB+"<sup>"+xN+"</sup>")}
        mgConfig.divSymbol =  tmpDivSym;
        return xTmp
    }
    function psdL(xA,xB,xN) {
        var xTmp = "";
        var tmpDivSym = mgConfig.divSymbol;mgConfig.divSymbol = "Over";
        if (typeof xN =="undefined" || xN == 1) {xTmp = cDivL("&#8706;"+xA,"&#8706;"+xB)}
        else {xTmp = cDivL("&#8706;<sup>"+xN+"</sup>"+xA,"&#8706;"+xB+"<sup>"+xN+"</sup>")}
        mgConfig.divSymbol =  tmpDivSym;
        return xTmp
    }
    function matL(xA) {
        var mReturn = "",prefix = "",suffix = "",iM = 0;
        var dScale = xA.length;
        if (typeof xA[0] == "string" && xA[0].substr(0,6) == "<Xrow>"){
            for (iM in xA) {
                xA[iM] = xA[iM].replace(/\<Xrow\>/g,"").replace(/\<Xrwe\>/g,"").replace(/\<Xcel\>/g,"<td>").replace(/\<Xcle\>/g,"</td>");
                dScale = dScale + dNest(xA+"")*(mgConfig.divScale/100)
                mReturn = mReturn + "<tr>" + xA[iM] + "</tr>"
                prefix = prefix+"<Xdiv>";
                suffix = suffix+"<Xdve>";
            }
            return prefix+" <table style='text-align:center;display:inline-table;vertical-align:middle'><tr><td style='border-left:2px solid black;border-top:2px solid black;border-bottom:2px solid black'>&nbsp;</td><td><table>" + mReturn + "</table><td style='border-right:2px solid black;border-top:2px solid black;border-bottom:2px solid black'>&nbsp;</td></tr></table> "+suffix
        }
        else {
            for (iM in xA) {mReturn = mReturn + "<Xcel>" + xA[iM] + "<Xcle>"}
            return "<Xrow>" + mReturn + "<Xrwe>"
        }
    }
    //latex handlers
    function cPowX(xU,xL) {
        if (xU.indexOf("<Xfxp>") > 0 && xU.indexOf("<Xfxp>") < 6 && xU.indexOf("\\") == 0) {return oBrackets(xU).replace("<Xfxp>","^{"+oBrackets(xL)+"}")} //sin^n x
        if (xU.indexOf("\\") == 0) {return "("+oBrackets(xU)+")^{"+oBrackets(xL)+"}"}
        return "{"+oBrackets(xU)+"}^{"+oBrackets(xL)+"}"
    }
    function idrX(xU,xN) {
        if (typeof xN == "undefined") {return '\\frac{\\partial}{\\partial '+xU+'}'}
        return '\\frac{\\partial^'+xN+'}{\\partial '+xU+'^2}'
    }
    function tdrX(xU,xN) {
        if (typeof xN == "undefined") {return '\\frac{d}{d '+xU+'}'}
        return  '\\frac{d^'+xN+'}{d '+xU+'^'+xN+'}'
    }
    function psdX(xU,xL,xN) {
        if (typeof xN == "undefined") {return '\\frac{\\partial '+xU+'}{\\partial '+xL+'}'}
        return  '\\frac{\\partial^'+xN+' '+xU+'}{\\partial '+xL+'^'+xN+'}'
    }
    function sdrX(xU,xL,xN) {
        if (typeof xN == "undefined") {return '\\frac{d '+xU+'}{d '+xL+'}'}
        return '\\frac{d^'+xN+' '+xU+'}{d '+xL+'^'+xN+'}'
    }
    function matX(xA) {
        var mReturn = "";
        if (xA[0].indexOf("<Xrow>") == -1) {
            for (var iC=0;iC<xA.length;iC++) {
                mReturn = mReturn + xA[iC];
                if (iC < xA.length-1) {mReturn = mReturn + "<Xcel>"}
            }
            mReturn = "<Xrow>" + mReturn + "<Xrwe>"
        }
        else {
            mReturn = mReturn + "\\begin{bmatrix}";
            for (var iR=0;iR<xA.length;iR++) {
                xA[iR] = xA[iR].replace(/\<Xcel\>/g,"&").replace(/\<Xrow\>/g,"").replace(/\<Xrwe\>/g,"");
                mReturn = mReturn + xA[iR];
                if (iR < xA.length-1) {mReturn = mReturn + "\\\\"}
            }
            mReturn = mReturn + "\\end{bmatrix}"
        }
        return mReturn
    }
    // function handlers
    function lFunc(strg,parm) {var mA=parm[0],mB=parm[1],mC=parm[2],mD=parm[3];return eval(funcselect(funcKey,fnformatLx))} //process left side function
    function rFunc(strg,parm) {var mA=parm[0],mB=parm[1],mC=parm[2],mD=parm[3];return eval(funcselect(funcKey,fnformatR))} //process right side function
    function funcselect(func,key) {return funcMap[func][key]}
    //
    dXpr = dXpr.replace(/ /g,"").replace(/([a-z][a-z][a-z])\(/ig,"$1@"); //mark left parens with @
    var sCount = strCount(dXpr,"@");
    var bSym = 0, lSym = 0,lPar = 1,rPar = 0,iXf = 0,payload = "",strgS = "",funcKey = "",fParams = "",rTmp = "",fnformatL = "",fnformatR = "",fnformatLx = "";
    if (prefix == "mg") {fnformatL = prefix;fnformatR = prefix}
    else if (mgConfig.fnFmt == "fn(x)") {fnformatL = prefix+"L1";fnformatR = prefix+"R1"} //fn(x)
    else {fnformatL = prefix+"L2";fnformatR = prefix+"R2"}  //fn x
    for (var nXf=0;nXf<sCount;nXf++) {
        fnformatLx = fnformatL;
        lPar = 1,rPar = 0,iXf = 0,fParams = "",rTmp = "";
        bSym = dXpr.lastIndexOf("@")+1; //find inside parens
        lSym = dXpr.length;
        for (iXf=bSym;iXf<lSym;iXf++) {
            if (dXpr.charAt(iXf) == "@" || dXpr.charAt(iXf) == "(") {lPar++}
            if (dXpr.charAt(iXf) == ")") {rPar++}
            if (lPar == rPar) {break;}
        }
        payload = dXpr.substr(bSym,iXf-bSym); //parameters between parens
        if (lPar > rPar) {payload = payload.substr(0,payload.lastIndexOf(")"))+payload.substr(payload.lastIndexOf(")")+1)} //unmatched left parens
        strgS = parseArgs(payload); //parse parms
        funcKey = dXpr.substr(bSym-4,3); //extract functions xxx()
        if (!funcTest(funcKey)) {funcKey = dXpr.substr(bSym-5,4)} //extract operators cXxx()
        if (typeof funcselect(funcKey,prefix+"Inv1") != "undefined" && mgConfig.invFmt == "sin<sup>-1</sup>" && mgConfig.fnFmt == "fn(x)") {fnformatLx = prefix+"Inv1"} //inverse fn(x)
        if (typeof funcselect(funcKey,prefix+"Inv1") != "undefined" && mgConfig.invFmt == "sin<sup>-1</sup>" && mgConfig.fnFmt == "fn x")  {fnformatLx = prefix+"Inv2"} //inverse fn x
        if (typeof strgS[0] == "string" && funcKey != "mat" && funcselect(funcKey,fnformatLx).indexOf("mA") == -1){fParams += strgS[0]} //incomplete xxx(x)
        if (typeof strgS[1] == "string" && funcKey != "mat" && funcselect(funcKey,fnformatLx).indexOf("mB") == -1){fParams += strgS[1]} //incomplete xxx(x,y)
        if (prefix != "mg" && mgConfig.fnFmt == "fn x" && iXf < lSym && funcselect(funcKey,fnformatR).indexOf(" ") > -1 && fParams.replace(/[\|\(\{](.*)[\|\)\}]/g,"").search(/[+(&minus;)]/) > -1 ) {fParams = "("+fParams+")"} //add parens to inside functions
        if (iXf < lSym && prefix != "mg") {rTmp = rFunc(payload,strgS)} //right side function
        dXpr = dXpr.substr(0,bSym-(funcKey.length+1))+lFunc(payload,strgS)+fParams+rTmp+dXpr.substr(iXf+1,lSym); //assemble output
    }
    return dXpr
}

//LaTex Export/Import functions
var Ct = new Array(11000);

Ct[0]="\\alpha ";                                       //"fine structure const";
Ct[1]="\\alpha_{0}";                                    //"Bohr radius";
Ct[2]="b";                                              //"Wein displacement const.";
Ct[3]="c";                                              //"speed of light";
Ct[4]="c^2 ";                                           //"(speed of light)<sup>2</sup>";

Ct[5]="c_{1}";                                          //"1<sup>st</sup> radiation constant";
Ct[6]="c_{2}";                                          //"2<sup>nd</sup> radiation constant";
Ct[7]="\\epsilon_{0}";                                  //"vacuum permittivity";
Ct[8]="e";                                              //"Euler constant";
Ct[9]="eV";                                             //"electron volt";

Ct[10]="F";                                             //"Faraday constant";
Ct[11]="G";                                             //"Newton constant";
Ct[12]="g";                                             //"Earth gravity accel";
Ct[13]="G_{0}";                                         //"conductance quantum";
Ct[14]="h";                                             //"Planck constant";

Ct[15]="\\hbar ";                                       //"h-bar";
Ct[16]="K_{j}";                                         //"Josephson constant";
Ct[17]="k";                                             //"Boltzmann constant";
Ct[18]="\\lambda ";                                     //"Compton wavelength";
Ct[19]="l_{P}";                                         //"Planck length";

Ct[20]="\\mu_{0}";                                      //"vacuum permeability";
Ct[21]="\\mu_{B}";                                      //"Bohr magneton";
Ct[22]="M_{e}";                                         //"electron mass";
Ct[23]="M_{p}";                                         //"proton mass";
Ct[24]="M_{n}";                                         //"neutron mass";

Ct[25]="M_{P}";                                         //"Planck mass";
Ct[26]="M_{u}";                                         //"atomic mass constant";
Ct[27]="N_{a}";                                         //"Avogadro constant";
Ct[28]="n_{0}";                                         //"Loschmidt constant";
Ct[29]="\\pi ";                                         //"Archimedes constant";

Ct[30]="2 \\pi ";                                       //"2&times;&#960;";
Ct[31]="\\phi";                                         //"golden ratio";
Ct[32]="\\phi_{0}";                                     //"magnetic flux quantum";
Ct[33]="P_{atm}";                                       //"standard pressure";
Ct[34]="q_{e}";                                         //"elementary charge";

Ct[35]="R_{c}";                                         //"Universal gas constant";
Ct[36]="R_{k}";                                         //"von Klitzing constant";
Ct[37]="R_{\\infty}";                                   //"Rydberg constant";
Ct[38]="r_{e}";                                         //"classical electron radius";
Ct[39]="\\sigma ";                                      //"Stefan-Boltzmann";

Ct[40]="T_{P}";                                         //"Planck temperature";
Ct[41]="t_{P}";                                         //"Planck time";
Ct[42]="V_{m}";                                         //"molar volume";
Ct[43]="Z_{0}";                                         //"vacuum impedance";

for (iAl=48;iAl<10000;iAl++) {Ct[iAl]=""}
for (iAl=58;iAl<=127;iAl++)  {Ct[iAl]="\\textrm{"+String.fromCharCode(iAl)+"}"}//ascii
for (iAl=48;iAl<=57;iAl++)   {Ct[iAl]=String.fromCharCode(iAl)}//0-9
for (iAl=65;iAl<=90;iAl++) {Ct[iAl]="\\textbf{"+String.fromCharCode(iAl)+"}"}//A-Z
for (iAl=97;iAl<=122;iAl++) {Ct[iAl]="\\textbf{"+String.fromCharCode(iAl)+"}"}//a-z
for (iAl=10032;iAl<=10047;iAl++) {Ct[iAl]=String.fromCharCode(iAl-10000)}//punc
for (iAl=10065;iAl<=10090;iAl++) {Ct[iAl]=String.fromCharCode(iAl-10000)}//A-Z italic
for (iAl=10097;iAl<=10122;iAl++) {Ct[iAl]=String.fromCharCode(iAl-10000)}//a-z italic
for (iAl=10768;iAl<=10879;iAl++) {Ct[iAl]=""}//accents
var Greeks =   ["A","B","\\Gamma ","\\Delta ","E","Z","H","\\Theta ","I","K","\\Lambda ","M",
                "N","\\Xi ","O","\\Pi ","","\\Rho ","\\Sigma ","T","\\Upsilon ","\\Phi ","X","\\Psi ","\\Omega ",
                "","","","","","","",
                "\\alpha ","\\beta ","\\gamma ","\\delta ","\\epsilon ","\\zeta ","\\eta ","\\theta ","\\iota ","\\kappa ","\\lambda ","\\mu ",
                "\\nu ","\\xi ","o","\\pi ","","\\rho ","\\sigma ","\\tau ","\\upsilon ","\\phi ","\\chi ","\\psi ","\\omega "];
for (iAl=0;iAl<=Greeks.length;iAl++) {Ct[iAl+913] = Greeks[iAl]}

Ct[10040] ="\\left(";
Ct[10041] ="\\right)";
Ct[42] = "\\ast ";
Ct[45] = "!";
Ct[46] = "\\imath ";
Ct[60] = "<";
Ct[61] = "=";
Ct[62] = ">";
Ct[92] = "\\setminus ";
Ct[126] = "\\sim ";
Ct[172] = "\\neg ";
Ct[176] = "\\circ ";
Ct[177] = "\\pm ";
Ct[215] = "\\times ";
Ct[247] = "\\div ";
Ct[420] = "\\mathfrak{P}";
Ct[8230] = "\\dotsi ";
Ct[8756] = "\\because ";
Ct[8757] = "\\therefore ";
Ct[8758] = "\\vdots ";
Ct[8800] = "\\neq ";
Ct[8804] = "\\leq ";
Ct[8805] = "\\geq ";
Ct[8773] = "\\cong ";
Ct[8719] = "\\prod ";
Ct[8721] = "\\sum ";
Ct[8723] = "\\mp ";
Ct[8747] = "\\int ";
Ct[8748] = " d";
Ct[8750] = "\\oint ";
Ct[8751] = "\\oiint ";
Ct[8752] = "\\oiiint ";
Ct[8733] = "\\propto ";
Ct[8789] = "";
Ct[8734] = "\\infty ";
Ct[8801] = "\\equiv ";
Ct[8594] = "\\to ";
Ct[8592] = "\\gets ";
Ct[8226] = "\\cdot";
Ct[8592] = "\\leftarrow ";
Ct[8594] = "\\rightarrow ";
Ct[8596] = "\\leftrightarrow ";
Ct[8656] = "\\Leftarrow ";
Ct[8658] = "\\Rightarrow ";
Ct[8810] = "\\ll ";
Ct[8811] = "\\gg ";
Ct[8660] = "\\Leftrightarrow ";
Ct[8704] = "\\forall ";
Ct[8707] = "\\exists ";
Ct[8708] = "\\nexists ";
Ct[8706] = "\\partial ";
Ct[8711] = "\\nabla ";
Ct[8727] = "\\ast ";
Ct[8224] = "\\dagger ";
Ct[8225] = "\\ddagger ";
Ct[8240] = "";
Ct[8242] = "\\prime ";
Ct[8243] = "\\prime\\prime ";
Ct[8466] = "\\mathcal{L}";
Ct[8497] = "\\mathcal{F}";
Ct[8461] = "\\mathbb{H}";
Ct[8469] = "\\mathbb{N}";
Ct[8484] = "\\mathbb{Z}";
Ct[8474] = "\\mathbb{Q}";
Ct[8477] = "\\Re ";
Ct[8450] = "\\mathbb{C}";
Ct[1488] = "\\aleph ";
Ct[8743] = "\\wedge ";
Ct[8744] = "\\vee ";
Ct[8745] = "\\cap ";
Ct[8746] = "\\cup ";
Ct[8834] = "\\subset ";
Ct[8835] = "\\supset ";
Ct[8712] = "\\in ";
Ct[8715] = "\\ni ";
Ct[8838] = "\\subseteq ";
Ct[8839] = "\\supseteq ";
Ct[8713] = "\\notin ";
Ct[8716] = "";
Ct[8728] = "\\circ ";
Ct[8836] = "";
Ct[8837] = "";
Ct[8722] = "-";
Ct[8739] = "\\amp ";
Ct[8739] = "|";
Ct[8853] = "\\oplus ";
Ct[8709] = "\\oslash ";
Ct[8854] = "\\ominus ";
Ct[8736] = "\\angle ";
Ct[8736] = "\\measuredangle ";
Ct[8738] = "\\measuredangle ";
Ct[8737] = "";
Ct[8738] = "";
Ct[8735] = "";
Ct[8741] = "\\| ";
Ct[8855] = "\\otimes ";
Ct[8869] = "\\bot ";
Ct[8943] = "\\cdots ";
Ct[8944] = "\\iddots ";
Ct[8945] = "\\ddots";
Ct[9001] = "\\rangle ";
Ct[9002] = "\\langle ";
Ct[9476] = "\\ldots ";
Ct[11100]="C";//constants of integration
for (iAl=11101;iAl<=11110;iAl++) {Ct[iAl]="C_{"+(iAl-11100)+"}"}//constants of integration
const tDelimiter = ["_",",","!","=","<",">","|","+","-","*","^","/","{","}","(",")","\\"," "];
//
function texExport(latXpr) { //convert MG format to LaTeX
    latXpr += "";
    if (latXpr == "NaN" || latXpr == "undefined") {return "undefined"}
    latXpr = cFunc(latXpr); //convert to func format
    latXpr = dFunc(latXpr, "latex"); //process functions
    //clean up extra parens
    latXpr = latXpr.replace(/\(/g,"%");
    var sCount = strCount(latXpr,"%");
    for (var nXs=0;nXs<sCount;nXs++) {
        var lPar = 1;
        var rPar = 0;
        var bSym = latXpr.indexOf("%")+1;
        var lSym = latXpr.length;
        for (var iXs=bSym;iXs<lSym;iXs++) {
            if (latXpr.charAt(iXs) == "%" ) {lPar++}
            if (latXpr.charAt(iXs) == ")" ) {rPar++}
            if (lPar == rPar) {break;}
        }
        var strg = latXpr.substr(bSym,iXs-bSym);
        if (latXpr.substr(bSym-1,7) == "%<Xdiv>" && latXpr.substr(iXs-6,7) == "<Xdve>)" && latXpr.substr(iXs+1,1) != "^" && strg.search(/\<Xdve\>(.*)\<Xdiv\>/) == -1) {
            latXpr = latXpr.substr(0,bSym-1)+strg+latXpr.substr(iXs+1,lSym);
        }
        else {
            latXpr = latXpr.substr(0,bSym-1)+"("+strg+")"+latXpr.substr(iXs+1,lSym);
        }
    }
    latXpr = latXpr.replace(/\<Xcel\>/g,",&").replace(/\<Xrow\>/g,"\\left\\{\\begin{array}{1}").replace(/\<Xrwe\>/g,"\\end{array}\\right\\}"); //resolve arrays
    latXpr = latXpr.replace(/\<X\w\w\w\>/g,"").replace(/\%/g,"("); //clean up tags
    //resolve symbols
    sCount = strCount(latXpr,"Cv[");
    for (var nXf=0;nXf<sCount;nXf++) {latXpr = latXpr.replace(/Cv\[\d+\]/,Ct[(latXpr.match(/Cv\[\d+\]/)+"").replace(/Cv\[(\d+)\]/,"$1")])} //resolve Cv[] symbols
    latXpr = latXpr.replace(/\(/g,"\\left(").replace(/\)/g,"\\right)").replace(/\\/g," \\").replace(/  /g," ").replace(/ _/g,"_").replace(/_ /g,"_").replace(/ \^/g,"^").replace(/\^ /g,"^").replace(/ \[/g,"[").replace(/\\ \\/g,"\\\\");//cleanup
    return latXpr;
}
//
function texImport(mgXpr) { //convert LaTeX to MG format
    function asciiTest(xA) {if ((xA >= 65 && xA <= 90) || (xA >= 97 && xA <= 122)) {return true} return false} //test for ascii symbols
    function funcselect(func,key) {return funcMap[func][key]}
    function matI(xM) {
        var mArray = xM.split("\\\\");
        var mReturn = ""
        for (var iM in mArray) {mArray[iM] = mArray[iM].split("&")}
        for (var iR in mArray) {
            mReturn = mReturn + "mat(" + mArray[iR] + ")"
            if (iR < mArray.length-1) {mReturn = mReturn + ","}
        }
        return "mat(" + mReturn + ")"
    }
    //
    const ulSymbols = ["\\int","\\sum","\\prod","\\cap","\\cup"];
    const ulFuncs  =  ["itg(","sum(","prd(","cap(","cup("];
    const lBrackets = ["{","[","|"];
    const rBrackets = ["}","]","|"];
    var symTemp = "",tTemp = "",tFunc = 0,nXf = 0,nXs = 0,nXi = 0,parmU = {},parmL = {},limitL = {},limitU = {},limitX = {},operand = {};
    if (mgXpr == "NaN" || mgXpr == "undefined") {return "undefined"}
    mgXpr += " ";
    mgXpr = mgXpr.replace(/\\big/g,"\\");//fix big
    mgXpr = mgXpr.replace(/\"/g,"\\").replace(/\'/g,"\\");//remove quotes
    mgXpr = mgXpr.replace(/\\(.)/g," \\$1").replace(/ \\\{/g,"\\{").replace(/ \\\}/g,"\\}");//fix slash whitespace
    mgXpr = mgXpr.replace(/\s+\{/g,"{").replace(/\s+\}/g,"}").replace(/\{\s+/g,"{").replace(/\}\s+/g,"}"); //fix brace whitespaces
    mgXpr = mgXpr.replace(/\{matrix\}/g,"{bmatrix}").replace(/\{pmatrix\}/g,"{bmatrix}").replace(/\{vmatrix\}/g,"{bmatrix}").replace(/\{Vmatrix\}/g,"{bmatrix}"); //convert all matrices to bmatrix
    var sCount = strCount(mgXpr,"\\begin{bmatrix}"); //convert matrices
    for (nXf=0;nXf<sCount;nXf++) {
        var rTemp = mgXpr.substr(mgXpr.lastIndexOf("\\begin{bmatrix}")+"\\begin{bmatrix}".length,mgXpr.length);
        var mTemp = rTemp.substr(0,rTemp.indexOf("\\end{bmatrix}"));
        mgXpr = mgXpr.replace("\\begin{bmatrix}"+mTemp+"\\end{bmatrix}",matI(mTemp));
    }
    mgXpr = mgXpr.replace(/\s+/g," ").replace(/\\/g," \\").replace(/ _/g,"_").replace(/_ /g,"_").replace(/ \^/g,"^").replace(/\^ /g,"^").replace(/ \[/g,"[").replace(/ \(/g,"(").replace(/\\left /g,"\\left").replace(/\\right /g,"\\right");//fix whitespaces
    sCount = strCount(mgXpr,"\\\\");//convert line breaks
    for (nXs=0;nXs<sCount;nXs++) {mgXpr = mgXpr.replace(/\\\\/," ")}
    mgXpr = mgXpr.replace(/\\,/g," ").replace(/\\:/g," ").replace(/\\;/g," ").replace(/\\!/g," ").replace(/\\ /g,""); //fix special
    if (mgXpr.split("{").length != mgXpr.split("}").length) {Cs[9998] = "<span style='color:red'>Unmatched brackets</span>";return "Cv[9998]"} //check parens
    mgXpr = mgXpr.replace(/\\left\[/g,"sbr(").replace(/\\left\{/g,"cbr(").replace(/\\right\]/g,")").replace(/\\right\}/g,")");//convert brackets
    sCount = strCount(mgXpr,"\\");//convert left/right paren
    for (nXf=0;nXf<sCount;nXf++) {mgXpr = mgXpr.replace(/\\left\(/,"(").replace(/\\right\)/,")").replace(/\\left\\\(/,"(").replace(/\\right\\\)/,")")}
    for (var iBr in lBrackets){//convert left/right brackets
        sCount = strCount(mgXpr,"\\left\\"+lBrackets[iBr]);
        for (nXf=0;nXf<sCount;nXf++) {mgXpr = mgXpr.replace("\\left\\"+lBrackets[iBr],"cbr(").replace("\\right\\"+rBrackets[iBr],")")   }
    }
    sCount = strCount(mgXpr,"\\frac");//convert frac
    for (nXs=0;nXs<sCount;nXs++) {
        var numerator = parseBrackets(mgXpr,mgXpr.indexOf("\\frac")+5);
        var denominator = parseBrackets(mgXpr,numerator.end+1);
        if (numerator.inside.indexOf("+") > -1 || numerator.inside.indexOf("-") > -1){numerator.inside = "("+numerator.inside+")"}
        if (denominator.inside.indexOf("+") > -1 || denominator.inside.indexOf("-") > -1){denominator.inside = "("+denominator.inside+")"}
        mgXpr = mgXpr.substr(0,mgXpr.indexOf("\\frac"))+" ("+numerator.inside+"/"+denominator.inside+") "+mgXpr.substr(denominator.end+1,mgXpr.length);
    }
    sCount = strCount(mgXpr,"\\sqrt[");//convert sqrt_n
    for (nXf=0;nXf<sCount;nXf++) {
        parmU = parseBrackets(mgXpr,mgXpr.indexOf("\\sqrt[")+6);
        parmL = parseBrackets(mgXpr,parmU.end+2);
        mgXpr = mgXpr.substr(0,mgXpr.indexOf("\\sqrt["))+" nrt("+parmU.inside+","+parmL.inside+") "+mgXpr.substr(parmL.end+1,mgXpr.length);
    }
    sCount = strCount(mgXpr,"\\log_");//convert log_n
    for (nXf=0;nXf<sCount;nXf++) {
        parmU = parseBrackets(mgXpr,mgXpr.indexOf("\\log_")+5);
        parmL = parseBrackets(mgXpr,parmU.end+1);
        mgXpr = mgXpr.substr(0,mgXpr.indexOf("\\log_"))+" lgn("+parmU.inside+","+parmL.inside+") "+mgXpr.substr(parmL.end+1,mgXpr.length);
    }
    for (tFunc in funcMap) {//convert functions
        sCount = strCount(mgXpr,funcselect(tFunc,"texfunc"));
        for (nXf=0;nXf<sCount;nXf++) {
            symTemp = mgXpr.substr(mgXpr.indexOf(funcselect(tFunc,"texfunc")),mgXpr.length);
            for (nXi=1;nXi<symTemp.length;nXi++) {if (tDelimiter.indexOf(symTemp.charAt(nXi)) > -1){break}}
            if (symTemp.charAt(nXi) == "^") {//convert inverse fn^-1
                if (symTemp.substr(nXi,5) =="^{-1}") {
                    symTemp = symTemp.substr(1,nXi-1);
                    if (funcselect(tFunc,"texfunc") == "\\"+symTemp && funcselect(tFunc,"trig")) {
                        operand = parseBrackets(mgXpr,mgXpr.indexOf(funcselect(tFunc,"texfunc"))+funcselect(tFunc,"texfunc").length+5);
                        mgXpr = mgXpr.substr(0,mgXpr.indexOf(funcselect(tFunc,"texfunc")))+" "+funcselect(tFunc,"invfunc")+"("+operand.inside+")"+mgXpr.substr(operand.end,mgXpr.length);
                    }
                }
                else {//convert fn powers
                    var superscript = parseBrackets(mgXpr,mgXpr.indexOf(funcselect(tFunc,"texfunc"))+funcselect(tFunc,"texfunc").length+1);
                    operand = parseBrackets(mgXpr,superscript.end+1);
                    mgXpr = mgXpr.substr(0,mgXpr.indexOf(funcselect(tFunc,"texfunc")))+" "+tFunc+"("+operand.inside+")^("+superscript.inside+")"+mgXpr.substr(operand.end+1,mgXpr.length);
                }
            }
            else {//convert all other fn
                symTemp = symTemp.substr(1,nXi-1);
                if (funcselect(tFunc,"texfunc") == "\\"+symTemp) {
                    operand = parseBrackets(mgXpr,mgXpr.indexOf(funcselect(tFunc,"texfunc"))+funcselect(tFunc,"texfunc").length);
                    mgXpr = mgXpr.substr(0,mgXpr.indexOf(funcselect(tFunc,"texfunc")))+" "+tFunc+"("+operand.inside+")"+mgXpr.substr(operand.end+1,mgXpr.length);
                }
            }
        }
    }
    for (var nXt in ulSymbols) {//convert u/l functions
        sCount = strCount(mgXpr,ulSymbols[nXt]+"_");
        for (nXf=0;nXf<sCount;nXf++) {
            limitL = parseBrackets(mgXpr,mgXpr.indexOf(ulSymbols[nXt]+"_")+ulSymbols[nXt].length+1);
            limitU = parseBrackets(mgXpr,limitL.end+1);
            limitL.inside = limitL.inside.replace("=","Cv[61]");
            if (mgXpr.charAt(limitL.end+1) == "^") {mgXpr = mgXpr.substr(0,mgXpr.indexOf(ulSymbols[nXt]+"_"))+ulFuncs[nXt]+limitU.inside+","+limitL.inside+") "+mgXpr.substr(limitU.end+1,mgXpr.length)}
            else {mgXpr = mgXpr.substr(0,mgXpr.indexOf(ulSymbols[nXt]+"_"))+ulFuncs[nXt]+","+limitL.inside+") "+mgXpr.substr(limitL.end+1,mgXpr.length)}
        }
        sCount = strCount(mgXpr,ulSymbols[nXt]+"^");
        for (nXf=0;nXf<sCount;nXf++) {
            limitU= parseBrackets(mgXpr,mgXpr.indexOf(ulSymbols[nXt]+"^")+ulSymbols[nXt].length+1);
            limitL = parseBrackets(mgXpr,limitU.end+1);
            limitL.inside = limitL.inside.replace("=","Cv[61]");
            if (mgXpr.charAt(limitU.end+1) == "_") {mgXpr = mgXpr.substr(0,mgXpr.indexOf(ulSymbols[nXt]+"^"))+ulFuncs[nXt]+limitU.inside+","+limitL.inside+") "+mgXpr.substr(limitL.end+1,mgXpr.length)}
            else {mgXpr = mgXpr.substr(0,mgXpr.indexOf(ulSymbols[nXt]+"^"))+ulFuncs[nXt]+limitU.inside+",) "+mgXpr.substr(limitU.end+1,mgXpr.length)}
        }
    }

    sCount = strCount(mgXpr,"\\lim_");//convert /lim
    for (nXf=0;nXf<sCount;nXf++) {
        limitX = parseBrackets(mgXpr,mgXpr.indexOf("\\lim_")+5);
        limitU = [limitX.inside,""];
        if (limitX.inside.indexOf("\\to") > -1) {limitU = limitX.inside.split("\\to")}
        if (limitX.inside.indexOf("\\rightarrow") > -1) {limitU = limitX.inside.split("\\rightarrow")}
        mgXpr = mgXpr.substr(0,mgXpr.indexOf("\\lim_"))+" lim("+limitU[0]+","+limitU[1]+") "+mgXpr.substr(limitX.end+1,mgXpr.length)
    }
    sCount = strCount(mgXpr,"_");//convert subscripts
    for (nXf=0;nXf<sCount;nXf++) {
        tTemp = mgXpr.charAt(mgXpr.indexOf("_")+1)
        if (tTemp == "{" || tTemp == "(") {
            var subscript = parseBrackets(mgXpr,mgXpr.indexOf("_"));
            mgXpr = mgXpr.substr(0,mgXpr.indexOf("_"))+" sbt("+subscript.inside+") "+mgXpr.substr(subscript.end+1,mgXpr.length)
        }
        else {
            for (nXi=mgXpr.indexOf("_")+1;nXi<mgXpr.length;nXi++) {if (tDelimiter.indexOf(mgXpr.charAt(nXi)) > -1){break}}
            if (mgXpr.substr(mgXpr.indexOf("_"),nXi).search(/[a-z][a-z][a-z]\(\)/i) == -1) {mgXpr = mgXpr.substr(0,mgXpr.indexOf("_"))+" sbt("+tTemp+") "+mgXpr.substr(mgXpr.indexOf("_")+2,mgXpr.length)}
            else {mgXpr = mgXpr.replace(/_/,"")}
        }
    }

    sCount = strCount(mgXpr,"^");//convert superscripts
    for (nXf=0;nXf<sCount;nXf++) {
        tTemp = mgXpr.charAt(mgXpr.indexOf("^")+1)
        if (tTemp == "{" || tTemp == "(") {
            var superscr = parseBrackets(mgXpr,mgXpr.indexOf("^")+1);
            if (superscr.inside.length > 1) {mgXpr = mgXpr.substr(0,mgXpr.indexOf("^"))+" ^("+superscr.inside+") "+mgXpr.substr(superscr.end+1,mgXpr.length)}
        }
    }
    sCount = strCount(mgXpr,"\\");//convert symbols
    for (nXf=0;nXf<sCount;nXf++) {
        symTemp = mgXpr.substr(mgXpr.indexOf("\\"),mgXpr.length);
        for (nXi=1;nXi<symTemp.length;nXi++) {if (tDelimiter.indexOf(symTemp.charAt(nXi)) > -1){break}}
        symTemp = symTemp.substr(1,nXi-1);
        for (var iAl=1;iAl<=9500;iAl++) {if (typeof Ct[iAl] != "undefined" && (Ct[iAl] == "\\"+symTemp || Ct[iAl] == "\\"+symTemp+" ")) {mgXpr = mgXpr.replace("\\"+symTemp," Cv["+iAl+"]");break} }
    }
    sCount = strCount(mgXpr,"\\");//remove unknown tags
    for (nXf=0;nXf<sCount;nXf++) {
        symTemp = mgXpr.substr(mgXpr.indexOf("\\"),mgXpr.length);
        for (nXi=1;nXi<symTemp.length;nXi++) {if (",!=<>|+-*^/{}()\\ ".indexOf(symTemp.charAt(nXi)) > -1){break}}
        symTemp = symTemp.substr(1,nXi-1);
        mgXpr = mgXpr.replace("\\"+symTemp,"");
    }
    for (nXf=0;nXf<mgXpr.length;nXf++) {//convert variables
        for (tFunc in funcMap) {if (mgXpr.substr(nXf,4) == tFunc+"(") {nXf = nXf+3;break}}
        if (mgXpr.substr(nXf,3) == "Cv[") {nXf = nXf+3}
        var asciiChar = mgXpr.charAt(nXf).charCodeAt(0);
        if (asciiTest(asciiChar)) {mgXpr = mgXpr.substr(0,nXf)+"Cv["+(asciiChar+10000)+"]"+mgXpr.substr(nXf+1,mgXpr.length);nXf = nXf+6}
    }
    mgXpr = mgXpr.replace(/ /g,""); //cleanup spaces
    mgXpr = mgXpr.replace(/\(Cv\[10100\]\)/g,"Cv[10100]");
    sCount = strCount(mgXpr,"Cv[10100]");//convert derivatives
    for (nXf=0;nXf<sCount;nXf++) {
        mgXpr = mgXpr.replace(/\(Cv\[10100\]\/Cv\[10100\]Cv\[(\d+)\]\)/,"tdr(Cv[$1])");
        mgXpr = mgXpr.replace(/\(Cv\[10100\]Cv\[(\d+)\]\/Cv\[10100\]Cv\[(\d+)\]\)/,"sdr(Cv[$1],Cv[$2])");
        //nth derivative
        mgXpr = mgXpr.replace(/\(Cv\[10100\]\^\d+\/Cv\[10100\]Cv\[(\d+)\]\^(\d+)\)/,"tdr(Cv[$1],$2)");
        mgXpr = mgXpr.replace(/\(Cv\[10100\]\^\d+Cv\[(\d+)\]\/Cv\[10100\]Cv\[(\d+)\]\^(\d+)\)/,"sdr(Cv[$1],Cv[$2],$3)");
    }
    mgXpr = mgXpr.replace(/\(Cv\[8706\]\)/g,"Cv[8706]");
    sCount = strCount(mgXpr,"Cv[8706]");//convert partial derivatives
    for (nXf=0;nXf<sCount;nXf++) {
        mgXpr = mgXpr.replace(/\(Cv\[8706\]\/Cv\[8706\]Cv\[(\d+)\]\)/,"idr(Cv[$1])");
        mgXpr = mgXpr.replace(/\(Cv\[8706\]Cv\[(\d+)\]\/Cv\[8706\]Cv\[(\d+)\]\)/,"psd(Cv[$1],Cv[$2])");
        //nth derivative
        mgXpr = mgXpr.replace(/\(Cv\[8706\]\^\d+\/Cv\[8706\]Cv\[(\d+)\]\^(\d+)\)/,"idr(Cv[$1],$2)");
        mgXpr = mgXpr.replace(/\(Cv\[8706\]\^\d+Cv\[(\d+)\]\/Cv\[8706\]Cv\[(\d+)\]\^(\d+)\)/,"psd(Cv[$1],Cv[$2],$3)");
    }
    sCount = strCount(mgXpr,"Cv[10100]");//convert differentials
    for (nXf=0;nXf<sCount;nXf++) {
        mgXpr = mgXpr.replace(/\{Cv\[10100\]\}/,"Cv[10100]").replace(/Cv\[10100\]Cv\[(\d+)\]/,"Cv[8748]Cv[$1]");
    }
    mgXpr = mgXpr.replace(/Cv\[10101\]/g,"Cv[8]").replace(/Cv\[10105\]/g,"Cv[46]").replace(/Cv\[215\]/g,"*"); //special variables
    mgXpr = mgXpr.replace(/ /g,"").replace(/\{/g,"").replace(/\}/g,"").replace(/_/g,"").replace(/\'/g,"Cv[8242]").replace(/\`/g,"Cv[8242]");//cleanup
    mgXpr = dedupBrackets(mgXpr);
    return mgXpr
}

// node.js export
if (typeof module ==  "object") {
    module.exports = {
        mgConfig:   mgConfig,
        Cv:         Cv,
        Cs:         Cs,
        funcMap:    funcMap,
        parseParens:function(xB,bSym) {return parseParens(xB,bSym)},
        cFunc:      function(expression) {return cFunc(expression)},
        mgExport:   function(expression) {return mgExport(expression)},
        htmlExport: function(expression) {return htmlExport(expression)},
        texExport:  function(expression) {return texExport(expression)},
        texImport:  function(expression) {return texImport(expression)},
        mgTranslate:function(expression,scale) {return mgTranslate(expression,scale)},
        mgOutput:   function(expression,scale) {return mgOutput(expression,scale)},
    }
}
//