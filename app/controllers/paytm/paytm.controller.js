var checksum = require("./checksum")


module.exports = {
    getRequest: (req, res) => {
        res.render("paytm/index");
    },
    request: (req, res) => {
        var paramlist = req.body;
        var paramArray = new Array();

        for(name in paramlist) {
            if(name == "PAYTM_MERCHANT_KEY") {
                var PAYTM_MERCHANT_KEY = paramlist[name];
            } else {
                paramArray[name] = paramlist[name];
            }
        }
        paramArray["CALLBACK_URL"] = "http://localhost:3001/api/paytm/request";
        checksum.genchecksum(paramArray, PAYTM_MERCHANT_KEY, (err, result) => {
            if(err) throw err;
            console.log(err)
            console.log('resut------------\n',result)
            var paytmParams = {
                "MID" : result.MID,        
                "WEBSITE" : result.WEBSITE,        
                "INDUSTRY_TYPE_ID" : result.INDUSRTY_TYPE_ID,        
                "CHANNEL_ID" : result.CHANNEL_ID,        
                "ORDER_ID" : result.ORDER_ID,        
                "CUST_ID" : result.CUST_ID,
                "TXN_AMOUNT" : result.TXN_AMOUNT,        
                "CALLBACK_URL" : result.CALLBACK_URL,
            };
                /* for Staging */
                var url = "https://securegw-stage.paytm.in/order/process";
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<html>');
                res.write('<head>');
                res.write('<title>Merchant Checkout Page</title>');
                res.write('</head>');
                res.write('<body>');
                res.write('<center><h1>Please do not refresh this page...</h1></center>');
                res.write('<form method="post" action="' + url + '" name="paytm_form">');
                for(var x in paytmParams){
                    res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
                }
                res.write('<input type="hidden" name="CHECKSUMHASH" value="' + result.CHECKSUMHASH + '">');
                res.write('</form>');
                res.write('<script type="text/javascript">');
                res.write('document.paytm_form.submit();');
                res.write('</script>');
                res.write('</body>');
                res.write('</html>');
                res.end();


            // res.render("paytm/request", {result});
        });
    },
    response: (req, res) => {
        console.log(req.body);
        if(req.body.RESP === '01') {
            res.render("paytm/response", {
                status: true,
                result: req.body
            });
        } else {
            res.render("paytm/response", {
                status: false,
                result: res.body
            })
        }
    }
}