module.exports = function(){

	// takes these two and exposes a common method to define an api
	// presets for which HTTP verb to use depending on words
	// hooks for everything

	var api = {};

	api.transports = {
		'http': {
			_extractParams: function(req){
				var params = {};
				var paramSources = [req.params, req.query, req.body];
				for( var i = 0; i < paramSources.length; i++ ){
					for( var key in paramSources[i] ){
						params[key] = paramSources[i][key];
					}
				}
				return params;
			},
			route: function(route, handler){
				// apply callback with session and remote args and optional flag 'http'
				// and a sendResponse function that will respond appropriately
				var method = route.indexOf('save') == 0 ? 'get' : route.indexOf('delete') == 0 ? 'del' : 'get';
				http[method](route, function(req, res){
					var params = api.transports.http._extractParams(req);
					handler(params, function(data, err){
						api.transports.http.respond(res, data, err);
					});
				});
			},
			respond: function(res, data, err){
				if( err ){
					res.json(err);
				}else{
					res.json(data);
				}
			}
		}
		// , 'now': {
		// 	route: function(route, callback){
		// 		function(callback, args){ .. }
		// 		now.everyone.now[route] = api.rpcCallback(callback);
		// 	},
		// 	respond: function(response, err){
		// 		api.now. ... 
		// 	}
		// }
	};

	// need a way to look up responses
	api.use = function(type, transport){
		transports[type].host = transport;
		return this;
	};

	api.map = function(route, handler){
		for( var transport in api.transports ){
			if( transport.host ){
				transport.route( route, handler );
			}
		}
		return this;
	};

	return api;
};