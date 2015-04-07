var Crawler = require("crawler");
var url = require('url');
var link=process.argv[2]


var fetch=function(link){
	var host = url.parse(link).hostname;
	var phoneList=[];
	var emailIdList=[];
	var visited=[];
	var crawl= new Crawler({
		maxConnections : 10,
    
   		callback : function (error, result, $) {
      	
      		if(!error && result && result.headers && result.headers['content-type'].toLowerCase().indexOf("text/html") >= 0)
      		{
      			var page=result.body;
      			var res=page.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || []
      			res.forEach(function(email){
      				if(emailIdList.indexOf(email)==-1)
      				{
      					emailIdList.push(email)
      					console.log(email)
      				}
      			})

      			var res=page.match(/1[-\s.\/]?[\(]?\d{3}[\)]?[-\s.\/]?\d{3}[-\s.\/]?\d{4}/) || []
      			res.forEach(function(phoneNo){
      				if(phoneList.indexOf(phoneNo)==-1)
      				{
      					phoneList.push(phoneNo)
      					console.log(phoneNo)
      				}
      			})
      			
	      		
		        $('a').each(function(index, a) {
		            var toQueueUrl = $(a).attr('href');
		           	if (toQueueUrl){
		           		
			           	if(visited.indexOf(toQueueUrl)==-1)	
			            {
			            	
					            var parsedUrl = url.parse(toQueueUrl);
					            if (parsedUrl.hostname === null || parsedUrl.hostname == host)
					            {
					            	toQueueUrl = url.resolve(link,toQueueUrl);
				                    crawl.queue(toQueueUrl);
				                                                                              
				                }
			            	visited.push(toQueueUrl)
		                }
		            }
		        });
	    	}
		}
	});
	crawl.queue(link);
};

fetch(link);