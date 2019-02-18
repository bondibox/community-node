// Written by @colradi for Community Node Super Representative Organization 
// contact on Telegram for scripting services t.me/CommunityNode
// GUI Interface coming soon!
//
//
// Script for airdroppin tokens (not TRX) based on SR votes (ratio can be configured)
//
/************************** Command line  USAGE    *******************************/
//This script ouput is the input for script tronair.js
// begin with NPM Libraries
//                        npm install tronvotes
//                        npm install tronix.js
//
// THIS File will set the SR Candidate whose voters you will be rewarding
// THIS File will set the AMOUNT of tokens you will be rewarding per-vote
//
// After configuring THIS file you will run
//                        node generateFile.js
// Which will output a file of voters and their WEIGHTED vote share
// Execute the airdrop after configuring tronair.js file
//                        node tronair.js votes_TDGy_2019_02_10at22_20_DONE.json
//
/************************** CONFIGURATION AREA **********************************/
// 
var candidate = "TDGy2M9qWBepSHDEutWWxWd1JZfmAed3BP"; //SR/candidate address from whom we want the votes details 
var multiplier = .00005; // i.e: 0.0005 for 1 HELP every 2000 votes
//TODO To change format different than JSON need to edit lines 15, 30 & 37 
//
// var filename = 'votes_TDGy_2019_02_10at22_20_DONE.json'; EXAMPLE of filename output
//
/************************** END CONFIGURATION *******************************/

var tv = require('tronvotes');
var fs = require('fs');
//change the candidate address for whatever candidate/SR you want to get the votes-list from
var voters = tv.getVoters(candidate, tv.format.JSON, multiplier); 
//var voters = tv.getVoters('TVMP5r12ymtNerq5KB4E8zAgLDmg2FqsEG',tv.formato.CSV); //cirptogirls, CSV
	


voters.then( function(data){ 
        //console.log(data.result); 
        console.log("Candidate: " + data.candidate);
        console.log("Total votes: " + data.total_votes );
        console.log("Number of voters: " + data.num_voters );
		
		console.log("\r\n\t\t\t\t\t\tWARNING ");
		console.log("Before doing the airdrop, please manually double-check *Total Votes* and *Number of voters* against tronscan webpage\r\n");
		
 		var filename = data.table_name + '.json';
		var path = __dirname + "\\" + filename;
		
	    fs.appendFile( path, data.result, function (err) {
			if (err) { 
				console.log("Error writing file" + path);  
			}else{
				console.log("Generated JSON file: " + filename );
				console.log("NEXT STEP, please type this command to do airdrop: \n\n\t\t node tronair.js " + filename );
			}
		}); 
 
 } );