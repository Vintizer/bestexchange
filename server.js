'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); // модуль для парсинга пути
const https = require('https');
var app = express();
const cheerio = require("cheerio");
var request = require('request');

function curPriceHere(arr) {
	const res = [];
	arr.forEach((e) => {
		if (e.type === "buy") {
			res.push([e.price]);
		}
	});
	return res;
}

function getData(url, callback) {
	https.get(url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			callback(body);
		});
	});
}
const getDataExmo = (cb) => {
	getData("https://api.exmo.com/v1/order_book/?pair=BTC_UAH", (body) => {
		cb(JSON.parse(body).BTC_UAH.bid);
	})
};
const getDataBtcTrade = (cb) => {
	getData("https://btc-trade.com.ua/api/deals/btc_uah", (body) => {
		cb(curPriceHere(JSON.parse(body)));
	})
};

const getBestExchange = () => {
	request('https://www.bestchange.ru/bitcoin-to-privat24-uah.html', function(error, response, body) {
		const $ = cheerio.load(body);
		const table = $("#content_table > tbody > tr");
		console.log(table.length);
		table.each((i, e) => {
			console.log(e.children[3].innerText());
		})
	});
};

app.use(bodyParser());
app.use(express.static(path.join(__dirname, "public")));
getBestExchange()
// getBestExchange((data)=> {
// 	var best = data;
// 	getDataExmo((data) => {
// 		var exmoDataArr = data;
// 		getData("btcTrade", (data) => {
// 			var btcTradeDataArr = data;
//
// 		})
// 	})
// });
app.get('/', function(req, res) {
});
// app.listen(1337, function(){
// 	console.log('Express server listening on port 1337');
// });